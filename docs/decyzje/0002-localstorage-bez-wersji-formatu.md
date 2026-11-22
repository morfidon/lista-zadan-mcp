# 0002. Zapis zadań w localStorage, bez wersji formatu

Data: 2026-11-21

## Kontekst

Aplikacja nie ma backendu (patrz [0001](0001-bez-zaleznosci-w-aplikacji.md)). Zadania muszą jednak przetrwać odświeżenie strony. Zapisem i odczytem zajmuje się `src/storage.js`.

## Decyzja

Wszystkie zadania leżą w localStorage przeglądarki pod jednym kluczem `lista-zadan`, jako tablica JSON. Format nie ma numeru wersji ani kodu migracji.

Zapis, którego nie da się odczytać, trafia do kopii pod kluczem `lista-zadan.uszkodzone` i nie jest nadpisywany (szczegóły w `add5fa9`).

## Dlaczego

To najprostszy zapis bez serwera.

## Czego to wymaga

- Każda zmiana formatu zadania musi być wstecznie zgodna. Nie da się odróżnić starego zapisu od nowego, więc kod musi poprawnie czytać oba (patrz [0003](0003-wartosci-domyslne-niezapisywane.md)).
- Nie zmieniamy klucza `lista-zadan`, nie zmieniamy nazw ani znaczenia istniejących pól i kodów wartości (np. `low`, `normal`, `high`). Bez migracji użytkownicy straciliby dane albo zobaczyli je źle.
- Dane są tylko w jednej przeglądarce. Nie ma synchronizacji między urządzeniami ani kopii na serwerze.
- Wprowadzenie wersji formatu albo przeniesienie danych w inne miejsce wymaga nowego wpisu i kodu migracji.
