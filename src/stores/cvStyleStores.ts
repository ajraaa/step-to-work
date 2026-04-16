import { persistentAtom } from '@nanostores/persistent';

// ===== CV Style Customization =====
export type CVStyle = {
  fontFamily: string;
  paddingX: number;
  paddingY: number;
  sectionSpacing: number;
  lineHeight: number;
  fontSizeOffset: number;
};

export const FONT_OPTIONS: { label: string; value: string }[] = [
  { label: 'Times New Roman', value: "'Times New Roman', Georgia, serif" },
  { label: 'Helvetica', value: "Helvetica, Arial, sans-serif" },
];

const defaultCVStyle: CVStyle = {
  fontFamily: FONT_OPTIONS[0].value,
  paddingX: 30,
  paddingY: 30,
  sectionSpacing: 8,
  lineHeight: 1.4,
  fontSizeOffset: 0,
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
