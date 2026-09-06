# 取得 token 產物（依環境）

Palladio 不提供 accent 色值，也不推導任何值。以下只講「怎麼把 `@pdiodsgn/tokens` 的產物接進消費端」。token 名稱與數值一律以取得的 `agent-reference.md` 為準。

一律 **pin 精確版本**。Palladio 的驗證策略是生產接入為主：發現不足 → Palladio 發新版 → 消費端 bump 精確版本 → 重驗。first-party 消費端不要用 `^` 或 `latest`。

## JS / React / 打包網頁

```sh
npm install @pdiodsgn/tokens@<version> --save-exact
```

```ts
import "@pdiodsgn/tokens/css";                 // 註冊 --pd-* 自訂屬性
import { palladioTokens } from "@pdiodsgn/tokens"; // 只有需要在 JS 讀值時才 import
```

根元素設屬性（`data-theme="dark"` 必要，否則色彩未定義）：

```html
<html data-theme="dark" data-density="compact">
```

## 無 build 網頁

```html
<!-- <version> 換成要 pin 的精確版本 -->
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@pdiodsgn/tokens@<version>/dist/css/palladio.css" />
<link rel="stylesheet" href="/accent.css" /> <!-- 消費端自己的 accent 六插槽 -->
```

```html
<html data-theme="dark"> ... </html>
```

## Go / Wails

build script 依 pin 的版本抓 `tokens.json`（暫存檔，不是手工拷進 repo 的死檔）：

```
https://cdn.jsdelivr.net/npm/@pdiodsgn/tokens@<version>/dist/json/tokens.json
```

`go:embed` 那份 JSON，配一份對應 schema 的 struct（頂層 `semantic` / `density` / `theme`）。Wails 的 WebView 載入同版本 CSS。執行期不抓網。

## AI coding agent（讀 token 值時）

讀該版本的 `agent-reference.md`：

- 已安裝套件：`node_modules/@pdiodsgn/tokens/dist/agent-reference.md`
- 否則：`https://cdn.jsdelivr.net/npm/@pdiodsgn/tokens@<version>/dist/agent-reference.md`

裡面有完整 token 表、命名空間、density preset 值與可及性摘要。不要把整個 Palladio repo 當 context。

## accent 六插槽驗證

消費端在自己的 CSS／token 檔定義六個插槽後：

```ts
import { validateAccentPairs } from "@pdiodsgn/tokens/validate-accents";
validateAccentPairs(
  { accent, accentHover, accentActive, accentDisabled, accentSubtle, accentText },
  [{ name: "icon on accent-subtle", foreground, background, kind: "ui" }],
); // 缺插槽、格式錯、或配對低於 A-M1／A-M2 門檻會 throw
```

或 CI：

```sh
npx --package @pdiodsgn/tokens@<version> palladio-validate-accents ./palladio-accent.json
```
