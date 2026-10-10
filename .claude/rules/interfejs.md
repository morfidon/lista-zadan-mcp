---
paths:
  - "index.html"
  - "styles.css"
  - "src/app.js"
---

# Reguły interfejsu

1. **Kolory tylko ze zmiennych.** Używaj wyłącznie kolorów zdefiniowanych jako zmienne w `:root` w `styles.css` (np. `var(--...)`). Nie wpisuj wartości kolorów (hex, rgb, hsl, nazwy) bezpośrednio w CSS, HTML ani JS. Potrzebujesz nowego koloru? Najpierw dodaj nową zmienną w `:root`, potem jej użyj.
2. **Przycisk bez widocznego napisu dostaje `aria-label` po polsku.** Dotyczy przycisków z samą ikoną lub symbolem (np. „✕", „🗑"), także tworzonych w `src/app.js`. Przykład: `aria-label="Usuń zadanie"`.
