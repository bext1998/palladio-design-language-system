# Palladio Design Language & System — Coding Agent 指令

> 本文件供 Codex、Claude Code 等 coding agent 在每個 session 開始時閱讀。

---

## 專案概述

Palladio Design Language & System 是可跨消費端使用的開源設計語言與 design-token pipeline。

技術棧：JSON + JavaScript + TypeScript + CSS + Style Dictionary

---

## 工作原則

1. 讀取 `MAZE_PROJECT.md` 後，再讀取指定規格章節與相關 Issue。
2. 第一至八章設計語言為 source of truth；不得用 pipeline 便利性改寫其行為。
3. GitHub Issue／PR 與 Git 是工作狀態權威；只有明確 closeout 才重建 `NEXT_ACTION.md`。
4. 修改前確認對應 token、輸出產物、可及性規則與消費端契約。
5. Git Worktrees 請集中放置於 `D:\AgentCoding\.codex\worktrees\PalladioDesignLanguage&System`；建立 Git Worktree 時的分支名稱一律採用 `maze/YYYY-MM-DD-short-hash`，其中 `short-hash` 為隨機值，字尾不得再加任何字樣。

---

## 下一步

閱讀 `NEXT_ACTION.md` 了解這個 session 的目標。

---

## 重要文件

| 文件 | 用途 |
|---|---|
| `docs/spec.md` | 設計語言、token 架構與驗收標準 |
| `MAZE_PROJECT.md` | 規格與 GitHub 工作流的實際定位 |
| `NEXT_ACTION.md` | 下一步行動 |
| `DECISIONS.md` | 有效重大決策索引 |

---

## 禁止行為

- 不得修改 `docs/spec.md` 的功能範圍，除非使用者明確要求。
- 不得為 accent 插槽加入 fallback、推導色值或跨消費端混色公式。
- 不得將 Primitive token 直接用於 UI 元件。
