/** Alt text from a public image path: `modular-kitchen-interior.png` → `Modular Kitchen Interior`. */
export function altFromPublicImage(src: string): string {
  const file = (src.split('?')[0] ?? '').split('/').pop() ?? '';
  const stem = file.replace(/\.[a-z0-9]+$/i, '');
  if (!stem) return '';

  return stem
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
