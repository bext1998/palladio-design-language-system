# Input

`Input` 是原生 `<input>` 的框架無關樣式，搭配 `.pd-field` 作為 label／訊息的結構容器。根元素須先套用 Foundation 的 `data-theme="dark"`，載入 `palladio/dist/css/palladio.css` 後再載入 `input.css`。`.pd-input` 本身不限定 `type`（`text`、`email`、`password` 等原生型別皆可套用），但不涵蓋 `<textarea>` 或其他自訂輸入元件。

```html
<div class="pd-field">
  <label class="pd-field__label" for="name">姓名</label>
  <input class="pd-input" id="name" type="text" placeholder="王小明">
</div>

<div class="pd-field">
  <label class="pd-field__label" for="name-disabled">姓名</label>
  <input class="pd-input" id="name-disabled" type="text" placeholder="王小明" disabled>
</div>

<div class="pd-field pd-field--error">
  <label class="pd-field__label" for="email">電子郵件</label>
  <input
    class="pd-input pd-input--error"
    id="email"
    type="email"
    aria-invalid="true"
    aria-describedby="email-message"
  >
  <p class="pd-field__message" id="email-message">
    <span class="pd-field__icon" aria-hidden="true">⚠</span>
    請輸入有效的電子郵件地址。
  </p>
</div>
```

## 變體與 density

- `.pd-input` 使用 `--pd-radius-sm`（規格 4.1：input 適用輕微圓角）。
- padding 和 `min-block-size` 分別使用 `--pd-density-component-padding-*` 與 `--pd-density-component-min-interactive-size`，與 Button 相同。
- 將 `data-density="compact"` 或 `data-density="spacious"` 設在 Foundation CSS 套用的根元素；省略時為 Default。三種 density 的最小互動尺寸為 32、36、48px；元件結構不因 density 改變。
- `.pd-input` 不預設寬度，由消費端依版面決定（例如 `width: 100%` 或 grid 欄位寬度）。

## 狀態與鍵盤

| 狀態 | 觸發方式 | 呈現 |
|---|---|---|
| Idle | 可操作的初始狀態 | `--pd-color-input-border` 邊框、透明背景，讓元件與所在表面融合，僅靠邊框定義邊界 |
| Hover | 支援 hover 的指標裝置 | 背景切換為 `--pd-color-surface-raised`（見下方「為什麼不用 surface-hover」） |
| Focus | 鍵盤或滑鼠移入取得焦點 | `:focus-visible` 顯示 `--pd-color-border-strong` 的 outline，偏移 `--pd-space-1`，與靜止邊框產生可見的**幾何差異**（外圈 ring + offset），而非同色覆蓋 |
| Disabled | 原生 `disabled` 屬性 | 文字改為 `--pd-color-text-disabled`、`cursor: not-allowed`；邊框維持 `--pd-color-input-border` 以保留可辨識邊界，原生 input 不會取得焦點或接受輸入 |
| Error | 加上 `.pd-input--error`（或父層 `.pd-field--error`） | 邊框改為 `--pd-color-danger`；**不得只靠邊框變色**，必須同時提供 `.pd-field__message` 文字說明與 `.pd-field__icon` 圖示（A-M5） |

保留原生 input 語意：Tab 進入／離開欄位，方向鍵與一般輸入行為由瀏覽器原生處理。不要以 `role`、`tabindex` 或 JavaScript 重建原生鍵盤行為。

## 可及性與動效

- **A-M1（placeholder／disabled 文字）**：`--pd-color-text-placeholder` 與 `--pd-color-text-disabled` 對 `bg`／`surface`／`surface-raised`／`surface-overlay` 四層皆已驗證 ≥4.5:1，見 `accessibility-contract.md` 第二節。
- **靜止邊界只用 `pd-color-input-border`**：不得改用已收窄為純裝飾性 card edge 的 `pd-color-border-default`。
- **Focus indicator（A-M2 + 幾何差異）**：`pd-color-input-border` 與 `pd-color-border-strong` 目前解析為同一色（`#7A7A7A`），因此 `:focus-visible` 不是把同色邊框「重新套用一次」，而是額外疊加一圈偏移 `--pd-space-1` 的 outline，讓 idle（單一 1px 邊框）與 focus（邊框 + 外擴 ring）在幾何上明顯不同。該 outline 對四層既有表面的 A-M2 對比分別為 4.29:1、3.97:1、3.62:1、3.16:1（與 Button 使用同一驗證結果，見 `accessibility-contract.md` 第三、四節）。已以實際 render（headless Chromium，鍵盤 Tab 觸發 `:focus-visible`）截圖比對 idle 與 focus 兩態，外擴 ring 清晰可辨。
- **為什麼 hover 用 `surface-raised` 而不是 `surface-hover`**：規格 2.1 定義的第五層 `pd-color-surface-hover`（`#323232`）未納入 `accessibility-contract.md` 第三節的 A-M2 稽核範圍，`input-border`／`border-strong` 對它僅 2.99:1、未達 3:1 門檻（見 `NEXT_ACTION.md` 記錄的非阻塞審查遺留）。為避免讓 Input 的邊界在 hover 時實際跌破 A-M2，本元件改用已驗證通過（3.62:1）的 `pd-color-surface-raised` 作為 hover 填色。
- **A-M5（色彩不可為唯一資訊傳達手段）**：Error state 除了邊框變色，`.pd-field__message` 一律搭配文字說明；範例額外附加 `.pd-field__icon`（⚠，`aria-hidden="true"`）。消費端應搭配 `aria-invalid="true"` 與 `aria-describedby` 指向訊息 id，讓輔助科技也能取得同樣的錯誤語意。
- **Reduced motion**：一般模式只轉場 `background-color` 與 `border-color`，使用 `--pd-duration-fast` 與 `--pd-easing-default`；`prefers-reduced-motion: reduce` 時移除 transition，不保留漸變。
