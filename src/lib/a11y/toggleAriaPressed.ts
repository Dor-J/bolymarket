/**
 * Stable aria-pressed value for toggle buttons across SSR and client hydration.
 */
export function toggleAriaPressed(pressed: boolean): 'true' | 'false' {
  return pressed ? 'true' : 'false';
}
