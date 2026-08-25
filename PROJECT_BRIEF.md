# Palladio Design Language & System — 專案說明

> 建立日期：2026-08-26
> 最後更新：2026-08-26

---

## 一句話說明

Palladio 是以深碳灰、精準線條與流體有機動效為核心，並保留產品品牌強調色自主性的開源設計語言與 token 系統。

---

## 核心問題

產品需要可複用、可跨平台輸出的設計基礎，但不應被固定 UI kit 或單一品牌色限制。Palladio 以三層 token 架構、密度 preset 與可及性規則提供共同約束，讓各產品維持自身視覺識別。

---

## 技術棧

- **語言**：JSON、JavaScript、TypeScript、CSS、Markdown
- **框架 / 主要套件**：Style Dictionary（token pipeline）
- **資料存儲**：版本控制的檔案系統
- **目標平台**：Web、React、Go / Wails 與支援 CSS custom properties 的消費端

---

## Coding Agent 工具

- **主要工具**：Codex
- **備用工具**：Claude Code

---

## 相關文件

- 規格書：[docs/spec.md](docs/spec.md)
- 下一步：[NEXT_ACTION.md](NEXT_ACTION.md)
- 決策紀錄：[DECISIONS.md](DECISIONS.md)

---

## 重要限制

- 第一至八章設計語言是 source of truth；第九章是承載它的技術基礎。
- 所有產品必須明確提供完整 accent 插槽，不得使用 fallback 或跨消費端混色公式。
- 可及性 `[MUST]` 規則、三種 density 與 reduced-motion 行為均為可驗收需求。
- 本專案採 MIT License；不得在文件、設定或提交中寫入憑證。
