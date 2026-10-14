---
paths:
  - "index.html"
  - "styles.css"
  - "src/app.js"
---

# Reguły interfejsu

1. **Kolory tylko ze zmiennych.** Używaj wyłącznie kolorów zdefiniowanych jako zmienne w `:root` w `styles.css` (np. `var(--...)`). Nie wpisuj wartości kolorów (hex, rgb, hsl, nazwy) bezpośrednio w CSS, HTML ani JS. Potrzebujesz nowego koloru? Najpierw dodaj nową zmienną w `:root`, potem jej użyj. W `styles.css` pilnuje tego Stylelint (`npm run lint`); w HTML i JS pilnuj sam.
2. **Przycisk bez widocznego napisu dostaje `aria-label` po polsku.** Dotyczy przycisków z samą ikoną lub symbolem (np. „✕", „🗑"), także tworzonych w `src/app.js`. Przykład: `aria-label="Usuń zadanie"`.
3. **Po każdej zmianie w interfejsie sprawdź aplikację w przeglądarce sam** (w aplikacji desktopowej w podglądzie, w terminalu przez playwright), nie zostawiaj tego użytkownikowi. Zrób zrzut ekranu, kliknij każdą nową lub zmienioną kontrolkę (każdy przycisk, pole, przełącznik, każdy jej stan) i przejdź całą ścieżkę użytkownika od początku do końca (np. przy filtrze: wybierz każdy filtr, a potem zmień zadanie w widoku filtrowanym i zobacz, jak reaguje lista i licznik). Na końcu upewnij się, że konsola nie ma błędów. W odpowiedzi opisz, co zobaczyłeś, zamiast prosić użytkownika o sprawdzenie. Zrzuty zapisuj w `.playwright-mcp/` (np. `filename: ".playwright-mcp/nazwa.png"`), nie w katalogu głównym projektu.
