# 0001. Aplikacja bez zależności npm

Data: 2026-11-21

## Kontekst

Lista zadań jest projektem kursowym. Kursant czyta kod aplikacji i zmienia go razem z Claude Code, lekcja po lekcji. Zasada „bez zależności” obowiązuje od pierwszego commita. W `87175cd` doszedł wyjątek dla linterów.

## Decyzja

Aplikacja to tylko HTML, CSS i JavaScript w modułach ES, które przeglądarka ładuje bezpośrednio, bez bundlera. Serwer `server.js` korzysta wyłącznie z modułów wbudowanych w Node.js. Testy piszemy na `node:test` i `node:assert/strict`.

Wolno dodać tylko narzędzia do sprawdzania kodu (ESLint, Stylelint) i wyłącznie jako `devDependencies`.

## Dlaczego

Kod ma być w całości czytelny dla kursanta. Nie ma w nim cudzego kodu, w który trzeba by wierzyć na słowo, ani kroku budowania między źródłem a tym, co działa w przeglądarce.

## Czego to wymaga

- Wszystko, co zwykle daje biblioteka, piszemy sami: operacje na datach, serwer plików, mocki w testach.
- Nowy kod musi działać w przeglądarce bez transpilacji, więc nie używamy TypeScriptu, JSX ani importów pakietów npm w `src/`.
- Pierwsza biblioteka w aplikacji oznaczałaby bundler albo import map, a więc zmianę sposobu ładowania całej aplikacji. Taka zmiana wymaga nowego wpisu, który zastąpi ten.
