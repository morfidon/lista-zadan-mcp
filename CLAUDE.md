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
