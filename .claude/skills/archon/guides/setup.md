# Archon Setup Wizard

Interactive setup guide. Follow these steps in order, using AskUserQuestion to gather input.

**IMPORTANT — When to use AskUserQuestion vs plain text**:
- **AskUserQuestion**: Use ONLY for multiple-choice decisions (pick A or B).
- **Plain text**: Use for freeform input (paths, URLs, tokens, usernames). Just ask the user directly in your message — e.g., "Paste the path to your repo here." Never wrap freeform input in AskUserQuestion with an "I'll provide it" option — that creates a pointless double question.

## Prerequisites

Run these checks first:

```bash
bun --version
git --version
```

**If `git` is not installed**: Try to install it automatically based on the platform:

**macOS:**
```bash
# Try Homebrew first, fall back to Xcode CLI tools
brew install git || xcode-select --install
```
Note: `xcode-select --install` opens a GUI dialog - tell the user to click "Install" and wait.

**Linux (detect package manager):**
```bash
# Try in order: apt, dnf, pacman, apk
sudo apt-get install -y git 2>/dev/null || \
sudo dnf install -y git 2>/dev/null || \
sudo pacman -S --noconfirm git 2>/dev/null || \
sudo apk add git 2>/dev/null
```

**Windows (PowerShell):**
```powershell
winget install Git.Git
```

If installation fails (e.g., no sudo access, no package manager), tell the user to install Git manually from https://git-scm.com and run setup again.

**If `bun` is not installed**: Install it automatically based on the platform:

**macOS/Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

The installer adds Bun to the shell config, but it won't take effect until a new shell starts. For the rest of this setup session, use the full path `~/.bun/bin/bun` instead of just `bun`.

Verify installation:
```bash
~/.bun/bin/bun --version
```

**Windows (PowerShell):**
```powershell
irm bun.sh/install.ps1 | iex
```

On Windows, the installer updates the PATH for the current session, so `bun --version` should work immediately.

**Important**: For all `bun` commands in Steps 3-4, use `~/.bun/bin/bun` on macOS/Linux if bun was just installed. After setup is complete and the user opens a new terminal, `bun` will work without the full path.

## Context

The user is inside the **remote-coding-agent** repository — that's how they have access to this skill. The Archon repo path is the current working directory. Store it as `<archon-repo>`.

## Step 1: Ask for Target Repo

**IMPORTANT**: The target repo is the user's own project — **never** the remote-coding-agent (Archon) repo itself. Do not suggest or offer the current directory as an option.

Use **AskUserQuestion** with a single question:

```
Header: "Target repo"
Question: "What is the path to the repository you want to work on using Archon? (This should be your own project, not the Archon repo.)"
Options:
  1. "Clone from GitHub" — user provides a GitHub URL; clone it to ~/.archon/workspaces/
```

The user will either select "Clone from GitHub" or type a local path via "Other". **Do NOT add a second question to collect the path** — the "Other" freeform input captures it directly in one step.

Store the result as `<target-repo>`.

If "Clone from GitHub": ask for the URL in plain text (not AskUserQuestion), then:
```bash
archon-repo-path=$(pwd)
mkdir -p ~/.archon/workspaces
cd ~/.archon/workspaces && git clone <url>
```
Set `<target-repo>` to the cloned directory.

## Step 2: Ask for Platforms

Use **AskUserQuestion** with `multiSelect: true`:

```
Header: "Platforms"
Question: "Which platforms do you want to set up? CLI is always included."
Options:
  1. "CLI + GitHub" (Recommended) — CLI for local use, GitHub webhooks for issue/PR automation
  2. "CLI only" — terminal-only, simplest setup
  3. "Telegram" — chat bot via BotFather
  4. "Slack" — Socket Mode app
```

Discord is also available — mention it as the "Other" option text.

## Step 3: Run CLI Setup

**Always run this.** Read and follow `guides/cli.md`.

If Bun was just installed in Prerequisites (macOS/Linux), use `~/.bun/bin/bun` instead of `bun`:

1. `cd <archon-repo> && ~/.bun/bin/bun install` (or `bun install` if bun was already in PATH)
2. `cd <archon-repo>/packages/cli && ~/.bun/bin/bun link` (or `bun link`)
3. Verify: `archon version`
4. Check Claude is installed: `which claude`, then `claude /login` if needed

## Step 4: Configure Credentials

The CLI loads infrastructure config (database, tokens) from `~/.archon/.env` only. This prevents conflicts with project `.env` files that may contain different database URLs.

**IMPORTANT**: We'll now open an interactive setup wizard in a new terminal window. This allows you to enter API keys and tokens securely without exposing them to me (the AI assistant).

### 5a: Launch the Setup Wizard

Run this command to open the setup wizard in a new terminal:

```bash
archon setup --spawn
```

**CRITICAL**: Do NOT run `archon setup` directly via Bash — it requires interactive input that I cannot provide. The `--spawn` flag opens a new terminal window where the user can interact directly.

Tell the user:

> "I'm opening the Archon setup wizard in a new terminal window. In that window, you'll:
> 1. Choose your database (SQLite default or PostgreSQL)
> 2. Configure AI assistant(s) (Claude and/or Codex)
> 3. Set up any platforms you selected (GitHub, Telegram, Slack, Discord)
> 4. Enter API keys and tokens securely
>
> The wizard will save configuration to both `~/.archon/.env` and the repo `.env`.
>
> **Tell me when you've completed the setup wizard** so I can verify the configuration."

### 5b: Wait for User Confirmation

Wait for the user to confirm they've completed the setup wizard before proceeding.

### 5c: Verify Configuration

After the user confirms setup is complete:

```bash
archon version
```

Should show:
- `Database: postgresql` or `Database: sqlite` based on selection
- No errors about missing configuration

### 5d: Run Database Migrations (PostgreSQL only)

If the user selected PostgreSQL, run migrations:

```bash
test -n "$DATABASE_URL" && psql $DATABASE_URL < migrations/000_combined.sql
```

**Troubleshooting**:
| Issue | Cause | Fix |
|-------|-------|-----|
| Shows `sqlite` but expected `postgresql` | `~/.archon/.env` missing or no DATABASE_URL | Run `archon setup` again in your terminal |
| "relation does not exist" | Tables not created | Run `psql $DATABASE_URL < migrations/000_combined.sql` |
| Connection refused | Database not running or wrong URL | Check DATABASE_URL and database server status |

## Step 5: Platform-Specific Verification

The setup wizard already collected credentials for platforms selected in Step 3. Verify each one:

| Platform | Verification |
|----------|-------------|
| CLI only | Done — skip to Step 6 |
| GitHub | Check `GITHUB_TOKEN` and `WEBHOOK_SECRET` are in `.env` |
| Telegram | Check `TELEGRAM_BOT_TOKEN` is in `.env` |
| Slack | Check `SLACK_BOT_TOKEN` and `SLACK_APP_TOKEN` are in `.env` |
| Discord | Check `DISCORD_BOT_TOKEN` is in `.env` |

For advanced platform configuration (webhook URLs, bot permissions, etc.), refer to the platform-specific guides:
- `guides/github.md` — GitHub webhook setup details
- `guides/telegram.md` — BotFather commands
- `guides/slack.md` — Slack app configuration
- `guides/discord.md` — Discord bot permissions

## Step 6: Copy Defaults to Target Repo

Copy the bundled default commands and workflows to the target repo so the user can read, inspect, and modify them:

```bash
mkdir -p <target-repo>/.archon/commands
mkdir -p <target-repo>/.archon/workflows
cp -r <archon-repo>/.archon/commands/defaults/* <target-repo>/.archon/commands/
cp -r <archon-repo>/.archon/workflows/defaults/* <target-repo>/.archon/workflows/
```

Tell the user:
- "Copied **{N} commands** and **{M} workflows** to your repo's `.archon/` folder."
- "You can read, modify, or delete any of these. Your repo versions take priority over bundled defaults."
- "Commands are in `.archon/commands/` — these are prompt templates for AI steps."
- "Workflows are in `.archon/workflows/` — these are YAML files defining multi-step AI pipelines."

Count the files copied to fill in {N} and {M}.

## Step 7: Start the Server (non-CLI platforms only)

**Skip if "CLI only" was selected.**

After all platform tokens are in `.env`, read and follow `guides/server.md` to start the server from the archon repo.

## Step 8: Verify from Target Repo

Run a test workflow from the target repo:

```bash
cd <target-repo> && archon workflow list
```

If the CLI is working, also run:

```bash
cd <target-repo> && archon workflow run archon-assist "Say hello"
```

### Troubleshooting

If verification fails:

| Error | Cause | Fix |
|-------|-------|-----|
| `archon: command not found` | CLI not linked | Re-run `cd <archon-repo>/packages/cli && bun link` |
| `Not a git repository` | Not in a git repo | `cd` to the target repo root |
| `No workflows found` | Missing `.archon/workflows/` | Default workflows load automatically — check `archon version` works first |
| Auth errors | Claude not authenticated | Run `claude /login` |
| `relation "remote_agent_*" does not exist` | DATABASE_URL missing or tables not created | Ensure `~/.archon/.env` has DATABASE_URL and run migrations |
| `Database: sqlite` but expected PostgreSQL | `~/.archon/.env` missing DATABASE_URL | Add DATABASE_URL to `~/.archon/.env` |

## Step 9: Copy Skill to Target Repo

Copy the archon skill so it's available when the user opens Claude Code in their target repo:

```bash
mkdir -p <target-repo>/.claude/skills
cp -r <archon-repo>/.claude/skills/archon <target-repo>/.claude/skills/archon
```

## Step 10: Final Summary

Tell the user what was set up, then give these instructions:

1. Open a new terminal
2. `cd <target-repo>`
3. Run `claude` to launch Claude Code
4. The archon skill is now loaded — ask Claude to run workflows, fix issues, review PRs, etc.

Example first command in the target repo:
```
"Use archon to fix issue #1"
```

Summarize what was copied to their repo:
- `.archon/commands/` — {N} command templates (editable prompts)
- `.archon/workflows/` — {M} workflow definitions (editable YAML pipelines)
- `.claude/skills/archon/` — skill for Claude Code integration

**Important**: End the summary with this message:

> "If you want to configure advanced options later — like changing the default AI assistant, customizing worktree behavior, or adjusting which files get copied into isolated environments — just ask me to help you with 'archon config' and I'll walk you through it."

The end state: user is in their target repo with the Archon skill available, default commands and workflows copied locally for inspection and customization, using Claude Code as the interface.

## Configuration Reference

For advanced users — these are not needed for basic setup:

### Environment Files (`.env`)

Infrastructure config (database URL, platform tokens) is stored in `.env` files:

| Location | Used by | Purpose |
|----------|---------|---------|
| `~/.archon/.env` | **CLI** | Global infrastructure config — database, AI tokens |
| `<archon-repo>/.env` | **Server** | Platform tokens for Telegram/Slack/GitHub/Discord |

**Best practice**: Use `~/.archon/.env` as the single source of truth. Symlink or copy to `<archon-repo>/.env` if running the server.

**Note**: The CLI does NOT load `.env` from the current working directory. This prevents conflicts when running Archon from projects that have their own database configurations.

### Config Files (YAML)

Project-specific settings use layered YAML configs:

| Location | Scope | Purpose |
|----------|-------|---------|
| `~/.archon/config.yaml` | Global | Default AI assistant, streaming modes, concurrency |
| `<repo>/.archon/config.yaml` | Per-repo | AI assistant, worktree settings, commands config |

Environment variables in `.env` override matching `config.yaml` values.

### Repo Config Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `assistant` | `claude` \| `codex` | `claude` | AI assistant for this repo |
| `commands.folder` | string | `.archon/commands` | Custom command folder path (relative to repo root) |
| `commands.autoLoad` | boolean | `true` | Auto-load commands on clone |
| `worktree.baseBranch` | string | auto-detected | Base branch for worktree creation |
| `worktree.copyFiles` | string[] | `[]` | Files to copy into new worktrees (supports `"source -> dest"` syntax) |
| `defaults.loadDefaultCommands` | boolean | `true` | Load bundled default commands at runtime |
| `defaults.loadDefaultWorkflows` | boolean | `true` | Load bundled default workflows at runtime |
