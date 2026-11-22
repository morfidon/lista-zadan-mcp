# 0003. Wartości domyślne nie są zapisywane w zadaniu

Data: 2026-11-21

## Kontekst

Format zapisu nie ma wersji (patrz [0002](0002-localstorage-bez-wersji-formatu.md)). Nowe pola, takie jak termin (`dueDate`) czy priorytet (`priority`), dochodziły z czasem, a w przeglądarkach zostały zadania zapisane bez nich. W `createTask` widać, że priorytet `normal` celowo nie trafia do zadania, co bez wyjaśnienia wygląda dziwnie.

## Decyzja

Nowe pola zadania są opcjonalne. Brak pola oznacza wartość domyślną, a wartości domyślnej nie zapisujemy:

- brak `dueDate` oznacza zadanie bez terminu,
- brak `priority` (albo nieznana wartość) oznacza priorytet normalny (`getPriority`),
- według słowniczka brak `repeat` będzie oznaczał „nie powtarza się”.

## Dlaczego

Stare zapisy mają działać bez migracji. Zadanie bez pola, zapisane dawno temu, i zadanie nowe z wartością domyślną wyglądają w danych tak samo.

## Czego to wymaga

- Każde nowe pole ma jedną funkcję odczytu, która zwraca wartość domyślną przy braku pola albo nieznanej wartości. W reszcie kodu nie czytamy tego pola bezpośrednio.
- Każde nowe pole ma test na stary zapis, czyli na zadanie bez tego pola.
- Wartości domyślnej nie można później zmienić. Zmieniłaby znaczenie wszystkich istniejących zadań, które tego pola nie mają.
