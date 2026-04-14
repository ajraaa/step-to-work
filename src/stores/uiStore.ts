import { persistentAtom } from '@nanostores/persistent';

export const activeTabStore = persistentAtom<'content' | 'customize'>(
  'cv-active-tab',
  'content'
);
