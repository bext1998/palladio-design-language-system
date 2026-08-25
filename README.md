# Palladio Design Language & System

Palladio 是一套開源設計語言與 design-token system：以深碳灰的表面層級、精準線條與流體有機動效建立共同基礎，同時讓每個產品自行定義品牌強調色。

目前專案處於 Foundation 初始化階段。完整設計契約與驗收標準請見 [規格書](docs/spec.md)。

## 原則

- 以 token 提供共同規則，而不是將產品鎖定為同一套 UI kit。
- 所有 accent 狀態由產品明確提供並驗證對比；系統不推導色值。
- 支援 Compact、Default、Spacious 三種密度，以及 reduced-motion 行為。

## 規劃的產物

Foundation 完成後，token pipeline 會產出 CSS custom properties、TypeScript const object、raw JSON 及 `agent-reference.md`。

## 授權

本專案採用 [MIT License](LICENSE)。
