---
name: cc-setup
description: Set up or change Command Control (the session-board pane): find which of the user's tools it can read tickets, pull requests, docs search and the calendar from, ask which to use, test each one, and save the choices. Use when the user runs /cc-setup or asks to set up, connect or reconfigure Command Control or the session board.
---

# Set up Command Control

Command Control reads from a few sources. Each one is optional: a source that is not set up turns its features off. This flow finds what the user has, asks them to choose, proves each choice with one real call, and saves the result with the `mcp__session-board__configure` tool.

Work through the steps in order. Ask one question at a time with AskUserQuestion, always offering "None" for a source.

## 1. Check the basics

- Command Control lists and acts on sessions through the Claude desktop app's session tools (`mcp__ccd_session_mgmt__list_sessions` and friends). If those tools are not available, tell the user that Command Control needs the Claude desktop app's Code tab, and stop.
- If `mcp__session-board__configure` is not listed, load it with ToolSearch. If it still is not there, the plugin is not loaded: tell the user to run `/reload-plugins` and try again.

## 2. Tickets (Jira)

- Look through your tools for one whose name ends in `getJiraIssue` (an Atlassian MCP server). The server is the part between `mcp__` and the next `__`. The tool prefix is whatever comes before `getJiraIssue` in the tool's own name (often empty).
- If there is one, find the cloud id: call the server's `getAccessibleAtlassianResources` tool if it has one, otherwise ask the user for their Atlassian site URL (it can stand in for the cloud id). The browse URL is the site URL followed by `/browse/`.
- Ask the user whether to use it. Test with `getJiraIssue` on a ticket key they give you. Only Jira is supported today; for anything else, choose None.

## 3. GitHub

- Run `gh auth status`. If gh is missing or not signed in, say so and offer None (pull requests, reviews and releases turn off).
- Ask which organization or user owns their repositories (`owner`), and which repositories should show merged-but-unreleased work (`releaseRepos`). `gh repo list <owner> --limit 50 --json name` helps them pick. Releases are read from each repository's latest GitHub release.
- Test with `gh api repos/<owner>/<first repo> --jq .full_name`.

## 4. Docs search

- Look for a Glean-style search tool (one that takes a query and answers with markdown results headed `## 1. Title`, with `**Source:**` and `**Link:**` lines), for example a Glean `search` tool.
- If there is one, ask whether to use it, work out its arguments, and write them as an object with the string `{query}` where the search text goes, for example `{ "query": "{query}" }`. Test with one search.
- Session transcripts are always searchable, with or without this.

## 5. Calendar

- Look for a Google Calendar server with a `list_events` tool. If there is one, ask whether to use it and test with `list_events` and `pageSize: 1`.

## 6. Commands and context (all optional)

Ask whether they have:
- a prompt or skill that starts work on a ticket, written with `{key}` (for example `/start-ticket {key}`);
- a prompt or skill that cuts a release, written with `{repo}` (for example `/release {repo}`);
- a slash command, without the slash, that opens a local services pane;
- one sentence new sessions should get (for example where the code lives and what to read first).
- session titles that should never show on the board, like a chat they keep for general questions (`hide`).

## 7. Save

Call `mcp__session-board__configure` with every source the user chose. Leave out a source they set to None. The tool shows the user the settings and saves them only if they confirm; if it says they were not saved, ask what to change. Show them what was saved, then tell them to run `/cc` to open Command Control. They can run `/cc-setup` again any time to change a choice.
