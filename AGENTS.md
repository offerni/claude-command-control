# Command Control: contributor guide

Command Control is a Claude Code plugin: one hooks module that draws a pane in the Claude desktop app.

## Layout

- `hooks/register.tsx`: the plugin.
- `hooks/register.test.tsx`: its tests, one file mirroring the module.
- `types/index.d.ts`: the plugin's state and settings contract.
- `skills/cc-setup/`: the setup skill and the starter skill templates it writes.
- `docs/`: README screenshots.
- `.claude-plugin/`: the plugin manifest and the marketplace file.

## Checks

Run all three before opening a pull request:

```
claude plugin validate .
claude plugin test .
npx tsc -p .
```

`tsc` reads the types Claude Code writes to `.claude-plugin/types/` when it loads the plugin from this folder, so start a session with `claude --plugin-dir .` once first. Done when validate passes, tsc is silent, and the test run reports every test passing with the count you expect, new tests included.

## Code

- The code carries no comments; names say what it does, and the commit message says why.
- Each change matches how the file already does the same job: reuse its helpers and patterns.
- Every behaviour change comes with a test named for the behaviour, in `hooks/register.test.tsx`.
- Settings change additively: a new key, never a renamed or removed one.
- Text from pull requests, tickets, search results and transcripts goes into prompts quoted and marked as data. Links open only when they are `https` or Claude session links. Settings save only after the user confirms them.

## Data

The repository is public. Fixtures and screenshots use invented data only: ticket keys like `ABC-123`, the `acme` owner, made-up repositories and people. Take screenshots with `/cc demo` on. Real names, hostnames, ids, tokens and anything from an employer or client stay out of every file and commit.

## Pull requests

- **Branch:** `features/<short-name>` for new behaviour, `bugs/<short-name>` for fixes.
- **Scope:** one change per pull request; the diff holds that change and nothing else.
- **Title:** what changes, in plain words.
- **Body:** plain sentences, short enough to read in one pass:
  - one bullet per behaviour change,
  - how it was tested (the checks above, plus what you tried in the app),
  - screenshots for any change to the pane, at side-panel and expanded widths.
  When the scope changes during review, rewrite the body so it describes the pull request as it is now.
- **Commits:** each message says why the change was made.
- **Authorship:** commits and pull requests carry only the author's own name; leave out tool or assistant attribution lines.
