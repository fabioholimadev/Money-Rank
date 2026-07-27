import AccountCircle from '@mui/icons-material/AccountCircle';
import { getAvatarOption } from '../constants/profileOptions';

const SIZE_CLASSES = {
  sm: 'h-10 w-10 rounded-xl',
  md: 'h-14 w-14 rounded-2xl',
  lg: 'h-20 w-20 rounded-2xl',
  xl: 'h-24 w-24 rounded-3xl',
};

export default function ProfileAvatar({
  avatarId,
  photoUrl,
  name = 'Estudante',
  size = 'lg',
  className = '',
}) {
  const avatar = getAvatarOption(avatarId);
  const sizeClasses = SIZE_CLASSES[size] ?? SIZE_CLASSES.lg;

  if (avatar) {
    return (
      <img
        alt={`Avatar ${avatar.label}`}
        className={`shrink-0 object-cover shadow-lg ${sizeClasses} ${className}`}
        decoding="async"
        src={avatar.imageUrl}
      />
    );
  }

  if (photoUrl) {
    return (
      <img
        alt={`Foto de perfil de ${name}`}
        className={`shrink-0 object-cover ${sizeClasses} ${className}`}
        decoding="async"
        referrerPolicy="no-referrer"
        src={photoUrl}
      />
    );
  }

  return (
    <span
      aria-label="Avatar padrão"
      className={`inline-flex shrink-0 items-center justify-center border border-slate-700 bg-slate-900 text-slate-500 ${sizeClasses} ${className}`}
      role="img"
    >
      <AccountCircle sx={{ fontSize: '65%' }} />
    </span>
  );
}
