/** Validation des URL http(s) — bloque javascript:, data:, etc. */

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

/** URL web sûre (http ou https uniquement) */
export function isSafeHttpUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    return ALLOWED_PROTOCOLS.has(new URL(trimmed).protocol);
  } catch {
    return false;
  }
}

/** Schéma dangereux détecté (javascript:, data:, file:, vbscript:…) */
export function hasUnsafeUrlScheme(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    return !ALLOWED_PROTOCOLS.has(new URL(trimmed).protocol);
  } catch {
    return false;
  }
}
