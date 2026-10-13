# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Polecenia

```bash
npm install                                 # raz, po sklonowaniu repozytorium
npm start                                   # serwer na http://localhost:3000
npm test                                    # wszystkie testy (node --test)
node --test --test-name-pattern="addTask"   # pojedynczy test po nazwie
npm run lint                                # ESLint (JS) + Stylelint (CSS)
```

## Zasady

1. Nie dodawaj bibliotek ani zależności npm do samej aplikacji. Projekt celowo ich nie ma. Wyjątek: narzędzia do sprawdzania kodu (ESLint, Stylelint) wolno dodawać wyłącznie jako `devDependencies`.
2. Każda nowa funkcja w `src/tasks.js` dostaje test w `tests/tasks.test.js`.
3. Po każdej zmianie w `src/`, `styles.css` albo `index.html` uruchom `npm test` i `npm run lint`.
4. Po każdej zmianie w interfejsie sprawdź aplikację w przeglądarce sam (w aplikacji desktopowej w podglądzie, w terminalu przez playwright), nie zostawiaj tego użytkownikowi. Zrób zrzut ekranu, kliknij każdą nową lub zmienioną kontrolkę (każdy przycisk, pole, przełącznik, każdy jej stan) i przejdź całą ścieżkę użytkownika od początku do końca (np. przy filtrze: wybierz każdy filtr, a potem zmień zadanie w widoku filtrowanym i zobacz, jak reaguje lista i licznik). Na końcu upewnij się, że konsola nie ma błędów. W odpowiedzi opisz, co zobaczyłeś, zamiast prosić użytkownika o sprawdzenie. Zrzuty zapisuj w `.playwright-mcp/` (np. `filename: ".playwright-mcp/nazwa.png"`), nie w katalogu głównym projektu.
