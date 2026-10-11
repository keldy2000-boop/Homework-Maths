# Year 6 & Year 4's homework helper

## Every week
1. Take photos of the maths homework sheets.
2. Put them in `inbox\year6` or `inbox\year4` on this PC.
3. Open Claude in this folder and type **new homework**.

Claude reads the sheets, builds the questions with step-by-step help, tests them, puts them online, and sends you a list of answers to glance over.

The girls open the same link as always:
- Year 6: https://keldy2000-boop.github.io/Homework-Maths/#year6
- Year 4: https://keldy2000-boop.github.io/Homework-Maths/#year4

Each girl sees her newest week first, and older weeks are listed under it. Progress is saved on the tablet, separately for each week.

## One-time setup (publishing)
Needs Git and the GitHub CLI on this PC, signed in to the GitHub account that owns the `Homework-Maths` repo:
```
winget install --id Git.Git -e
winget install --id GitHub.cli -e
gh auth login
```
