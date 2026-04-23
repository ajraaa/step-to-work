import { persistentAtom } from '@nanostores/persistent';

export type Language = 'id' | 'en';

export const appLanguageStore = persistentAtom<Language>(
  'cv-app-language',
  'id'
);
