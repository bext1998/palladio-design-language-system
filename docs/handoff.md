# 交接文件

> 建立日期：2026-08-31
> 交接方：Codex
> 接收方：接手的 coding agent / 工程師

---

## TL;DR（5 分鐘讀完）

Palladio 是以 DTCG JSON + Style Dictionary v5 為基礎的跨消費端 design-token system，目前 Foundation pipeline 已實作並推送到 PR #20。Primitive／Semantic token、三種 Density preset、暗色主題與既有 token 驗證都已完成，PR #20 新增 CSS／TypeScript／JSON 三種可重現產物與產物驗證。下一步是審查並合併 PR #20、關閉 Issue #5，接著推進 agent reference、可及性驗證與元件消費。特別注意：Primitive token 不得直接輸出給 UI，accent 不做 fallback 或推導，產物一律由 pipeline 重新生成。

---

## 專案概述

- **專案名稱**：Palladio Design Language & System
- **目標**：建立可跨消費端使用的開源設計語言與 design-token pipeline
- **技術棧**：JSON（DTCG）+ JavaScript（Node ESM）+ Style Dictionary v5
- **Repo**：https://github.com/bext1998/palladio-design-language-system

---

## 當前狀態

**開發階段**：Foundation 開發中，等待 PR 審查

**已完成**：
- Primitive token（色彩、字體、間距、圓角、動效）與 DTCG 驗證。
- Semantic token、三種 Density preset（Compact／Default／Spacious）、暗色主題。
- Token pipeline：`palladio/pipeline/config.js` 可從來源 token 生成 CSS、TypeScript、JSON。
- 產物驗證：選擇器、density 值、TS const export、JSON 結構、Primitive 不洩漏、重建一致性。
- PR #20 已推送：`maze/2026-08-31-55f275`，commit `d2194a9`。

**進行中（未完成）**：
- PR #20 待審查、合併；Issue #5 待關閉。
- GitHub Actions 目前沒有 status check；CI 設定尚未建立。

**已知問題**：
- 無阻塞問題。PR #20 mergeable，尚無 review 與 CI 結果。

---

## 下一步行動

1. 審查並合併 [PR #20](https://github.com/bext1998/palladio-design-language-system/pull/20)，確認 Issue #5 自動關閉。
2. 補上適用的 CI（建議至少跑 token 驗證與 pipeline rebuild）。
3. 依 NEXT_ACTION 繼續推進 agent reference、可及性驗證與元件消費。

---

## 重要技術決策

| 決策 | 原因 |
|---|---|
| 只輸出 Semantic／Density／Theme token，不輸出 Primitive | 符合三層架構：Primitive 僅作為來源，不得直接用於 UI |
| CSS 以 `:root[data-theme="dark"]`、`:root[data-density]` 分組 | 符合 Spec 9.3 的選擇器契約，Default density 用屬性選擇器提供 fallback |
| TypeScript 產物使用 `export const ... as const` | 可 tree-shake，供 React 消費 |
| JSON 產物輸出已解析的巢狀值，不輸出 DTCG metadata | Go／Wails 可直接讀取，不需自行解析 reference 或 `$value` |
| Pipeline 不做 accent fallback 或推導 | 符合規格禁令：accent 由產品自行提供並驗證對比 |

---

## 注意事項（地雷與陷阱）

- `palladio/dist/` 下的產物是生成物，不要手改；一律用 `npm --prefix palladio run rebuild` 重新生成。
- `palladio/pipeline/validate-tokens.mjs` 是既有驗證腳本，本次未修改；不要為了 pipeline 便利性改寫它的驗證行為。
- 目前 `palladio/package.json` 有 `style-dictionary` devDependency；若未來要發布 package，需另案處理 dependency 分類與 package entry points。
- 規格指定 `agent-reference.md` 為必要產出，但 Issue #5 明確排除其內容設計；不要在 PR #20 補做，避免範圍擴張。
- 不要將 Primitive token 直接加入 UI 元件，也不要為 accent 插槽加入 fallback、推導色值或跨消費端混色公式。

---

## 重要文件位置

| 文件 | 路徑 |
|---|---|
| 規格書 | `docs/spec.md` |
| 專案定位 | `MAZE_PROJECT.md` |
| 當前狀態 | `NEXT_ACTION.md` |
| 決策紀錄 | `DECISIONS.md` |
| Token 來源 | `palladio/tokens/`、`palladio/themes/` |
| Pipeline 設定 | `palladio/pipeline/config.js` |
| 生成產物 | `palladio/dist/` |

---

## 快速指令

```powershell
npm --prefix palladio run rebuild
npm --prefix palladio run validate:tokens
npm --prefix palladio run validate:artifacts
```
