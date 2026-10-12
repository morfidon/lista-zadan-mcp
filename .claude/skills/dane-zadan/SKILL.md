---
name: dane-zadan
description: Używaj przy każdej zmianie zapisu lub odczytu zadań w localStorage (src/storage.js, wywołania loadTasks/saveTasks w src/app.js, format zadania, klucze, kopia uszkodzonych danych) oraz przy testach tych funkcji.
---

# Zasady zapisu i odczytu zadań

1. Cała obsługa localStorage dla zadań żyje w `src/storage.js`. Inne pliki nie wołają `localStorage` dla zadań (motyw to osobny klucz `motyw` w `app.js`).
2. Zadania to jedna tablica JSON pod kluczem `KEY` (`lista-zadan`). Odczyt zwraca tylko tablicę, a każdy inny kształt (obiekt, liczba, `null`) traktujemy jak uszkodzony zapis.
3. `loadTasks` zwraca `{ tasks, corrupted }`. Brak zapisu daje `SAMPLE_TASKS` i `corrupted: false`. Pusta tablica `[]` to poprawny zapis, nie wolno jej podmieniać przykładami.
4. Uszkodzonego zapisu nie wolno stracić. Przed pierwszym kolejnym `saveTasks` kopiujemy surowy tekst pod `BACKUP_KEY` (`lista-zadan.uszkodzone`) i zwracamy `corrupted: true`, żeby UI pokazał komunikat nad listą.
5. Istniejącej kopii nie nadpisujemy. Kolejne uszkodzenie trafia pod `BACKUP_KEY.<Date.now()>`.
6. Błąd zapisu kopii (np. brak miejsca) jest połykany. Odczyt nigdy nie rzuca wyjątku.
7. `loadTasks` i `saveTasks` przyjmują `storage` jako parametr (domyślnie `globalThis.localStorage`) i działają bez niego (`storage?.`). Dzięki temu testy używają atrapy, bez przeglądarki.
8. `saveTasks` wołamy po każdej zmianie listy zadań i zapisujemy całą tablicę.
9. Nie dodajemy nowych pól do zadania bez obsługi starych zapisów, które ich nie mają (brak pola = wartość domyślna).
10. Każda zmiana zachowania w `storage.js` dostaje test w `tests/storage.test.js` (atrapa `fakeStorage`). Potem `npm test` i `npm run lint`.
