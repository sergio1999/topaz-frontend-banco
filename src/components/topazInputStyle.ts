export const TOPAZ_UNDERLINE_COLOR = '#1E1E68';

// Estilo "standard": solo borde inferior, sin relleno.
export const standardInputProps = {
  mode: 'flat' as const,
  underlineColor: TOPAZ_UNDERLINE_COLOR,
  activeUnderlineColor: TOPAZ_UNDERLINE_COLOR,
  style: { backgroundColor: 'transparent' },
};
