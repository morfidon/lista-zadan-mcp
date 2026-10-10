# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Polecenia

```bash
npm start                                   # serwer na http://localhost:3000
npm test                                    # wszystkie testy (node --test)
node --test --test-name-pattern="addTask"   # pojedynczy test po nazwie
```

## Zasady

1. Nie dodawaj bibliotek ani zależności npm. Projekt celowo ich nie ma.
2. Każda nowa funkcja w `src/tasks.js` dostaje test w `tests/tasks.test.js`.
3. Po każdej zmianie w `src/` uruchom `npm test`.
