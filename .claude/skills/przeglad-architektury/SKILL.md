---
name: przeglad-architektury
description: Przegląd architektury projektu. Znajduje gorące miejsca w ostatnich 30 commitach, szuka w nich płytkich modułów, powielonych zasad, logiki w interfejsie, nazw niezgodnych ze słowniczkiem i zmian sprzecznych z decyzjami, a raport zapisuje w raporty/architektura.html. Niczego nie zmienia w kodzie.
argument-hint: "[opcjonalnie: liczba commitów, domyślnie 30]"
allowed-tools: Read, Grep, Glob, Write, Bash(git log *), Bash(git show *), Bash(git blame *)
---

# Przegląd architektury

Liczba commitów do przejrzenia: $ARGUMENTS (jeśli pusto, weź 30).

## Zasady

- **Niczego nie zmieniasz w kodzie.** Żadnych edycji w `src/`, `tests/`, `e2e/`, `docs/`, plikach konfiguracji ani commitów. Jedyny plik, który wolno zapisać, to `raporty/architektura.html` (nadpisz go, jeśli istnieje).
- **Raport po polsku.** Nazwy pojęć bierz z `docs/slowniczek.md`, nazwy z kodu zostaw w oryginale.
- **Tylko to, co widać w kodzie.** Każdy problem ma plik i linię. Nie zgaduj; jeśli czegoś nie da się potwierdzić w kodzie, nie wpisuj tego do raportu.
- Polecenia powłoki uruchamiaj osobno, z bieżącego katalogu, bez zmiennych, pętli i podstawień.

## Krok 1. Gorące miejsca

Uruchom osobno:

- `git log -30 --name-only --format=` — które pliki zmieniały się najczęściej (policz wystąpienia każdej ścieżki).
- `git log -30 --numstat --format=` — ile linii dodano i usunięto w każdym pliku.
- `git log -30 --format="%h %ad %s" --date=short` — o czym były commity.

Zrób ranking plików: najpierw liczba commitów, przy remisie suma zmienionych linii. Pomiń `package-lock.json`, pliki w `raporty/` i pliki, których już nie ma. Pliki z `docs/` i `.claude/` wpisz do tabeli, ale analizuj tylko kod: `src/`, `tests/`, `e2e/`, `server.js`, `index.html`, `styles.css` i konfiguracje linterów.

Do kroku 2 weź pliki z kodem z górnej części rankingu (zwykle 5–8). Zanotuj też pary plików, które często zmieniają się w tym samym commicie: to znak, że jedna zasada mieszka w kilku miejscach.

## Krok 2. Szukanie problemów w gorących plikach

Przeczytaj w całości każdy wybrany plik, a także `docs/slowniczek.md`, wszystkie wpisy w `docs/decyzje/`, `CLAUDE.md` i `.claude/rules/`. Szukaj pięciu rodzajów problemów:

1. **Płytki moduł.** Funkcja albo plik, którego interfejs jest prawie tak złożony jak to, co ukrywa: funkcja tylko przekazuje argumenty dalej, funkcja wymaga od wołającego znajomości swoich szczegółów, wołający musi wywołać kilka funkcji w ustalonej kolejności, żeby zrobić jedną rzecz. Pytanie kontrolne: czy po usunięciu tej warstwy kod stałby się prostszy?
2. **Ta sama zasada w kilku miejscach.** Ta sama reguła dziedziny zapisana więcej niż raz: walidacja (np. priorytet, termin RRRR-MM-DD), wartości domyślne, nazwy kluczy, teksty komunikatów, listy dozwolonych wartości, warunki typu „zrobione / do zrobienia / po terminie”. Szukaj też przez `Grep` w całym `src/` i `tests/` (np. po `'high'`, `done`, `dueDate`, tekstach komunikatów). Test, który powtarza logikę kodu zamiast wpisać oczekiwany wynik wprost, też się liczy.
3. **Logika w interfejsie.** Decyzje dziedziny w `src/app.js` lub `index.html`: liczenie, filtrowanie, sortowanie, walidacja, wyliczanie dat, budowanie komunikatów z warunkami, zmiana danych zadania. Interfejs ma tylko czytać zdarzenia, wołać funkcje z `src/tasks.js` / `src/storage.js` i rysować wynik. Sprawdź, czy taką logikę obejmują testy w `tests/` (zwykle nie, bo `app.js` nie jest testowany jednostkowo).
4. **Słowa niezgodne ze słowniczkiem.** Nazwy w kodzie, tekstach na ekranie, komunikatach, `aria-label` i nazwach testów, które różnią się od kolumn „W kodzie” i „Na ekranie i w komunikatach” w `docs/slowniczek.md` (np. synonim zamiast ustalonej nazwy, angielskie słowo na ekranie, inne słowo dla tego samego pojęcia). Osobno wypisz pojęcia, które w kodzie są, a w słowniczku ich brak.
5. **Zmiany sprzeczne z decyzjami.** Dla każdego wpisu w `docs/decyzje/` sprawdź, czy kod i ostatnie commity go przestrzegają (np. zależności w `package.json` poza `devDependencies`, zapis wartości domyślnych w zadaniu, zmiana formatu zapisu bez obsługi starych danych). Przy podejrzeniu sprawdź konkretny commit przez `git show <hash> -- <plik>`.

Każdy znaleziony problem zapisz z: rodzajem (1–5), plikiem i liniami, krótkim fragmentem kodu, który go pokazuje. Połącz znaleziska mówiące o tym samym. Pomiń drobiazgi stylu, które łapią lintery.

## Krok 3. Ocena każdego problemu

Dla każdego problemu przygotuj:

- **Przed** — prawdziwy fragment obecnego kodu (kilka–kilkanaście linii) z plikiem i numerami linii.
- **Po** — szkic kodu po zmianie: gdzie zasada miałaby mieszkać, jak wyglądałby interfejs funkcji i jedno wywołanie. To tylko szkic w raporcie, nie zmiana w plikach.
- **Zysk** — co konkretnie się poprawi: ile miejsc mniej trzeba zmieniać przy kolejnej zmianie tej zasady, co da się przetestować w `node --test` bez przeglądarki, który gorący plik się uspokoi.
- **Ryzyko**:
  - **Drzwi:** *jednokierunkowe* (trudno lub nie da się cofnąć: zmienia format danych w localStorage u użytkowników, zmienia publiczne nazwy, łamie decyzję z `docs/decyzje/`) albo *dwukierunkowe* (czysta zmiana kodu, cofa się jednym `git revert`). Jedno zdanie uzasadnienia.
  - **Zasięg szkód:** co się zepsuje, jeśli zmiana pójdzie źle: które pliki i funkcje, czy dotyka zapisanych danych, czy obejmują to testy jednostkowe lub e2e, czy błąd zobaczy użytkownik.
- **Wysiłek** — mały / średni / duży, jednym słowem.

Jeśli propozycja zmienia coś, czego dotyczy wpis w `docs/decyzje/`, zaznacz to wprost: według `CLAUDE.md` wymaga to osobnego pytania do użytkownika.

Uszereguj problemy: najpierw dwukierunkowe o dużym zysku i małym zasięgu szkód, na końcu jednokierunkowe.

## Krok 4. Jeden pierwszy ruch

Z całej listy wybierz **dokładnie jedną** propozycję na pierwszy ruch: zwykle drzwi dwukierunkowe, mały wysiłek, duży zysk, problem w najgorętszym pliku. Opisz ją w 3–5 zdaniach: co zrobić, w jakiej kolejności (najpierw test, który pokazuje zachowanie, potem przeniesienie kodu), jak poznać, że się udało (`npm test`, `npm run lint`, ewentualnie `npm run test:e2e`), i dlaczego właśnie ta, a nie inne.

## Krok 5. Raport `raporty/architektura.html`

Zapisz jeden samodzielny plik HTML (`<html lang="pl">`, kodowanie UTF-8, cały CSS w `<style>`, bez skryptów i bez zasobów z sieci, zgodnie z decyzją 0001). Wymagania:

- Kolory jako zmienne w `:root`, osobny zestaw dla `@media (prefers-color-scheme: dark)`; czytelny na telefonie (bez przewijania w poziomie, bloki kodu z `overflow-x: auto`).
- Kod w `<pre><code>` ze zamienionymi `<`, `>` i `&` na encje.

Układ:

1. **Nagłówek** — tytuł „Przegląd architektury”, data, zakres (hash pierwszego i ostatniego z przejrzanych commitów, ich liczba).
2. **Pierwszy ruch** — wyróżniona ramka z propozycją z kroku 4 i odnośnikiem do problemu, którego dotyczy.
3. **Gorące miejsca** — tabela: plik, liczba commitów, linie dodane / usunięte, czy był analizowany. Pod tabelą pary plików zmieniane razem.
4. **Podsumowanie** — tabela wszystkich problemów: numer, rodzaj, plik, drzwi, zasięg szkód, wysiłek. Numery są odnośnikami do kart.
5. **Karty problemów** — po jednej na problem (`<section id="p1">` itd.) z sekcjami: Rodzaj i miejsce, Przed, Po, Zysk, Ryzyko (drzwi i zasięg szkód), Wysiłek. Przed i Po obok siebie na szerokim ekranie, jeden pod drugim na wąskim.
6. **Czego nie znaleziono** — krótko, które z pięciu rodzajów problemów sprawdzono i nic nie wyszło (żeby było wiadomo, że sprawdzono).

## Na koniec

W odpowiedzi napisz krótko: ile problemów znaleziono w każdym rodzaju, jaki jest pierwszy ruch (jedno zdanie) i ścieżkę `raporty/architektura.html`. Nie proponuj wprowadzania zmian w tej samej turze; zapytaj jednym zdaniem, czy przejść do pierwszego ruchu.
