import { useId, useMemo, useState } from 'react';
import Check from '@mui/icons-material/Check';
import GroupsOutlined from '@mui/icons-material/GroupsOutlined';
import Person from '@mui/icons-material/Person';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ProfileAvatar from './ProfileAvatar';
import {
  AVATAR_OPTIONS,
  CLASS_OPTIONS,
  isValidAvatarId,
  isValidClassName,
} from '../constants/profileOptions';

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;
const PROFILE_PHOTO_DIMENSION = 320;
const MAX_STORED_PHOTO_LENGTH = 400_000;
const ALLOWED_PHOTO_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

function normalizeText(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function validateProfile({ nome, turma, avatarId, photoUrl }) {
  if (nome.length < 2) {
    return 'Digite um nome preferido com pelo menos 2 caracteres.';
  }

  if (!isValidClassName(turma)) {
    return 'Selecione sua turma: 3º DSA ou 3º DSB.';
  }

  if (!avatarId && !photoUrl) {
    return 'Escolha uma Capi profissional ou envie uma foto de perfil.';
  }

  return '';
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error('O arquivo selecionado não contém uma imagem válida.'));
    image.src = dataUrl;
  });
}

async function createProfilePhoto(file) {
  if (!ALLOWED_PHOTO_TYPES.has(file.type)) {
    throw new Error('Escolha uma imagem JPG, PNG ou WebP.');
  }

  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    throw new Error('A foto deve ter no máximo 5 MB.');
  }

  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(originalDataUrl);
  const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
  const sourceX = (image.naturalWidth - sourceSize) / 2;
  const sourceY = (image.naturalHeight - sourceSize) / 2;
  const canvas = document.createElement('canvas');
  canvas.width = PROFILE_PHOTO_DIMENSION;
  canvas.height = PROFILE_PHOTO_DIMENSION;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('O navegador não conseguiu preparar a foto.');
  }

  context.fillStyle = '#0f172a';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const preparedPhoto = canvas.toDataURL('image/jpeg', 0.84);

  if (preparedPhoto.length > MAX_STORED_PHOTO_LENGTH) {
    throw new Error(
      'Não foi possível reduzir esta foto. Escolha uma imagem mais simples.',
    );
  }

  return preparedPhoto;
}

export default function ProfileForm({
  initialProfile,
  onSubmit,
  submitLabel = 'Salvar perfil',
  requireChanges = false,
}) {
  const photoInputId = useId();
  const initialValues = useMemo(() => {
    const initialAvatarId = isValidAvatarId(initialProfile?.avatar_id)
      ? initialProfile.avatar_id
      : '';

    return {
      nome: initialProfile?.nome ?? '',
      turma: isValidClassName(initialProfile?.turma)
        ? initialProfile.turma
        : '',
      avatarId: initialAvatarId,
      photoUrl: initialAvatarId ? '' : initialProfile?.avatar_url ?? '',
    };
  }, [initialProfile]);

  const [nome, setNome] = useState(initialValues.nome);
  const [turma, setTurma] = useState(initialValues.turma);
  const [avatarId, setAvatarId] = useState(initialValues.avatarId);
  const [photoUrl, setPhotoUrl] = useState(initialValues.photoUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const normalizedProfile = {
    nome: normalizeText(nome),
    turma,
    avatarId,
    photoUrl: avatarId ? '' : photoUrl,
  };

  const hasChanges =
    normalizedProfile.nome !== normalizeText(initialValues.nome) ||
    normalizedProfile.turma !== initialValues.turma ||
    normalizedProfile.avatarId !== initialValues.avatarId ||
    normalizedProfile.photoUrl !== initialValues.photoUrl;

  const selectAvatar = (selectedAvatarId) => {
    setAvatarId(selectedAvatarId);
    setPhotoUrl('');
    setErrorMessage('');
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setErrorMessage('');
    setIsProcessingPhoto(true);

    try {
      const preparedPhoto = await createProfilePhoto(file);
      setPhotoUrl(preparedPhoto);
      setAvatarId('');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    const validationError = validateProfile(normalizedProfile);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        nome: normalizedProfile.nome,
        turma: normalizedProfile.turma,
        avatar_id: normalizedProfile.avatarId || null,
        avatar_url: normalizedProfile.photoUrl || null,
      });
    } catch (error) {
      setErrorMessage(
        error?.message ||
          'Não foi possível salvar o perfil. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isSubmitting || isProcessingPhoto;

  return (
    <form className="space-y-7" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#dbe7ed]">
            <Person className="text-[#58cc02]" sx={{ fontSize: 18 }} />
            Nome preferido
          </span>
          <input
            autoComplete="name"
            className="w-full rounded-2xl border border-[#37464f] bg-[#1f2d33] px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#58cc02] focus:ring-2 focus:ring-[#58cc02]/20 disabled:opacity-60 placeholder:text-[#78909c]"
            disabled={isBusy}
            maxLength={40}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Como devemos chamar você?"
            required
            type="text"
            value={nome}
          />
          <span className="mt-1.5 block text-right text-xs text-[#78909c] font-medium">
            {nome.length}/40
          </span>
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#dbe7ed]">
            <GroupsOutlined className="text-[#58cc02]" sx={{ fontSize: 18 }} />
            Turma
          </span>
          <select
            className="w-full rounded-2xl border border-[#37464f] bg-[#1f2d33] px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#58cc02] focus:ring-2 focus:ring-[#58cc02]/20 disabled:opacity-60 cursor-pointer"
            disabled={isBusy}
            onChange={(event) => setTurma(event.target.value)}
            required
            value={turma}
          >
            <option disabled value="">
              Selecione sua turma
            </option>
            {CLASS_OPTIONS.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
          <span className="mt-1.5 block text-xs text-[#78909c] font-medium">
            Turmas disponíveis: 3º DSA e 3º DSB.
          </span>
        </label>
      </div>

      <fieldset disabled={isBusy}>
        <legend className="text-xs font-black uppercase tracking-wider text-[#dbe7ed]">
          Escolha sua Capi profissional
        </legend>
        <p className="mt-1 text-xs leading-relaxed text-[#a5b7c2]">
          Você também pode enviar uma foto pessoal logo abaixo.
        </p>

        <div
          aria-label="Avatares de capivaras profissionais"
          className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
          role="radiogroup"
        >
          {AVATAR_OPTIONS.map((avatar) => {
            const isSelected = avatar.id === avatarId;

            return (
              <button
                aria-checked={isSelected}
                aria-label={avatar.label}
                className={`relative flex min-h-36 flex-col items-center justify-center gap-2 rounded-2xl border p-2.5 transition focus:outline-none focus:ring-2 focus:ring-[#58cc02] cursor-pointer ${
                  isSelected
                    ? 'border-[#58cc02] bg-[#58cc02]/10 ring-2 ring-[#58cc02]/40 shadow-lg'
                    : 'border-[#37464f] bg-[#17262c] hover:border-[#536670]'
                }`}
                key={avatar.id}
                onClick={() => selectAvatar(avatar.id)}
                role="radio"
                type="button"
              >
                <ProfileAvatar avatarId={avatar.id} size="lg" />
                <span className="text-center text-[10px] font-bold leading-tight text-[#dbe7ed]">
                  {avatar.label}
                </span>
                {isSelected && (
                  <Check
                    className="absolute right-1.5 top-1.5 rounded-full bg-[#1f2d33] text-[#58cc02]"
                    sx={{ fontSize: 18 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="relative flex items-center gap-3">
        <span className="h-px flex-1 bg-white/[0.08]" />
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#78909c]">
          ou use sua foto
        </span>
        <span className="h-px flex-1 bg-white/[0.08]" />
      </div>

      <div
        className={`flex flex-col items-center gap-4 rounded-2xl border border-dashed p-5 sm:flex-row ${
          photoUrl && !avatarId
            ? 'border-[#58cc02]/50 bg-[#58cc02]/5'
            : 'border-[#37464f] bg-[#17262c]'
        }`}
      >
        <ProfileAvatar
          avatarId={avatarId}
          name={nome || initialProfile?.nome}
          photoUrl={photoUrl}
          size="lg"
        />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm font-bold text-[#f1f7fb]">
            {photoUrl && !avatarId
              ? 'Foto pessoal selecionada'
              : 'Prefere usar sua própria foto?'}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#a5b7c2]">
            JPG, PNG ou WebP, com até 5 MB. A imagem será recortada em formato
            quadrado e reduzida automaticamente.
          </p>
        </div>

        <input
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={isBusy}
          id={photoInputId}
          onChange={handlePhotoChange}
          type="file"
        />
        <label
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#37464f] bg-[#1f2d33] px-4 py-2.5 text-xs font-bold text-[#f1f7fb] transition hover:border-[#58cc02] hover:text-[#58cc02] ${
            isBusy ? 'pointer-events-none opacity-50' : ''
          }`}
          htmlFor={photoInputId}
        >
          {isProcessingPhoto ? (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-[#58cc02]"
            />
          ) : (
            <PhotoCamera sx={{ fontSize: 18 }} />
          )}
          {isProcessingPhoto
            ? 'Preparando…'
            : photoUrl && !avatarId
              ? 'Trocar foto'
              : 'Escolher foto'}
        </label>
      </div>

      {errorMessage && (
        <div
          className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <button
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] px-6 py-4 text-sm font-black text-[#131f24] shadow-[0_4px_0_#46a302] transition-all active:translate-y-1 active:shadow-none focus:outline-none focus:ring-2 focus:ring-[#58cc02] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        disabled={isBusy || (requireChanges && !hasChanges)}
        type="submit"
      >
        {isSubmitting && (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-[#131f24]/30 border-t-[#131f24]"
          />
        )}
        {isSubmitting ? 'Salvando…' : submitLabel}
      </button>
    </form>
  );
}
