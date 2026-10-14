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
5. Przed zakończeniem pracy zawsze uruchom `npm test` i upewnij się, że wszystkie testy przechodzą.
6. Nigdy nie czytaj pliku `.env`.
7. Nigdy nie edytuj ręcznie `package-lock.json`. Zależności zmieniaj tylko przez `npm install` albo `npm uninstall`.
8. W testach (`tests/`) używaj `node:test` i `node:assert/strict`. Jeden plik testów na moduł, nazwy testów po polsku, bez bibliotek do mockowania.

## Wydanie nowej wersji

Gdy proszę o wydanie wersji:

1. Sprawdź, czy drzewo robocze jest czyste (`git status`). Jeśli nie, zatrzymaj się i zapytaj.
2. Uruchom `npm test` i `npm run lint`. Oba muszą przejść.
3. Ustal numer nowej wersji według SemVer: poprawki to patch, nowe funkcje to minor, zmiany niezgodne wstecz to major. Jeśli nie jest to jasne, zapytaj.
4. Zmień `version` w `package.json` ręcznie, bez `npm version`, żeby nie tworzyć taga za wcześnie.
5. Dopisz na górze `CHANGELOG.md` sekcję `## [X.Y.Z]` z listą zmian od ostatniego taga (`git log vPOPRZEDNI..HEAD --oneline`). Jeśli pliku nie ma, utwórz go.
6. Zrób commit `Wydanie X.Y.Z` z `package.json` i `CHANGELOG.md`.
7. Utwórz tag z adnotacją: `git tag -a vX.Y.Z -m "Wydanie X.Y.Z"`.
8. Niczego nie wypychaj na zdalne repozytorium. Na koniec pokaż mi `git log -1` i listę tagów.
