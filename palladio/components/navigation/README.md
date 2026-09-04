# Navigation (sidebar)

`Navigation` 是原生 `<nav>` + `<ul>`/`<a>` 清單的框架無關樣式，用於 sidebar 主導覽。根元素須先套用 Foundation 的 `data-theme="dark"`，載入 `palladio/dist/css/palladio.css` 後再載入 `navigation.css`。

```html
<nav class="pd-nav" aria-label="Main">
  <ul class="pd-nav__list">
    <li>
      <a class="pd-nav__link pd-nav__link--active" href="/dashboard" aria-current="page">Dashboard</a>
    </li>
    <li>
      <a class="pd-nav__link" href="/reports">Reports</a>
    </li>
    <li>
      <!-- 停用項目：不要用 disabled 屬性（<a> 沒有這個原生概念），
           移除 href 讓它自然離開 Tab 順序，並用 aria-disabled 傳達語意。 -->
      <a class="pd-nav__link" aria-disabled="true">Billing (coming soon)</a>
    </li>
  </ul>
</nav>
```

## 鍵盤 navigation

這是一份單純的連結清單，**不是** ARIA 的 menu／menubar／tablist 元件，因此不需要（也不應該）用 JavaScript 重建 Roving tabindex 或方向鍵導覽——原生 `<a>` 清單已經提供正確的鍵盤語意：`Tab`／`Shift+Tab` 在項目間移動，`Enter` 觸發連結。維持這個最小化語意，不要加 `role="menu"`、`tabindex` 管理或方向鍵攔截。

停用中的項目（如上例 `Billing`）**移除 `href`**，讓它自然無法被 Tab 聚焦、也無法被點擊；`aria-disabled="true"` 只負責告知輔助科技這是一個目前不可用的項目，不負責阻止互動——`href` 的有無才是真正的行為開關。

## Active state：三種非色彩線索

規格「不在範圍」明確排除「只用色彩標示目前頁面」，可及性契約第七節也把 Navigation 的 active state 列為 A-M5 checklist 項目，要求「除顏色外，需有第二種視覺線索（例如左側指示條、字重變化、背景色塊）」。`.pd-nav__link--active` 一次提供三種線索，前兩種完全不依賴任何未驗證的顏色：

1. **背景色塊**：`pd-color-surface-raised`（已驗證 A-M1，`text-primary` 對它 13.62:1）——即使在完全去色的畫面上，active 項目仍是唯一有背景填色的項目。
2. **字重變化**：`font-weight: 600`（比其餘項目繼承的一般字重明顯更粗）——純粹的形狀線索，跟色彩完全無關，單獨就足以滿足 A-M5「除色彩外的可辨識提示」。
3. **左側指示條**（額外的品牌強化，非必要但常見於 sidebar）：`border-inline-start` 改用產品提供的 `pd-color-accent`。**這個顏色的對比不由 Palladio 保證**——Palladio 不驗證 accent 插槽（規格 2.5、AGENTS.md）。若產品要依賴這條指示線本身的可讀性，請把它加進 `validateAccentPairs()` 呼叫的 `extraPairs`，例如：`{ name: 'nav-active-indicator', foreground: accent, background: surface, kind: 'ui' }`，自行驗證對 sidebar 實際背景（通常是 `pd-color-surface`）達到 A-M2（3:1）。**即使產品尚未驗證這條指示線，前兩項（背景色塊＋字重）已經足以獨立滿足 A-M5**，指示條是錦上添花，不是唯一防線。

`aria-current="page"` 應與 `.pd-nav__link--active` 同時使用，讓螢幕閱讀器也能得到「目前頁面」的語意，不只是視覺線索。

## 狀態總覽

| 狀態 | 觸發方式 | 呈現 |
|---|---|---|
| Idle | 非目前頁面、未互動 | `pd-color-text-secondary` 文字，透明左側邊條 |
| Hover | 支援 hover 的指標裝置，且非 active 項目 | 背景 `pd-color-surface-hover`、文字轉為 `pd-color-text-primary`（實測對比 11.25:1，遠高於 A-M1） |
| Active | `.pd-nav__link--active` | 見上一節三種線索；hover 不會稀釋 active 的視覺呈現 |
| Focus | 鍵盤或滑鼠移入取得焦點 | `:focus-visible` 顯示內縮（inset）的 `pd-color-border-strong` outline，並把背景／文字強制切回 `surface-raised`／`text-primary`——即使該項目同時處於 hover，也不會讓 focus ring 疊在未驗證的 `surface-hover` 背景上（`border-strong` 對 `surface-hover` 只有 2.99:1，未達 A-M2；`accessibility-contract.md` 已記錄這個非阻塞缺口，本元件直接迴避它，而非觸發它）。 |
| Disabled | 移除 `href`＋`aria-disabled="true"` | 文字改為 `pd-color-text-disabled`（A-M1）、`cursor: not-allowed`；因無 `href` 而自然無法被聚焦或觸發 |

## Focus indicator 的幾何選擇（inset outline）

Button／Input／Card／Badge 的 focus ring 都是「向外偏移」的 outline（`outline-offset` 為正值）。Navigation 改用**內縮**（`outline-offset: calc(-1 * var(--pd-space-1))`）：sidebar 的項目通常是彼此貼齊、佔滿容器寬度的清單，向外偏移的 ring 容易被相鄰項目或容器邊界裁切；內縮 ring 完全落在該項目自己的框內，不受版面裁切影響，同時仍然是「無 outline → 有 outline」的清楚幾何差異，滿足 A-M3。偏移量仍然是 `--pd-space-1` 的負值（透過 `calc()` 從既有 token 推導方向，不是新的硬編碼尺寸）。

## Density

`.pd-nav__link` 消費 `--pd-density-component-min-interactive-size` 與 `--pd-density-component-padding-*`，與 Button 相同的密度行為（32／36／48px 最小互動尺寸），滿足 A-M6；三種 density 下清單結構不變，只有尺寸跟著换。

## Reduced motion

`.pd-nav__link` 只轉場 `background-color`、`border-color`、`color`，使用 `--pd-duration-fast` 與 `--pd-easing-default`；`prefers-reduced-motion: reduce` 時移除 transition，不保留漸變。
