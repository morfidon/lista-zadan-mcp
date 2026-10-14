---
name: wydanie
description: Wydaje nową wersję aplikacji (SemVer, CHANGELOG.md, commit i tag z adnotacją). Uruchamia go tylko użytkownik przez /wydanie.
disable-model-invocation: true
allowed-tools: Bash(git status:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(git tag:*), Bash(npm test:*), Bash(npm run lint:*), PowerShell(git status:*), PowerShell(git log:*), PowerShell(git add:*), PowerShell(git commit:*), PowerShell(git tag:*), PowerShell(npm test:*), PowerShell(npm run lint:*)
---

# Wydanie nowej wersji

1. Sprawdź, czy drzewo robocze jest czyste (`git status`). Jeśli nie, zatrzymaj się i zapytaj.
2. Uruchom `npm test` i `npm run lint`. Oba muszą przejść.
3. Ustal numer nowej wersji według SemVer: poprawki to patch, nowe funkcje to minor, zmiany niezgodne wstecz to major. Jeśli nie jest to jasne, zapytaj.
4. Zmień `version` w `package.json` ręcznie, bez `npm version`, żeby nie tworzyć taga za wcześnie.
5. Dopisz na górze `CHANGELOG.md` sekcję `## [X.Y.Z]` z listą zmian od ostatniego taga (`git log vPOPRZEDNI..HEAD --oneline`). Jeśli pliku nie ma, utwórz go.
6. Zrób commit `Wydanie X.Y.Z` z `package.json` i `CHANGELOG.md`.
7. Utwórz tag z adnotacją: `git tag -a vX.Y.Z -m "Wydanie X.Y.Z"`.
8. Niczego nie wypychaj na zdalne repozytorium. Na koniec pokaż `git log -1` i listę tagów.
