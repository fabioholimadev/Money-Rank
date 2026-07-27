export const CLASS_OPTIONS = ['3º DSA', '3º DSB'];

export const AVATAR_OPTIONS = [
  {
    id: 'capi-cientista',
    label: 'Capi Cientista',
    imageUrl: '/avatars/capi-cientista.jpg',
  },
  {
    id: 'capi-professora',
    label: 'Capi Professora',
    imageUrl: '/avatars/capi-professora.jpg',
  },
  {
    id: 'capi-programadora',
    label: 'Capi Programadora',
    imageUrl: '/avatars/capi-programadora.jpg',
  },
  {
    id: 'capi-economista',
    label: 'Capi Economista',
    imageUrl: '/avatars/capi-economista.jpg',
  },
  {
    id: 'capi-medica',
    label: 'Capi Médica',
    imageUrl: '/avatars/capi-medica.jpg',
  },
  {
    id: 'capi-engenheira',
    label: 'Capi Engenheira',
    imageUrl: '/avatars/capi-engenheira.jpg',
  },
];

const AVATAR_IDS = new Set(AVATAR_OPTIONS.map(({ id }) => id));
const CLASS_NAMES = new Set(CLASS_OPTIONS);

export function getAvatarOption(avatarId) {
  return AVATAR_OPTIONS.find(({ id }) => id === avatarId) ?? null;
}

export function isValidAvatarId(avatarId) {
  return AVATAR_IDS.has(avatarId);
}

export function isValidClassName(className) {
  return CLASS_NAMES.has(className);
}
