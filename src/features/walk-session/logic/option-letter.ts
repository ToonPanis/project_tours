/** 0 → "A", 1 → "B", … Used for drink options and multiple-choice answers. */
export function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}
