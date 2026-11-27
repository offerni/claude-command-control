---
name: cc-setup
description: Set up or change Command Control (the session-board pane): find which of the user's tools it can read tickets, pull requests, docs search and the calendar from, ask which to use, test each one, write starter skills for starting tickets and cutting releases when wanted, and save the choices. Use when the user runs /cc-setup or asks to set up, connect or reconfigure Command Control or the session board.
---

# Set up Command Control

Command Control reads from a few sources. Each one is optional: a source that is not set up turns its features off. This flow finds what the user has, asks them to choose, proves each choice with one real call, and saves the result with the `mcp__session-board__configure` tool.

Work through the steps in order. Ask one question at a time with AskUserQuestion, always offering "None" for a source.

## 1. Check the basics

- Command Control lists and acts on sessions through the Claude desktop app's session tools (`mcp__ccd_session_mgmt__list_sessions` and friends). If those tools are not available, tell the user that Command Control needs the Claude desktop app's Code tab, and stop.
- If `mcp__session-board__configure` is not listed, load it with ToolSearch. If it still is not there, the plugin is not loaded: tell the user to run `/reload-plugins` and try again.

## 2. Tickets (Jira or Linear)

- Look through your tools for one whose name ends in `getJiraIssue` (an Atlassian MCP server) and for a Linear MCP server: one with `get_issue`, `list_issues` and `save_issue` tools. The server is the part between `mcp__` and the next `__`. The tool prefix is whatever comes before `getJiraIssue` or `get_issue` in the tool's own name (often empty).
- For Jira, find the cloud id: call the server's `getAccessibleAtlassianResources` tool if it has one, otherwise ask the user for their Atlassian site URL (it can stand in for the cloud id). The browse URL is the site URL followed by `/browse/`. Save it with `kind: "jira"`.
- For Linear, there is no cloud id. Call `get_issue` with a ticket key the user gives you and `fields: ["url"]`; the browse URL is that URL up to and including `/issue/`, for example `https://linear.app/acme/issue/`. Save it with `kind: "linear"`.
- When both are there, ask which one holds their tickets. Ask the user whether to use it. Test with `getJiraIssue` or `get_issue` on a ticket key they give you. Only Jira and Linear are supported today; for anything else, choose None.

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

## 6. Ticket and release commands

Command Control has two buttons that start a session with a command: **Start with …** on a ticket, and **Release** on a repository with unreleased work. Set up each one in turn:

1. Ask whether the user already has a skill, slash command or prompt for it, whatever it is called. When they do, ask for its name and save it with `{key}` for tickets or `{repo}` for releases where the key or repository goes, for example `/my-skill {key}`. Confirm a skill or command of that name is in your list; when it isn't, tell them and ask again. A plain prompt needs no check.
2. When they don't, offer the starter skill in this skill's `templates/` folder: `start-ticket.md` for tickets, `cut-release.md` for releases. When they decline, leave the command out; the board then uses its built-in prompt. When they accept, ask what to call it, suggesting `start-ticket` or `cut-release`: lowercase letters, digits and hyphens, and a name none of their skills or commands already uses.
3. Fit the starter to their workflow. Work in a repository they use (ask which when the current folder isn't one). Before asking, look up a suggestion for each `{{…}}` in the template's Workflow section: the default branch from `gh repo view --json defaultBranchRef`, tags from `gh release list --limit 5`, test and lint commands from package scripts, the Makefile or guide files, branch and commit style from `git log --oneline -20` and `gh pr list --state merged --limit 10`. Ask with AskUserQuestion, up to four questions per call, the suggestion first. Each answer replaces its `{{…}}`; when they would rather the skill work it out on each run, write that instead.
4. Set the chosen name in the skill's `name:` line and in the `/start-ticket` or `/cut-release` its description mentions. Write it to `~/.claude/skills/<name>/SKILL.md`, or under the repository's `.claude/skills/<name>/` when they want it for that repository only. When a skill of that name already exists, ask before replacing it. Done when the written file has no `{{` left and carries the chosen name.
5. The command is then `/<name> {key}` or `/<name> {repo}`. Sessions started from now on load the new skill.

## 7. Other options (all optional)

Ask whether they want:
- a slash command, without the slash, that opens a local services pane;
- one sentence new sessions should get (for example where the code lives and what to read first);
- session titles that should never show on the board, like a chat they keep for general questions (`hide`).

## 8. Save

Call `mcp__session-board__configure` with every source the user chose. Leave out a source they set to None. The tool shows the user the settings and saves them only if they confirm; if it says they were not saved, ask what to change. Show them what was saved, then tell them to run `/cc` to open Command Control. They can run `/cc-setup` again any time to change a choice.
