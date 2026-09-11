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
| Active | 滑鼠按下（`:active`） | 背景進一步切換為 `--pd-color-surface-overlay`，與 hover 有可見區隔，提供按下時的回饋（見下方「為什麼不用 surface-hover」） |
| Focus | 鍵盤或滑鼠移入取得焦點 | `:focus-visible` 顯示已驗證 accent 的 outline；未驗證時回退 `--pd-color-border-strong`，偏移 `--pd-space-1` |
| Disabled | 原生 `disabled` 屬性 | 文字改為 `--pd-color-text-disabled`、`cursor: not-allowed`；邊框維持 `--pd-color-input-border` 以保留可辨識邊界，原生 input 不會取得焦點或接受輸入 |
| Error | 加上 `.pd-input--error`（或父層 `.pd-field--error`） | 邊框改為 `--pd-color-danger`；**不得只靠邊框變色**，必須同時提供 `.pd-field__message` 文字說明與 `.pd-field__icon` 圖示（A-M5） |

保留原生 input 語意：Tab 進入／離開欄位，方向鍵與一般輸入行為由瀏覽器原生處理。不要以 `role`、`tabindex` 或 JavaScript 重建原生鍵盤行為。

## 可及性與動效

- **A-M1（placeholder）**：`--pd-color-text-placeholder` 維持 `#9A9A9A`，對四層皆已驗證 ≥4.5:1。`--pd-color-text-disabled` 限 inactive UI component，依 WCAG exemption 不走 A-M1 gate；原生 `disabled`、`cursor: not-allowed`、不可 focus／輸入與可識別邊界共同表達狀態。
- **靜止邊界只用 `pd-color-input-border`**：不得改用已收窄為純裝飾性 card edge 的 `pd-color-border-default`。
- **Focus indicator（A-M2 + 幾何差異）**：`pd-color-input-border` 與 fallback `border-strong` 同為 `#777777`，對四層表面 4.11／3.81／3.47／3.03:1。成功執行 `enableValidatedAccentFocusRing()` 後 outline 使用驗證過的 `pd-color-accent`；失敗或未呼叫時自動回退中性 ring。outline 仍用偏移 `--pd-space-1`，讓 idle 與 focus 保有幾何差異。
- **為什麼 hover／active 用 `surface-raised`／`surface-overlay` 而不是 `surface-hover`**：`input-border`／`border-strong` 對 `surface-hover` 只有 2.86:1，未達 A-M2。hover 使用 `surface-raised`（3.47:1），active 使用 `surface-overlay`（3.03:1），不引入未驗證配對。
- **A-M5（色彩不可為唯一資訊傳達手段）**：Error state 除了邊框變色，`.pd-field__message` 一律搭配文字說明；範例額外附加 `.pd-field__icon`（⚠，`aria-hidden="true"`）。消費端應搭配 `aria-invalid="true"` 與 `aria-describedby` 指向訊息 id，讓輔助科技也能取得同樣的錯誤語意。
- **Reduced motion**：一般模式只轉場 `background-color` 與 `border-color`，使用 `--pd-duration-fast` 與 `--pd-easing-default`；`prefers-reduced-motion: reduce` 時移除 transition，不保留漸變。
