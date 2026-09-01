# Palladio Design Language & System

Palladio 是一套開源設計語言與 design-token system：以深碳灰的表面層級、精準線條與流體有機動效建立共同基礎，同時讓每個產品自行定義品牌強調色。

Foundation（token 系統基礎）已完成。完整設計契約與驗收標準請見 [規格書](docs/spec.md)；第一批元件與壓力測試進行中，請見 GitHub Issues。

## 原則

- 以 token 提供共同規則，而不是將產品鎖定為同一套 UI kit。
- 所有 accent 狀態由產品明確提供並驗證對比；系統不推導色值。
- 支援 Compact、Default、Spacious 三種密度，以及 reduced-motion 行為。

## 產物

`npm --prefix palladio run rebuild` 會從 `palladio/tokens/`、`palladio/themes/` 的 token 來源重新產出：

| 產物 | 路徑 |
|---|---|
| CSS custom properties | `palladio/dist/css/palladio.css` |
| TypeScript const object | `palladio/dist/ts/tokens.ts` |
| Raw JSON | `palladio/dist/json/tokens.json` |
| Agent Reference（AI 代理用 token 總覽與使用規則） | `palladio/dist/agent-reference.md` |

可及性契約（A-M1–A-M6 驗收說明）見 [`palladio/docs/accessibility/accessibility-contract.md`](palladio/docs/accessibility/accessibility-contract.md)。

## 授權

本專案採用 [MIT License](LICENSE)。
