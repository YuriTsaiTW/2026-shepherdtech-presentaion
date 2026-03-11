# GitHub Actions CI/CD Workflows

## Overview

This repository uses **4 GitHub Actions workflows** covering the full CI/CD lifecycle.
All workflows share a composite action at `.github/actions/setup-pnpm/` for environment setup.

---

## Workflow Summary

| Trigger | Workflow File | Purpose |
|---------|--------------|---------|
| PR → `master` | `pr.yml` | Code quality checks + conditional SAST |
| Push to `master` | `release.yml` | Build, publish, and deploy Storybook |
| Push to `pre-release/**` | `prerelease.yml` | Build and publish pre-release packages |
| Weekly schedule + manual | `security-scan.yml` | Full SAST scan on `master` branch |
| Other branches | ❌ No trigger | Resource optimization |

---

## Create PR

- **Trigger**: Pull request targeting `master` branch
- **Architecture**: Two parallel jobs

### Job 1 — `quality` (always runs)

1. Checkout with full history
2. Setup Node + pnpm + restore cache (`setup-pnpm` action)
3. Prettier format check — TypeScript, JSON, CSS
4. Nx affected tasks — `lint`, `test`, `build` (base: PR base SHA)

### Job 2 — `sast` (conditional, `continue-on-error: true`)

- **Condition**: PR title contains `[sast]`

Steps:
1. Checkout
2. Download ShiftLeft CLI from `cdn.shiftleft.io`
3. Set up Java (temurin 11) — required by ShiftLeft CLI
4. Run SAST analysis (tagged with branch name)
5. Generate security report to `/tmp/pr-security-report.md`
6. Post report as PR comment via GitHub API (`GH_TOKEN`)

> **Note**: PR title is read directly from `github.event.pull_request.title` — no REST API call needed.

---

## Release a Package

- **Trigger**: Push to `master` branch
- **Architecture**: 5 jobs — `validate-commit` → `build-publish` → (`tag-release` + `teams-notification` + `storybook-deploy` in parallel)

### Job 1 — `validate-commit`

- Reads the latest commit message with `git log`
- Runs `.github/scripts/check-commit-title.sh` to validate format:
  ```
  chore(<package>): release version <X.Y.Z>
  ```
- Exports job outputs: `should_publish`, `publish_package`, `publish_version`

### Job 2 — `build-publish` (requires `validate-commit` + `should_publish == 'true'`)

1. Checkout + `setup-pnpm`
2. Build: `pnpm nx run <package>:build`
3. Publish: `pnpm nx release publish --projects=<package>` → Azure Artifacts

### Job 3 — `tag-release` (requires `build-publish` success, parallel)

Runs in parallel with `teams-notification` and `storybook-deploy`.

1. Checkout (`fetch-depth: 0`) — `permissions: contents: write`
2. `git config user.name "github-actions[bot]"`
3. `git tag @mvb-fe/<package>/v<version> HEAD`
4. `git push origin <tag>`

### Job 4 — `teams-notification` (requires `build-publish` success, parallel)

1. Checkout + `setup-pnpm`
2. Warm up Nx project graph: `nx graph --file=/tmp/graph.json`
3. Run `scripts/publish/teams.mjs <package> $TEAMS_WEBHOOK_PUBLISH` → posts to Teams channel

### Job 5 — `storybook-deploy` (requires `build-publish` success, parallel)

1. Checkout + `setup-pnpm`
2. `pnpm nx run docs:generate-typedoc-mdx`
3. `pnpm nx run docs:build-storybook`
4. Deploy `dist/storybook/docs/` → **GitHub Pages**

> **Note**: Storybook is deployed only on releases from `master`. Pre-release branches do not deploy Storybook.

---

## Pre-release a Package

- **Trigger**: Push to `pre-release/**` branch (e.g. `pre-release/auth-v4`)
- **Architecture**: 4 jobs — `validate-commit` → `build-publish` → (`tag-release` + `teams-notification` in parallel), minus Storybook deployment

### Commit Format Validation

| Branch | Version format | Will publish? |
|--------|---------------|--------------|
| `master` | `1.2.3` (stable) | ✅ |
| `master` | `1.2.3-alpha.0` (pre-release) | ❌ |
| `pre-release/*` | `1.2.3-alpha.0` (pre-release) | ✅ |
| `pre-release/*` | `1.2.3` (stable) | ❌ |
| any other | any | ❌ |

### Branch name → `GITHUB_REF`

The script receives the branch via the built-in `$GITHUB_REF` env var (e.g. `refs/heads/pre-release/auth-v4`),
so no additional mapping is needed.

---

## Scheduled Security Scan

- **Trigger**: Weekly on **Monday 10:00 AM UTC+8** (`cron: '0 2 * * 1'`) + `workflow_dispatch` for manual runs
- **Architecture**: 2 sequential jobs

### Job 1 — `sast-scan`

1. Checkout
2. Download ShiftLeft CLI
3. Set up Java (temurin 11) — required by ShiftLeft CLI
4. Extract branch name from `$GITHUB_REF`
5. Run SAST: full `master` branch analysis (tagged `branch=master`)
6. Generate report to `/tmp/monthly-security-report.md`
7. Upload report as artifact `SecurityReport`

### Job 2 — `notify` (requires `sast-scan` success)

1. Checkout + download artifact `SecurityReport` → `/tmp` + `setup-pnpm`
2. Parse critical issue count from report table (`Critical | N` row)
3. If critical count > 0 → create **GitHub Issue** (label: `security`, includes full report body)
4. Run `.github/scripts/teams.mjs $TEAMS_WEBHOOK_SECURITY <critical_count> <issue_number>` → posts to Teams channel

> **Note**: GitHub Issues are used for tracking critical findings. Issue number (if created) is forwarded to the Teams notification for direct linking.

---

## Shared Infrastructure

### `.github/actions/setup-pnpm/`

Composite action used by all workflows requiring dependency installation:

```
actions/setup-node@v4     → Node 22.12.0
pnpm/action-setup@v4      → pnpm 9.15.1
actions/cache@v4           → ~/.pnpm-store (keyed by OS + pnpm-lock.yaml)
pnpm i --frozen-lockfile   → Install dependencies
```

Requires `AZURE_NPM_TOKEN` env var to be set by the calling job (for Azure Artifacts auth).

### `.github/scripts/check-commit-title.sh`

Validates commit title format and outputs:
- `SHOULD_PUBLISH` — `true` / `false`
- `PUBLISH_PACKAGE` — e.g. `auth`, `design-system`
- `PUBLISH_VERSION` — e.g. `3.32.0` or `3.32.0-alpha.0`

Outputs are written to `$GITHUB_OUTPUT` for use as job outputs.

---

## GitHub Secrets Required

| Secret | Used by | Description |
|--------|---------|-------------|
| `AZURE_NPM_TOKEN` | All workflows | Azure Artifacts PAT (`Packaging Read & Write`) |
| `SHIFTLEFT_ACCESS_TOKEN` | `pr.yml`, `security-scan.yml` | ShiftLeft/Qwiet SAST token |
| `TEAMS_WEBHOOK_PUBLISH` | `release.yml`, `prerelease.yml` | Teams incoming webhook for publish notifications |
| `TEAMS_WEBHOOK_SECURITY` | `security-scan.yml` | Teams incoming webhook for SAST scan results |
| `GITHUB_TOKEN` | `pr.yml`, `security-scan.yml` | Auto-provided by GitHub Actions |

---

## npm Registry

Packages are still published to **Azure Artifacts** (`@mvb-fe` scope).
Auth is handled via `.npmrc` using `${AZURE_NPM_TOKEN}` environment variable substitution:

```
registry=https://pkgs.dev.azure.com/viewsonic-ssi/_packaging/mvb-fe/npm/registry/
//pkgs.dev.azure.com/...:_authToken=${AZURE_NPM_TOKEN}
```

For **local development**, set `AZURE_NPM_TOKEN` in your shell environment before running `pnpm install`.

---

## One-time GitHub Setup

These settings must be configured in the GitHub repository before workflows run:

1. **Secrets** — Add all secrets listed above under Settings → Secrets and variables → Actions
2. **GitHub Pages** — Settings → Pages → Source → **GitHub Actions**
3. **`security` label** — Create this label (Issues → Labels) for `security-scan.yml` to tag issues
