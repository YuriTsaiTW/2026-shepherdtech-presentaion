# GitHub Actions Workflow Diagrams

## PR Quality Checks (`pr.yml`)

```mermaid
%%{init: {"theme": "dark", "themeVariables": {"primaryColor": "#4a5568", "primaryTextColor": "#ffffff", "primaryBorderColor": "#2d3748", "lineColor": "#6b7280"}}}%%
flowchart TD
    A["Open or Update PR → master"] --> B["Job: quality ⚡ Always runs"]
    A --> C["Job: sast 🔒 Conditional\ncontinue-on-error: true"]

    B --> B1["checkout (fetch-depth: 0)"]
    B1 --> B2["setup-pnpm action\nNode 22.12.0 + pnpm 9.15.1 + cache"]
    B2 --> B3["Prettier check\n*.ts, *.tsx, *.json, *.css"]
    B3 --> B4["Nx affected lint, test, build\nbase = PR base SHA"]

    C --> C0{"PR title contains\n'[sast]'?"}
    C0 -->|"No"| C_SKIP["⏭️ Job skipped"]
    C0 -->|"Yes"| C1["checkout"]
    C1 --> C2["Download ShiftLeft CLI\ncurl cdn.shiftleft.io/download/sl"]
    C2 --> C2J["Set up Java\ntemurin 11"]
    C2J --> C3["Run SAST analysis\n--app edu-npm-packages --js --cpg\n--exclude scripts,apps/docs/scripts,tools"]
    C3 --> C4["Generate security report\n/tmp/pr-security-report.md"]
    C4 --> C5["Post report to PR\ngh api repos/:repo/issues/:number/comments\n(GH_TOKEN)"]

    style A fill:#2563eb,stroke:#1d4ed8,color:#ffffff
    style B fill:#10b981,stroke:#059669,color:#ffffff
    style B1 fill:#10b981,stroke:#059669,color:#ffffff
    style B2 fill:#10b981,stroke:#059669,color:#ffffff
    style B3 fill:#10b981,stroke:#059669,color:#ffffff
    style B4 fill:#10b981,stroke:#059669,color:#ffffff
    style C fill:#dc2626,stroke:#b91c1c,color:#ffffff
    style C0 fill:#eab308,stroke:#ca8a04,color:#000000
    style C_SKIP fill:#6b7280,stroke:#4b5563,color:#ffffff
    style C1 fill:#dc2626,stroke:#b91c1c,color:#ffffff
    style C2 fill:#dc2626,stroke:#b91c1c,color:#ffffff
    style C2J fill:#dc2626,stroke:#b91c1c,color:#ffffff
    style C3 fill:#dc2626,stroke:#b91c1c,color:#ffffff
    style C4 fill:#dc2626,stroke:#b91c1c,color:#ffffff
    style C5 fill:#8b5cf6,stroke:#7c3aed,color:#ffffff
```

---

## Release Workflow (`release.yml`)

```mermaid
%%{init: {"theme": "dark", "themeVariables": {"primaryColor": "#4a5568", "primaryTextColor": "#ffffff", "primaryBorderColor": "#2d3748", "lineColor": "#6b7280"}}}%%
flowchart TD
    A["Push to master branch"] --> B["Job: validate-commit 🔍"]

    B --> B1["checkout (fetch-depth: 0)"]
    B1 --> B2["check-commit-title.sh\nrefs/heads/master + git log -n 1"]
    B2 --> B3{{"should_publish?\nPUBLISH_PACKAGE\nPUBLISH_VERSION"}}

    B3 -->|"false"| SKIP["⏭️ Pipeline ends\nNot a release commit"]
    B3 -->|"true"| C["Job: build-publish 🚀"]

    C --> C1["checkout + setup-pnpm\n(AZURE_NPM_TOKEN)"]
    C1 --> C2["pnpm nx run package:build"]
    C2 --> C3["pnpm nx release publish --projects\n→ Azure Artifacts"]

    C3 -->|"Success"| D["Job: tag-release 🏷️\n(parallel)"]
    C3 -->|"Success"| E["Job: teams-notification 💬\n(parallel)"]
    C3 -->|"Success"| F["Job: storybook-deploy 📚\n(parallel)"]
    C3 -->|"Failure"| FAIL["❌ Stop"]

    D --> D1["checkout (fetch-depth: 0)\npermissions: contents: write"]
    D1 --> D2["git config github-actions[bot]"]
    D2 --> D3["git tag @mvb-fe/PACKAGE/vVERSION HEAD"]
    D3 --> D4["git push origin TAG_NAME"]

    E --> E1["checkout + setup-pnpm"]
    E1 --> E2["nx graph --file=/tmp/graph.json\n(warm Nx cache)"]
    E2 --> E3["scripts/publish/teams.mjs\nPACKAGE TEAMS_WEBHOOK_PUBLISH\n→ Teams Channel"]

    F --> F1["checkout + setup-pnpm"]
    F1 --> F2["docs:generate-typedoc-mdx"]
    F2 --> F3["docs:build-storybook"]
    F3 --> F4["actions/configure-pages@v4"]
    F4 --> F5["actions/upload-pages-artifact@v3\ndist/storybook/docs/"]
    F5 --> F6["actions/deploy-pages@v4\n→ GitHub Pages"]

    style A fill:#16a34a,stroke:#15803d,color:#ffffff
    style B fill:#06b6d4,stroke:#0891b2,color:#ffffff
    style B1 fill:#06b6d4,stroke:#0891b2,color:#ffffff
    style B2 fill:#06b6d4,stroke:#0891b2,color:#ffffff
    style B3 fill:#eab308,stroke:#ca8a04,color:#000000
    style SKIP fill:#6b7280,stroke:#4b5563,color:#ffffff
    style C fill:#7c3aed,stroke:#6d28d9,color:#ffffff
    style C1 fill:#7c3aed,stroke:#6d28d9,color:#ffffff
    style C2 fill:#7c3aed,stroke:#6d28d9,color:#ffffff
    style C3 fill:#7c3aed,stroke:#6d28d9,color:#ffffff
    style D fill:#f97316,stroke:#ea580c,color:#ffffff
    style D1 fill:#f97316,stroke:#ea580c,color:#ffffff
    style D2 fill:#f97316,stroke:#ea580c,color:#ffffff
    style D3 fill:#f97316,stroke:#ea580c,color:#ffffff
    style D4 fill:#f97316,stroke:#ea580c,color:#ffffff
    style E fill:#0ea5e9,stroke:#0284c7,color:#ffffff
    style E1 fill:#0ea5e9,stroke:#0284c7,color:#ffffff
    style E2 fill:#0ea5e9,stroke:#0284c7,color:#ffffff
    style E3 fill:#0ea5e9,stroke:#0284c7,color:#ffffff
    style F fill:#8b5cf6,stroke:#7c3aed,color:#ffffff
    style F1 fill:#8b5cf6,stroke:#7c3aed,color:#ffffff
    style F2 fill:#8b5cf6,stroke:#7c3aed,color:#ffffff
    style F3 fill:#8b5cf6,stroke:#7c3aed,color:#ffffff
    style F4 fill:#8b5cf6,stroke:#7c3aed,color:#ffffff
    style F5 fill:#8b5cf6,stroke:#7c3aed,color:#ffffff
    style F6 fill:#8b5cf6,stroke:#7c3aed,color:#ffffff
    style FAIL fill:#dc2626,stroke:#b91c1c,color:#ffffff
```

---

## Pre-release Workflow (`prerelease.yml`)

```mermaid
%%{init: {"theme": "dark", "themeVariables": {"primaryColor": "#4a5568", "primaryTextColor": "#ffffff", "primaryBorderColor": "#2d3748", "lineColor": "#6b7280"}}}%%
flowchart TD
    A["Push to pre-release/** branch"] --> B["Job: validate-commit 🔍"]

    B --> B1["checkout (fetch-depth: 0)"]
    B1 --> B2["check-commit-title.sh\n$GITHUB_REF + git log -n 1"]
    B2 --> B3{{"should_publish?\nPUBLISH_PACKAGE\nPUBLISH_VERSION"}}

    B3 -->|"false"| SKIP["⏭️ Pipeline ends\nNot a pre-release commit\nor wrong branch/version combo"]
    B3 -->|"true"| C["Job: build-publish 🚀"]

    C --> C1["checkout + setup-pnpm\n(AZURE_NPM_TOKEN)"]
    C1 --> C2["pnpm nx run package:build"]
    C2 --> C3["pnpm nx release publish --projects\n→ Azure Artifacts (pre-release tag)"]

    C3 -->|"Success"| D["Job: tag-release 🏷️\n(parallel)"]
    C3 -->|"Success"| E["Job: teams-notification 💬\n(parallel)"]
    C3 -->|"Failure"| FAIL["❌ Stop"]

    D --> D1["checkout (fetch-depth: 0)\npermissions: contents: write"]
    D1 --> D2["git config github-actions[bot]"]
    D2 --> D3["git tag @mvb-fe/PACKAGE/vVERSION HEAD"]
    D3 --> D4["git push origin TAG_NAME"]

    E --> E1["checkout + setup-pnpm"]
    E1 --> E2["nx graph --file=/tmp/graph.json\n(warm Nx cache)"]
    E2 --> E3["scripts/publish/teams.mjs\nPACKAGE TEAMS_WEBHOOK_PUBLISH\n→ Teams Channel"]

    style A fill:#eab308,stroke:#ca8a04,color:#000000
    style B fill:#06b6d4,stroke:#0891b2,color:#ffffff
    style B1 fill:#06b6d4,stroke:#0891b2,color:#ffffff
    style B2 fill:#06b6d4,stroke:#0891b2,color:#ffffff
    style B3 fill:#eab308,stroke:#ca8a04,color:#000000
    style SKIP fill:#6b7280,stroke:#4b5563,color:#ffffff
    style C fill:#7c3aed,stroke:#6d28d9,color:#ffffff
    style C1 fill:#7c3aed,stroke:#6d28d9,color:#ffffff
    style C2 fill:#7c3aed,stroke:#6d28d9,color:#ffffff
    style C3 fill:#7c3aed,stroke:#6d28d9,color:#ffffff
    style D fill:#f97316,stroke:#ea580c,color:#ffffff
    style D1 fill:#f97316,stroke:#ea580c,color:#ffffff
    style D2 fill:#f97316,stroke:#ea580c,color:#ffffff
    style D3 fill:#f97316,stroke:#ea580c,color:#ffffff
    style D4 fill:#f97316,stroke:#ea580c,color:#ffffff
    style E fill:#0ea5e9,stroke:#0284c7,color:#ffffff
    style E1 fill:#0ea5e9,stroke:#0284c7,color:#ffffff
    style E2 fill:#0ea5e9,stroke:#0284c7,color:#ffffff
    style E3 fill:#0ea5e9,stroke:#0284c7,color:#ffffff
    style FAIL fill:#dc2626,stroke:#b91c1c,color:#ffffff
```

---

## Scheduled Security Scan (`security-scan.yml`)

```mermaid
%%{init: {"theme": "dark", "themeVariables": {"primaryColor": "#4a5568", "primaryTextColor": "#ffffff", "primaryBorderColor": "#2d3748", "lineColor": "#6b7280"}}}%%
flowchart TD
    A["Weekly: Monday 10:00 AM UTC+8\nor workflow_dispatch"] --> B["Job: sast-scan 🔒"]

    B --> B1["checkout"]
    B1 --> B2["Download ShiftLeft CLI\ncurl cdn.shiftleft.io/download/sl"]
    B2 --> B2J["Set up Java\ntemurin 11"]
    B2J --> B3["Extract branch name\n$GITHUB_REF → branch output"]
    B3 --> B4["Run SAST analysis\n--app edu-npm-packages --tag branch=BRANCH\n--exclude scripts,apps/docs/scripts,tools"]
    B4 --> B5["Generate report\n/tmp/monthly-security-report.md"]
    B5 --> B6["Upload artifact\nname: SecurityReport"]

    B6 --> C["Job: notify 📣"]

    C --> C1["checkout + download artifact\nSecurityReport → /tmp"]
    C1 --> C2["setup-pnpm\n(AZURE_NPM_TOKEN)"]
    C2 --> C3["Analyze report, create issue if needed,\nand send Teams notification"]

    C3 --> C4{"Critical count > 0?"}
    C4 -->|"No"| C5["✅ No critical issues\nSkip issue creation"]
    C4 -->|"Yes"| C6["gh issue create\n--label security\n→ GitHub Issue"]

    C5 --> C7[".github/scripts/teams.mjs\nWEBHOOK CRITICAL_COUNT ISSUE_NUMBER\n→ Teams Channel (TEAMS_WEBHOOK_SECURITY)"]
    C6 --> C7

    style A fill:#f59e0b,stroke:#d97706,color:#000000
    style B fill:#dc2626,stroke:#b91c1c,color:#ffffff
    style B1 fill:#dc2626,stroke:#b91c1c,color:#ffffff
    style B2 fill:#dc2626,stroke:#b91c1c,color:#ffffff
    style B2J fill:#dc2626,stroke:#b91c1c,color:#ffffff
    style B3 fill:#dc2626,stroke:#b91c1c,color:#ffffff
    style B4 fill:#dc2626,stroke:#b91c1c,color:#ffffff
    style B5 fill:#dc2626,stroke:#b91c1c,color:#ffffff
    style B6 fill:#8b5cf6,stroke:#7c3aed,color:#ffffff
    style C fill:#06b6d4,stroke:#0891b2,color:#ffffff
    style C1 fill:#06b6d4,stroke:#0891b2,color:#ffffff
    style C2 fill:#10b981,stroke:#059669,color:#ffffff
    style C3 fill:#f59e0b,stroke:#d97706,color:#000000
    style C4 fill:#eab308,stroke:#ca8a04,color:#000000
    style C5 fill:#6b7280,stroke:#4b5563,color:#ffffff
    style C6 fill:#ef4444,stroke:#dc2626,color:#ffffff
    style C7 fill:#0ea5e9,stroke:#0284c7,color:#ffffff
```

---

## setup-pnpm Composite Action

```mermaid
%%{init: {"theme": "dark", "themeVariables": {"primaryColor": "#4a5568", "primaryTextColor": "#ffffff", "primaryBorderColor": "#2d3748", "lineColor": "#6b7280"}}}%%
flowchart LR
    A["Job sets\nAZURE_NPM_TOKEN env"] --> B["actions/setup-node@v4\nNode 22.12.0"]
    B --> C["pnpm/action-setup@v4\npnpm 9.15.1"]
    C --> D["Get pnpm store path"]
    D --> E["actions/cache@v4\n~/.pnpm-store\nkey: pnpm-OS-hash(pnpm-lock.yaml)"]
    E --> F["pnpm i --frozen-lockfile\n(reads .npmrc → Azure Artifacts)"]

    style A fill:#4a5568,stroke:#2d3748,color:#ffffff
    style B fill:#10b981,stroke:#059669,color:#ffffff
    style C fill:#10b981,stroke:#059669,color:#ffffff
    style D fill:#10b981,stroke:#059669,color:#ffffff
    style E fill:#10b981,stroke:#059669,color:#ffffff
    style F fill:#16a34a,stroke:#15803d,color:#ffffff
```
