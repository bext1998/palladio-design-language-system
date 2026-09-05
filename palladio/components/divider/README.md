# Divider

`Divider` 是原生 `<hr>` 的框架無關樣式，提供規格第七章「分組手段優先順序」中排序第三的線條分隔（第一是留白 spacing，第二是文字層級）。根元素須先套用 Foundation 的 `data-theme="dark"`，載入 `palladio/dist/css/palladio.css` 後再載入 `divider.css`。Divider 是**非互動**的視覺元素，不定義 hover、active、focus 或 disabled state。

```html
<p>第一段內容。</p>
<hr class="pd-divider">
<p>第二段內容。</p>

<div style="display: flex; align-items: stretch;">
  <span>左側</span>
  <hr class="pd-divider pd-divider--vertical" aria-orientation="vertical">
  <span>右側</span>
</div>
```

## 用途邊界

- Divider 只負責「線條分隔」；**不要**用它取代 card 或 elevation 來滿足需要獨立互動邊界的場景——那屬於分組手段第四、五順位（`surface elevation` 與 `card`），不在 Divider 的職責內。
- 需要視覺分組時，優先考慮 spacing 與 typography hierarchy；線條分隔只在前兩者不足以建立層次時使用（規格第七章）。
- **支援的相鄰表面**：Divider 保證在 `pd-color-bg` 與 `pd-color-surface` 上可辨識。放在 `pd-color-surface-raised`（`#242424`）容器內時，**水平與垂直兩種變體的線條都會完全消失**——`border-subtle` 的色值本身就是 `#242424`，與 `surface-raised` 完全相同，兩個方向都只剩下各自的留白間距（`margin-block` 或 `margin-inline`），沒有任何可見的線。留白本身不代表線條可見，不要誤以為只有垂直變體受影響。這是規格 2.2 `border-subtle`「幾乎與表面融合」定義的預期結果，不是 CSS 缺陷，也不受 A-M2 3:1 門檻約束（見下方「可及性」）。若需要在 `surface-raised` 容器（例如 Card 內文）中做視覺分隔，請優先改用留白或 typography hierarchy；仍需要一條可見邊界時，改用容器本身的 `pd-color-border-default`（Card 邊框契約），不要在 `surface-raised` 內插入 `.pd-divider`（任一方向）並期待線條可見。

## 變體與 density

- 預設是水平分隔（`.pd-divider`）：`inline-size: 100%`、`border-block-start` 1px 線、`margin-block: var(--pd-space-4)`。
- 加上 `pd-divider--vertical` 變成垂直分隔：`block-size: auto`（依父層 `align-self: stretch` 撐開）、`border-inline-start` 1px 線、`margin-inline: var(--pd-space-4)`。使用垂直變體時請在 `<hr>` 上加 `aria-orientation="vertical"`——`<hr>` 的隱含 role 是 `separator`，預設方向是水平，需要明確標示方向才對輔助科技正確。
- Divider 只引用 `pd-color-border-subtle`（規格 2.2：「最輕量的分隔（幾乎與表面融合）」）與 `pd-space-4`（規格 6.1：4px 基礎單位的倍數），兩者在三種 density 下皆為固定值（density preset 只影響元件 padding、最小互動尺寸與 body 字級，不影響 base spacing unit），因此 Divider 在 Compact / Default / Spacious 下呈現完全一致，不需要任何 `data-density` 條件樣式。
- `margin-block` / `margin-inline` 是預設值，消費端可依版面覆寫（例如放進已有 `gap` 的容器時，可將其重設為 `0` 避免雙重留白）。

## 可及性

- 若 Divider 純粹是裝飾性的視覺分隔（不代表內容有語意上的區段變化），可在 `<hr>` 加上 `role="none"`，避免螢幕閱讀器逐項瀏覽時多一次不必要的「分隔線」宣告；預設不加時沿用 `<hr>` 隱含的 `separator` role，對代表真實內容分段的情境是合適的。
- Divider 本身不是互動元件，不受 A-M3（focus indicator）與 A-M6（互動元素最小尺寸）約束；`pd-color-border-subtle` 依規格 2.2／`accessibility-contract.md` 第三節定義為非互動裝飾性分隔線，不受 A-M2 3:1 門檻約束。
