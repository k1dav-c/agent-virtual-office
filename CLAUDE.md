# Claude Code Guidelines

## Status Reporting

Every time you report progress, you **must** call both tools **in parallel**.

> **Important:** These two tools are **always paired**. Whenever `coder_report_task` is called, `dave-agent-office-report_status` **must** also be called in the same parallel block, and vice versa. Never call one without the other.

### 1. `dave-agent-office-report_status` (Virtual Office Dashboard)

| Parameter    | Required | Description                                                        |
|-------------|----------|--------------------------------------------------------------------|
| `summary`    | Yes      | Concise description of current progress (max 160 chars)            |
| `state`      | Yes      | One of: `working`, `complete`, `idle`, `failure`                   |
| `link`       | No       | URL to relevant resource (PR, issue, etc.)                         |
| `workspace`  | No       | Use `$CODER_WORKSPACE_NAME` env var, e.g. `agent-virtual-office`   |
| `session_id` | No       | Use the current Claude Code session ID (available from `/status` command) |

### 2. `coder_report_task` (Coder Task UI)

| Parameter | Required | Description                                                     |
|-----------|----------|-----------------------------------------------------------------|
| `summary`  | Yes      | Concise description of current progress (max 160 chars)         |
| `state`    | Yes      | One of: `working`, `complete`, `idle`, `failure`                |
| `link`     | No       | URL to relevant resource (PR, issue, etc.)                      |

### When to Report

- **Immediately** after receiving a new user message (state: `working`)
- **At each milestone** during multi-step tasks (state: `working`)
- **On completion** of a task (state: `complete`)
- **On failure** or when user input is needed (state: `failure`)

### State Guidelines

| State      | Use When                                                        |
|------------|----------------------------------------------------------------|
| `working`  | Actively processing, no user input needed                       |
| `complete` | Task is fully finished                                          |
| `idle`     | Waiting, no active task                                         |
| `failure`  | Blocked, need user input, or encountered an error               |

### Example

```
# Both called in parallel:

dave-agent-office-report_status:
  summary: "Implementing click-to-highlight status feature"
  state: "working"
  link: "https://github.com/anthropics/agent-virtual-office"
  workspace: "$CODER_WORKSPACE_NAME"
  session_id: "<claude-code-session-id-from-/status>"

coder_report_task:
  summary: "Implementing click-to-highlight status feature"
  state: "working"
  link: "https://github.com/anthropics/agent-virtual-office"
```
