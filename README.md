# Lista zadań

Projekt startowy do kursu **„Claude Code: Praktyczny kurs programowania z AI”**.

Mała aplikacja do zadań: dodajesz zadanie, odhaczasz zrobione, usuwasz niepotrzebne, a licznik pokazuje, ile zostało do zrobienia. Zadania zapisują się w przeglądarce (localStorage). Bez frameworków i bez zależności: tylko HTML, CSS i JavaScript.

## Uruchomienie

Potrzebujesz Node.js w wersji 18 lub nowszej.

```bash
npm start   # aplikacja: http://localhost:3000
npm test    # testy (wbudowany test runner Node.js)
```

`npm install` nie jest potrzebne, bo projekt nie ma zależności.

## Co gdzie jest

| Plik | Co robi |
|---|---|
| `index.html` | strona aplikacji |
| `styles.css` | wygląd |
| `src/tasks.js` | logika zadań: czyste funkcje, pokryte testami |
| `src/storage.js` | zapis i odczyt w localStorage, przykładowe zadania na start |
| `src/app.js` | obsługa interfejsu: łączy logikę z HTML-em |
| `tests/tasks.test.js` | testy logiki zadań |
| `server.js` | prosty serwer plików na porcie 3000 |
| `.claude/settings.json` | ustawienia Claude Code dla tego projektu (tryb ręczny) |

## Jak korzystać w kursie

Na tym projekcie pracujesz razem z Claude Code, lekcja po lekcji. Zmiany robi Claude Code na żywo: na nagraniu i u Ciebie.

Plik `.claude/settings.json` ustawia w tym projekcie tryb ręczny (manual): zanim Claude Code coś zmieni albo uruchomi, pyta Cię o zgodę. Tak pracujemy na początku kursu, żebyś widział każdy krok. O ustawieniach i trybach pracy jest więcej dalej w kursie.

Rozwiązania wzorcowe do ćwiczeń trafią do osobnych gałęzi `rozwiazanie/...`, wyraźnie oznaczonych. Zajrzyj do nich dopiero po własnej próbie.
