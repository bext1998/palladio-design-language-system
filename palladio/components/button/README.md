# Button

`Button` 是原生 `<button>` 的框架無關樣式。根元素須先套用 Foundation 的 `data-theme="dark"`，載入 `palladio/dist/css/palladio.css` 後再載入 `button.css`。產品必須在 Button 所在作用域提供全部六個 accent 插槽；元件不提供 fallback，也不推導 hover、active 或 disabled 色值。

```html
<button class="pd-button" type="button">儲存</button>
<button class="pd-button pd-button--pill" type="button">發佈</button>
<button class="pd-button" type="button" disabled>無法儲存</button>
```

## 變體與 density

- 預設變體使用 `--pd-radius-md`；加入 `pd-button--pill` 後使用 `--pd-radius-full`。
- 元件結構固定為原生 `<button>`。padding 和 `min-block-size` 分別使用 `--pd-density-component-padding-*` 與 `--pd-density-component-min-interactive-size`。
- 將 `data-density="compact"` 或 `data-density="spacious"` 設在 Foundation CSS 套用的根元素；省略時為 Default。三種 density 的最小互動尺寸為 32、36、48px。

## 狀態與鍵盤

| 狀態 | 觸發方式 | 呈現 |
|---|---|---|
| Default | 可操作的初始狀態 | `--pd-color-accent` 背景與 `--pd-color-accent-text` 文字 |
| Hover | 支援 hover 的指標裝置 | `--pd-color-accent-hover` 背景 |
| Active | 按住滑鼠或觸控，或鍵盤啟動期間 | `--pd-color-accent-active` 背景 |
| Focus | 鍵盤移入 | `:focus-visible` 的 `--pd-color-border-strong` outline |
| Disabled | 原生 `disabled` 屬性 | `--pd-color-accent-disabled` 背景，且原生按鈕不會取得焦點或觸發操作 |

保留原生按鈕語意：Tab 進入可操作 Button，Enter 與 Space 觸發它。不要以 `role="button"`、`tabindex` 或 JavaScript 重建原生鍵盤行為。

## 可及性與動效

Focus ring 使用 `:focus-visible`，以 `--pd-color-border-strong` 描邊並用 `--pd-space-1` 與元件分離。該 token 對 `bg`、`surface`、`surface-raised`、`surface-overlay` 的 A-M2 對比分別為 4.29:1、3.97:1、3.62:1、3.16:1。產品仍須依 accent 插槽契約驗證 `accent-text` 對 `accent`、`accent-hover`、`accent-active`、`accent-disabled` 的 A-M1 對比皆至少 4.5:1。

一般模式只轉場背景色，使用 `--pd-duration-fast` 與 `--pd-easing-default`。`prefers-reduced-motion: reduce` 時移除 transition，不保留漸變或 transform 動畫。
