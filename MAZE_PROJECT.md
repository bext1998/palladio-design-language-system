# MAZE_PROJECT — Palladio Design Language & System 定位與工作流設定

> 由 `maze-project-init` 建立。Agent 讀取規格前必須先由此取得實際路徑。
> 文件搬移或設定變更時才更新；不得記錄 token、API key、密碼或私密憑證。

## 專案資訊

- 專案名稱：Palladio Design Language & System
- 目標工具：Codex
- 建立日期：2026-08-26

## 文件

- Spec：docs/spec.md
- Project Brief：PROJECT_BRIEF.md
- Next Action：NEXT_ACTION.md
- Decisions：DECISIONS.md

## 自適應 Guidance

- Default profile：scaffolded
- Model overlay：gpt-5.6
- Host capabilities：Codex Desktop、Git、GitHub CLI；目前不使用子代理。
- Profile escalation evidence：無。

## GitHub

- Repository：bext1998/palladio-design-language-system
- Issue tracking：enabled
- Spec to Issues：enabled
- Priority label convention：P1、P2、P3、P4
- Category label convention：feature、documentation、testing、accessibility、tooling
- Default assignee policy：none
- Allow label creation：yes

## 備注

- 本專案為公開開源專案，採用 MIT License。
- `palladio/` 是規格第 9.5 節定義的套件根目錄；其產物在 Foundation 實作時建立。
