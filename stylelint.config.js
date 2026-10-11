// Reguła z .claude/rules/interfejs.md: kolor wolno wpisać tylko jako wartość
// zmiennej (--nazwa) w :root, wszędzie indziej ma być var(--…).
const KOLOR = /#[0-9a-f]{3,8}\b|\b(?:rgb|hsl|hwb|lab|lch|oklab|oklch|color|color-mix)a?\(/i;

export default {
  extends: ['stylelint-config-standard'],
  rules: {
    // Poza zmiennymi (--*): hex i funkcje kolorów zabronione.
    'declaration-property-value-disallowed-list': [
      { '/^(?!--)/': [KOLOR] },
      { message: 'Kolor wpisz jako zmienną w :root i użyj var(--…).' },
    ],
    // Nazwane kolory (red, white…) zabronione w zwykłych właściwościach.
    'color-named': 'never',
  },
};
