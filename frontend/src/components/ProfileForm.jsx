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
          <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-200">
            <Person className="text-amber-400" sx={{ fontSize: 19 }} />
            Nome preferido
          </span>
          <input
            autoComplete="name"
            className="w-full rounded-xl border border-zinc-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:opacity-60"
            disabled={isBusy}
            maxLength={40}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Como devemos chamar você?"
            required
            type="text"
            value={nome}
          />
          <span className="mt-1.5 block text-right text-xs text-slate-600">
            {nome.length}/40
          </span>
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-200">
            <GroupsOutlined className="text-emerald-400" sx={{ fontSize: 19 }} />
            Turma
          </span>
          <select
            className="w-full rounded-xl border border-zinc-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 disabled:opacity-60"
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
          <span className="mt-1.5 block text-xs text-slate-600">
            Turmas disponíveis: 3º DSA e 3º DSB.
          </span>
        </label>
      </div>

      <fieldset disabled={isBusy}>
        <legend className="text-sm font-bold text-slate-200">
          Escolha sua Capi profissional
        </legend>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
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
                className={`relative flex min-h-36 flex-col items-center justify-center gap-2 rounded-2xl border p-2 transition focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400/10'
                    : 'border-zinc-800 bg-slate-950/70 hover:border-zinc-600'
                }`}
                key={avatar.id}
                onClick={() => selectAvatar(avatar.id)}
                role="radio"
                type="button"
              >
                <ProfileAvatar avatarId={avatar.id} size="lg" />
                <span className="text-center text-[10px] font-bold leading-tight text-slate-300">
                  {avatar.label}
                </span>
                {isSelected && (
                  <Check
                    className="absolute right-1.5 top-1.5 rounded-full bg-slate-950/80 text-amber-400"
                    sx={{ fontSize: 19 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="relative flex items-center gap-3">
        <span className="h-px flex-1 bg-zinc-800" />
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-600">
          ou use sua foto
        </span>
        <span className="h-px flex-1 bg-zinc-800" />
      </div>

      <div
        className={`flex flex-col items-center gap-4 rounded-2xl border border-dashed p-5 sm:flex-row ${
          photoUrl && !avatarId
            ? 'border-emerald-400/50 bg-emerald-400/5'
            : 'border-zinc-700 bg-slate-950/50'
        }`}
      >
        <ProfileAvatar
          avatarId={avatarId}
          name={nome || initialProfile?.nome}
          photoUrl={photoUrl}
          size="lg"
        />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm font-bold text-slate-200">
            {photoUrl && !avatarId
              ? 'Foto pessoal selecionada'
              : 'Prefere usar sua própria foto?'}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
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
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-xs font-bold text-slate-200 transition hover:border-amber-400 hover:text-amber-300 ${
            isBusy ? 'pointer-events-none opacity-50' : ''
          }`}
          htmlFor={photoInputId}
        >
          {isProcessingPhoto ? (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-amber-400"
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
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <button
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-amber-400/15 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isBusy || (requireChanges && !hasChanges)}
        type="submit"
      >
        {isSubmitting && (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-slate-950"
          />
        )}
        {isSubmitting ? 'Salvando…' : submitLabel}
      </button>
    </form>
  );
}
