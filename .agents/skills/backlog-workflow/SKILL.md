---
name: backlog-workflow
description: Coordinates creating backlog issues, selecting GitHub Project items that are ready for implementation, orchestrating code implementation through a subagent, and managing the complete GitHub workflow from issue assignment to pull request creation.
---

# Backlog Workflow Skill

This skill implements an issue-driven development workflow using GitHub Projects V2 and the GitHub MCP server, optimized for the `DeemanthPoonacha/ZapJot` repository.

The parent agent is responsible for project management, GitHub operations, and orchestration.
The implementation subagent is responsible only for understanding the codebase, implementing the requested changes, and verifying correctness.

---

# Workflow Configuration

- **Repository**: `DeemanthPoonacha/ZapJot`
- **Default Branch**: `main`
- **Project Field**: `Status`
- **Workflow State Mapping**:
  - Backlog: `Backlog` or `Todo`
  - Ready: `Ready`
  - In Progress: `In Progress`
  - In PR: `In PR`

---

# Phase 1 — Parent Agent (Workflow Orchestration)

The parent agent manages GitHub issues, git branches, and PRs, and **must never directly edit code**.

## 1. Create Backlog Issue
If asked to create a backlog issue:
- Call `issue_write` (method: `create`) to create the GitHub Issue. Include Summary, Requirements, and Verification steps.
- Set the Project Status to `Backlog`.
- Notify the user when complete.

## 2. Scan Ready Issues
When checking for ready work:
- Call `list_issues` with `field_filters: [{"field_name": "Status", "value": "Ready"}]`.
- If no issues match, notify the user and exit.
- If multiple exist, prioritize: (1) Priority field, (2) Oldest issue.
- Skip issues that are already assigned, have an open PR, or are in progress.

## 3. Claim Issue
- Call `get_me` to determine your GitHub username.
- Assign the issue to yourself and set Project Status to `In Progress`.

## 4. Validate Issue
- Verify the issue contains a clear description, acceptance criteria, and expected behavior.
- If details are missing, stop and request clarification. Do not invent requirements.

## 5. Create Feature Branch
- Checkout `main`, pull latest, and checkout a branch: `feature/<issue-number>-<slug>` (or `bugfix/...`, `docs/...`).
- Reuse an existing branch if it already exists.

## 6. Invoke Implementation Subagent
- Invoke the `self` subagent as `Code Implementer`.
- Provide the issue context.
- **Rule**: The subagent must NOT commit, push, or create PRs.

## 7. Review & Commit
- Review the subagent's changes for code quality, naming, and architecture. Request fixes if needed.
- Verify changes with `git diff --stat`.
- Commit using Conventional Commits (e.g. `feat(auth): add login button - closes #12`).

## 8. Push & Create Pull Request
- Push the branch to origin.
- Open a PR (`create_pull_request`). Title: `feat: <title>`, Description: `Closes #<issue-number>` + test summary.
- Update Project Status to `In PR`.

---

# Failure Recovery
- **Existing PR**: Update the existing PR instead of creating a new one.
- **Merge Conflicts**: Stop and notify the user.
- **Verification Fails Repeatedly**: Attempt repair up to three times. If still failing, push the branch, open a Draft PR, and comment on the issue explaining the failures.

---

# Definition of Done
Before opening a PR, verify:
- Acceptance criteria satisfied and tests pass.
- Code style, lint, and type checking pass.
- No debug/TODO comments left in code.
- Project status is updated to `In PR`.

---

# Phase 2 — Code Implementer (Subagent)

The implementation subagent owns only code implementation.

1. **Research**: Search the repository using `grep_search`. Produce a brief implementation plan before editing code.
2. **Implement**: Align with existing design patterns. Prefer existing utilities; avoid large refactors.
3. **Verify**: Run tests (`npm test` / `npm run lint`). Max 3 repair attempts on failure.
4. **Report**: Reply to the parent agent with a summary of changes and files modified. Do not commit or push.