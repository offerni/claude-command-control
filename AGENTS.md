# Command Control: contributor guide

Command Control is a Claude Code plugin: one hooks module that draws a pane in the Claude desktop app.

## Layout

- `hooks/register.tsx`: the plugin.
- `hooks/register.test.tsx`: its tests, one file mirroring the module.
- `types/index.d.ts`: the plugin's state and settings contract.
- `skills/cc-setup/`: the setup skill and the starter skill templates it writes.
- `docs/`: README screenshots.
- `.claude-plugin/`: the plugin manifest and the marketplace file.
- `.claude/skills/review-pr/`: the review skill for this repository; it is not installed with the plugin.

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

## Public data

The repository is public, so every file, file name, commit message and image holds only invented or already-public data. Invented data looks like ticket keys `ABC-123`, the `acme` owner, made-up repositories and people. Screenshots are taken with `/cc demo` on and saved without image metadata.

Anyone can contribute under their own GitHub account, name and email. These rules cover what goes into the files, images and messages, never who wrote them.

Private data is anything that points to a real person, employer or client:
- names, usernames, emails, phone numbers, avatars
- hostnames, internal URLs, IP addresses, local paths that hold a username
- account, tenant, cloud, workspace, server or connector ids
- keys, tokens, passwords, cookies, signed URLs
- an employer's or client's product, service, repository, project, ticket-prefix, internal tool or skill names
- real session transcripts, messages, tickets, pull request text or meeting details
- real data in screenshots and metadata in images

Every pull request is checked for private data before it merges, whether it came in by accident or on purpose. A single finding blocks the merge until the data is gone from every commit on the branch.

## Guarded parts

These parts keep users safe. A pull request that touches one says why in its body, and review treats any weakening as blocking:
- **Text that steers agents:** skills, `AGENTS.md`, `CLAUDE.md`, `.coderabbit.yaml` and prompts in the code. They stay in plain readable words, with every instruction visible, and none of them tells an agent or reviewer to skip a check, send data anywhere, or act without the user's go-ahead.
- **Programs:** `$.process.run` runs only `gh`, `open` (Claude session links only) and `pbcopy`, always as an argv array, with `--` before user text in `gh search`.
- **Where data goes:** only to the Claude app's own session tools, to Claude Haiku for session states and Brief me, to the tools and connectors the user picked in `/cc-setup`, and to a session when the user presses a button.
- **The guards:** links open only when they are `https` or Claude session links; settings save only after the user confirms them; text from pull requests, tickets, search results and transcripts reaches prompts quoted and marked as data.
- **Dependencies:** the plugin has none; adding one needs a stated reason.

## Pull requests

- **Branch:** `features/<short-name>` for new behaviour, `bugs/<short-name>` for fixes.
- **Scope:** one change per pull request; the diff holds that change and nothing else.
- **Title:** what changes, in plain words.
- **Body:** plain sentences someone with no context can follow:
  - what the change adds or fixes and why: the problem, who runs into it, and what the user sees before and after,
  - one bullet per behaviour change,
  - how it was tested (the checks above, plus what you tried in the app),
  - screenshots for any change to the pane, at side-panel and expanded widths,
  - anything left out on purpose, and why.
  When the scope changes during review, rewrite the body so it describes the pull request as it is now.
- **Review:** `/review-pr <number>` in Claude Code reviews a pull request against these rules; CodeRabbit reviews it too.
- **Commits:** each message says why the change was made.
- **Authorship:** each contributor commits under their own account; tool or assistant attribution lines stay out.
