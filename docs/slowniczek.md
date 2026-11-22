# Słowniczek

Ustalone nazwy pojęć z dziedziny aplikacji. Nowe nazwy w kodzie, na ekranie i w komunikatach bierzemy stąd. Pojęcia, których tu nie ma, nie są jeszcze ustalone.

| Pojęcie | W kodzie | Na ekranie i w komunikatach |
|---|---|---|
| Treść zadania | `title` | „treść” |
| Priorytet | `priority`, wartości `low`, `normal`, `high` | „priorytet”: „niski”, „normalny”, „wysoki” |
| Do zrobienia | `active` | „do zrobienia” |
| Po terminie | `isOverdue` | „po terminie” |
| Powtarzanie | `repeat`, wartości `daily`, `weekly`, `monthly` | „powtarzanie”: „codziennie”, „co tydzień”, „co miesiąc”; brak: „nie powtarza się” |

## Szczegóły

- **Treść zadania.** Tekst wpisany przy dodawaniu zadania. W danych to pole `title`, ale użytkownikowi zawsze mówimy „treść”, np. „Zadanie musi mieć treść.”
- **Priorytet.** W danych i w kodzie zostają kody `low`, `normal`, `high`. Komunikaty i etykiety podają polskie nazwy, np. „Priorytet musi być: niski, normalny albo wysoki.”
- **Do zrobienia.** Zadanie, które nie jest zrobione (`!task.done`). W kodzie `active` (filtr `active`, `countActive`).
- **Po terminie.** Zadanie niezrobione, którego termin minął: od dnia po terminie, nie w dniu terminu. Zadanie zrobione albo bez terminu nigdy nie jest po terminie. Termin ma format RRRR-MM-DD. W kodzie `isOverdue`.
- **Powtarzanie.** Okres, co jaki zadanie wraca: codziennie, co tydzień albo co miesiąc. Wymaga terminu. Brak pola `repeat` (stare zapisy) oznacza „nie powtarza się”. Zaznaczenie zadania jako zrobione tworzy jego kopię do zrobienia z kolejnym terminem; powtarzanie przechodzi na kopię, a zrobione zadanie je traci. Kolejny termin to stary termin plus okres, dodawany tyle razy, aż wypadnie dziś lub później. Co miesiąc trzyma się dnia z pierwotnego terminu, a w krótszym miesiącu bierze jego ostatni dzień (31.01 → 28.02 → 31.03).
