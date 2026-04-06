import { persistentAtom } from '@nanostores/persistent';

// ===== CV Style Customization =====
export type CVStyle = {
  fontFamily: string;
};

export const FONT_OPTIONS: { label: string; value: string }[] = [
  { label: 'Times New Roman', value: "'Times New Roman', Georgia, serif" },
  { label: 'Helvetica', value: "Helvetica, Arial, sans-serif" },
];

const defaultCVStyle: CVStyle = {
  fontFamily: FONT_OPTIONS[0].value,
};

export const cvStyleStore = persistentAtom<CVStyle>(
  'cv-style',
  defaultCVStyle,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

export function updateCVStyle(data: Partial<CVStyle>) {
  const current = cvStyleStore.get();
  cvStyleStore.set({ ...current, ...data });
}
