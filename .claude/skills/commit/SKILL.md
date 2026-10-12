---
name: commit
description: Robi commity ze zmian w repozytorium, osobny commit na każdy rodzaj zmiany. Uruchamia go tylko użytkownik przez /commit.
disable-model-invocation: true
allowed-tools: Bash(git add:*), Bash(git commit:*), Bash(git status:*), Bash(git diff:*), Bash(git log:*)
---

# Commit

Stan repozytorium na start:

```
!`git status`
```

```
!`git diff --stat`
```

Ostatnie commity (styl wiadomości):

```
!`git log --oneline -10`
```

## Zasady

1. Jeden commit na jeden rodzaj zmiany (np. funkcja, poprawka, lintery, dokumentacja). Zmiany różnego rodzaju dziel na osobne commity.
2. Dodawaj pliki jawnie po nazwie (`git add plik1 plik2`), nigdy `git add .` ani `-A`.
3. Nigdy nie dodawaj `.env` ani innych plików z sekretami. Jeśli ma trafić do commita, zatrzymaj się i powiedz o tym.
4. Wiadomości po polsku, jak w historii projektu: krótki opis tego, co się zmieniło, od wielkiej litery, bez kropki na końcu, bez prefiksów typu `feat:`.
5. Na końcu wiadomości dodaj linię z atrybucją podaną w kontekście sesji (`Co-Authored-By: ...`).
6. Po commitach uruchom `git status` i pokaż użytkownikowi, co zostało (lista commitów i ewentualne niezacommitowane pliki).
7. Nie rób `git push`, `--amend`, `reset` ani `--no-verify`.
