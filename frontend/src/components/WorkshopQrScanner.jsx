import CameraAltRounded from '@mui/icons-material/CameraAltRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import QrCodeScannerRounded from '@mui/icons-material/QrCodeScannerRounded';
import { useEffect, useRef, useState } from 'react';
import { extractWorkshopTeamCode } from '../lib/workshopQrCode';

function cameraErrorMessage(error) {
  if (error?.name === 'NotAllowedError') {
    return 'A câmera foi bloqueada. Permita o acesso nas configurações do navegador ou digite o código.';
  }
  if (error?.name === 'NotFoundError') {
    return 'Nenhuma câmera foi encontrada neste aparelho. Digite o código da equipe.';
  }
  if (error?.name === 'NotReadableError') {
    return 'A câmera está sendo usada por outro aplicativo. Feche-o e tente novamente.';
  }
  return 'Não foi possível abrir a câmera. Você ainda pode digitar o código de oito dígitos.';
}

function stopVideo(video) {
  const stream = video?.srcObject;
  if (stream && typeof stream.getTracks === 'function') {
    stream.getTracks().forEach((track) => track.stop());
  }
  if (video) video.srcObject = null;
}

export default function WorkshopQrScanner({ disabled = false, onCode }) {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const onCodeRef = useRef(onCode);
  const [open, setOpen] = useState(false);
  const [starting, setStarting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    onCodeRef.current = onCode;
  }, [onCode]);

  useEffect(() => {
    if (!open) return undefined;

    let cancelled = false;
    let localControls = null;
    let completed = false;
    const videoElement = videoRef.current;

    async function startScanner() {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('camera_not_supported');
      }

      const { BrowserQRCodeReader } = await import('@zxing/browser');
      const reader = new BrowserQRCodeReader(undefined, {
        delayBetweenScanAttempts: 180,
      });
      const controls = await reader.decodeFromConstraints(
        {
          audio: false,
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        videoElement,
        (result, _decodeError, callbackControls) => {
          if (!result || completed || cancelled) return;
          const code = extractWorkshopTeamCode(result.getText());
          if (!code) {
            setError('Este QR Code não pertence a uma equipe da oficina. Aponte para o código exibido pelo professor.');
            return;
          }

          completed = true;
          callbackControls.stop();
          onCodeRef.current?.(code);
          setMessage(`Equipe ${code} identificada.`);
          setError('');
          setOpen(false);
        },
      );

      if (cancelled) {
        controls.stop();
        return;
      }
      localControls = controls;
      controlsRef.current = controls;
      setStarting(false);
    }

    startScanner().catch((cause) => {
      if (cancelled) return;
      setStarting(false);
      setError(cameraErrorMessage(cause));
    });

    return () => {
      cancelled = true;
      localControls?.stop();
      controlsRef.current?.stop();
      controlsRef.current = null;
      stopVideo(videoElement);
    };
  }, [open]);

  function closeScanner() {
    controlsRef.current?.stop();
    controlsRef.current = null;
    stopVideo(videoRef.current);
    setOpen(false);
    setStarting(false);
  }

  return (
    <div className="mt-3">
      <button
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#49c0f8]/50 bg-[#49c0f8]/10 px-4 text-sm font-black text-[#8edcff] transition hover:border-[#8edcff] hover:bg-[#49c0f8]/15 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        disabled={disabled}
        onClick={() => {
          setStarting(true);
          setError('');
          setMessage('');
          setOpen(true);
        }}
        type="button"
      >
        <QrCodeScannerRounded sx={{ fontSize: 20 }} /> Ler QR Code da equipe
      </button>

      {open && (
        <div className="mt-3 overflow-hidden rounded-2xl border border-[#49c0f8]/40 bg-[#101c21] p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-white">Aponte para o QR Code</p>
              <p className="mt-0.5 text-xs text-[#a5b7c2]">Mantenha o código inteiro dentro do quadro.</p>
            </div>
            <button
              aria-label="Fechar leitor de QR Code"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#53666f] text-[#dbe7ed] hover:border-rose-400 hover:text-rose-300"
              onClick={closeScanner}
              type="button"
            >
              <CloseRounded />
            </button>
          </div>

          <div className="relative aspect-[4/3] max-h-[420px] overflow-hidden rounded-xl bg-black">
            <video
              aria-label="Prévia da câmera para leitura do QR Code"
              className="h-full w-full object-cover"
              muted
              playsInline
              ref={videoRef}
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-[16%] rounded-2xl border-4 border-[#58cc02] shadow-[0_0_0_999px_rgba(0,0,0,0.28)]" />
            {starting && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55 text-white">
                <CameraAltRounded sx={{ fontSize: 34 }} />
                <span className="text-sm font-black">Abrindo a câmera…</span>
              </div>
            )}
          </div>
        </div>
      )}

      {message && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#79e72e]" role="status">
          <CheckCircleRounded sx={{ fontSize: 17 }} /> {message}
        </p>
      )}
      {error && <p className="mt-2 text-xs font-bold leading-5 text-rose-300" role="alert">{error}</p>}
    </div>
  );
}
