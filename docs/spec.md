# Palladio Design Language & System

> **命名由來：** Andrea Palladio（1508–1580），文藝復興建築師。將建築設計提煉成可複用的比例系統與規則，被全世界採用，但每棟建築長得都不一樣。對應本專案核心定位：提供共同規則，不強迫所有產品長一樣。

---

## 一、設計語言

### 1.1 核心個性

Palladio 的視覺世界是**外硬內軟**的。

靜止時，它是一個工具——深碳灰的表面、精準的線條、幾何感的留白。沒有多餘的裝飾，每個元素的存在都有理由。它讓人感覺可靠、收斂、有紀律。

動起來，它有生命感。轉場是流體的，不是機械的。元素的進出像在呼吸，不是在執行命令。這個張力——靜態的俐落與動態的有機感——是 Palladio 最重要的視覺識別。

### 1.2 視覺原則

**P1 — 克制的圓潤**

圓形、圓角、膠囊形狀是 Palladio 語彙的一部分，但不是預設。它們用來標記「這是可互動的」「這是柔化焦點的地方」。大面積的容器傾向直角或小圓角；按鈕、標籤、頭像等小型互動元件才是圓潤語彙的主場。

> 濫用圓角是一種視覺噪音。每一個圓角都應該能說出「我為什麼圓」。

**P2 — 線條是第一公民**

分隔區塊的第一直覺是線條與間距，而不是卡片。線條在深碳灰的背景上可以非常細膩——1px 的 subtle divider 已足夠建立層次，不需要 shadow 和 border 疊加。Surface 的提升（elevation）應保守使用。

**P3 — 深碳灰的層次**

Palladio 的暗色系不是「黑色加一點灰」，而是一組有意義的表面層級。每一層之間的色差是被計算過的——足以讓人感知到層次，但不會因為對比過強而產生碎片感。整體氛圍是沉穩、統一的深色空間。

**P4 — 流體有機的動效**

Palladio 的動效迴避兩個極端：線性（機械、沒有生命感）和彈跳（活潑但不專業）。目標是自然的加速與減速——物理世界裡物體的運動方式。進場比退場稍慢，讓內容有「落定」的感覺。

**P5 — 開放的強調色插槽**

Palladio 不定義強調色。每個產品或網站根據自身品牌明確填入所有 `pd-color-accent-*` 插槽；系統不推導 hover、active 或 disabled 色值，但會驗證各狀態在其指定前景／背景配對中的對比是否符合第八章。系統不規定色相。

### 1.3 不是 Palladio 的東西

- 不是一套「只要套用就有設計感」的 UI kit
- 不是鼓勵所有產品長一樣的視覺模板
- 不是追求極簡到失去個性的設計系統
- 不涵蓋非互動式媒體（影片、印刷品）

---

## 二、色彩

### 2.1 深碳灰表面層級

Palladio 的表面系統由五層構成，從最深的背景往上疊加。每層之間的色差約 6–8 的明度步進，確保層次可感知但不碎裂。

| Token | 角色 | 參考值 |
|-------|------|--------|
| `pd-color-bg` | 頁面最底層背景 | `#141414` |
| `pd-color-surface` | 主要內容表面（sidebar、panel） | `#1C1C1C` |
| `pd-color-surface-raised` | 提升一層的表面（card、dropdown） | `#242424` |
| `pd-color-surface-overlay` | 最高層（modal、tooltip、popover） | `#2E2E2E` |
| `pd-color-surface-hover` | 互動 hover 狀態的表面變化 | `#323232` |

### 2.2 線條與分隔

| Token | 角色 | 參考值 |
|-------|------|--------|
| `pd-color-border-subtle` | 最輕量的分隔（幾乎與表面融合） | `#242424` |
| `pd-color-border-default` | 標準 border（input、card edge） | `#333333` |
| `pd-color-border-strong` | 強調邊框（focus ring 底色） | `#7A7A7A` |

### 2.3 文字層級

| Token | 角色 | 參考值 |
|-------|------|--------|
| `pd-color-text-primary` | 主要文字 | `#F0F0F0` |
| `pd-color-text-secondary` | 次要文字（meta、說明） | `#9A9A9A` |
| `pd-color-text-placeholder` | placeholder 文字 | `#9A9A9A` |
| `pd-color-text-disabled` | disabled 元件的文字 | `#969696` |
| `pd-color-text-inverse` | 深色背景上的反白文字（用於強調色按鈕） | `#141414` |

### 2.4 語意色彩

語意色彩用於系統狀態，非品牌色。暗色系上的語意色需確保 contrast ratio ≥ 4.5:1。

| Token | 語意 | 參考色相 |
|-------|------|----------|
| `pd-color-success` | 成功、完成 | 綠色系（desaturated） |
| `pd-color-warning` | 警告、需注意 | 琥珀色系 |
| `pd-color-danger` | 錯誤、危險操作 | 紅色系（desaturated） |
| `pd-color-info` | 資訊、提示 | 藍色系（desaturated） |

> 語意色刻意去飽和（desaturated），避免在深碳灰背景上過於刺眼。

### 2.5 強調色插槽（各產品自定義）

```
pd-color-accent           # 主強調色
pd-color-accent-hover     # hover 狀態
pd-color-accent-active    # active 狀態
pd-color-accent-disabled  # disabled 狀態
pd-color-accent-subtle    # 低飽和背景（badge、tag 的底色）
pd-color-accent-text      # 強調色上的文字（需確保對比度）
```

產品必須為全部插槽提供值；Palladio 不提供 fallback 或跨消費端的混色公式。每個產品須在 token 文件列出實際使用的前景／背景配對，並驗證 `pd-color-accent-text` 對其對應的 `accent`、`accent-hover`、`accent-active` 與 `accent-disabled` 背景符合 A-M1；其他文字與 UI 元件配對依 A-M1 或 A-M2 驗證。

---

## 三、字體

### 3.1 字體選擇

| 用途 | 字體 | 理由 |
|------|------|------|
| 主字體（UI、內容） | **Noto Sans** | 個人偏好；多語言覆蓋完整；人文無襯線風格與流體動效方向一致 |
| 等寬（code、data） | **Noto Sans Mono** | 與主字體同族，視覺一致性高 |

### 3.2 字體比例

| Token | Size | Weight | Line Height | 用途 |
|-------|------|--------|-------------|------|
| `pd-text-display` | 32px | 600 | 1.2 | 頁面大標題 |
| `pd-text-heading-lg` | 24px | 600 | 1.3 | 段落主標題 |
| `pd-text-heading-md` | 18px | 600 | 1.35 | 段落次標題 |
| `pd-text-heading-sm` | 14px | 600 | 1.4 | 小標題、sidebar 分組標題 |
| `pd-text-body-lg` | 16px | 400 | 1.6 | 主要內文 |
| `pd-text-body-md` | 14px | 400 | 1.6 | 標準 UI 文字 |
| `pd-text-body-sm` | 12px | 400 | 1.5 | 次要資訊、meta |
| `pd-text-label-md` | 14px | 500 | 1.0 | 按鈕、tab 標籤 |
| `pd-text-label-sm` | 12px | 500 | 1.0 | 小型標籤、badge |
| `pd-text-mono` | 13px | 400 | 1.6 | 程式碼、資料欄位 |

### 3.3 字體規則

- Letter-spacing：標題使用 `-0.01em` 到 `-0.02em`（輕微收緊），body 維持 `0`
- 不使用 font-weight 100–300（在深色背景上過細，難以閱讀）
- 最小可用字體尺寸：`10px`（僅限極端場景，例如 chart axis label）

---

## 四、形狀

### 4.1 圓角比例

| Token | 值 | 適用場景 |
|-------|-----|----------|
| `pd-radius-none` | `0px` | 全出血元素、刻意強調硬邊的場景 |
| `pd-radius-sm` | `4px` | 輕微圓角（input、大型 card） |
| `pd-radius-md` | `8px` | 中型元件（dropdown panel、tooltip） |
| `pd-radius-lg` | `12px` | 大型容器（modal、side panel） |
| `pd-radius-xl` | `16px` | 刻意圓潤的大型容器（保守使用） |
| `pd-radius-full` | `9999px` | 膠囊形狀（badge、tag、pill button）、圓形頭像 |

### 4.2 圓角使用原則（`[SHOULD]`）

- 大面積容器（panel、sidebar、modal）傾向 `sm` 或 `md`
- 按鈕預設 `md`；pill 變體使用 `full`
- `xl` 和 `full` 是點綴，不是預設
- 同一層級的元件保持圓角一致性——混用多個不同圓角值會產生視覺噪音

---

## 五、動效

### 5.1 動效個性

Palladio 的動效是流體有機的。技術上的體現是使用非對稱的 easing curve：進場比退場稍慢（有「落定」感），加速與減速都遵循物理直覺。避免彈跳（spring bounce），避免線性。

### 5.2 Duration Scale

| Token | 值 | 用途 |
|-------|-----|------|
| `pd-duration-instant` | `0ms` | `prefers-reduced-motion` fallback |
| `pd-duration-fast` | `120ms` | Micro-interaction（hover 顏色變化、checkbox toggle） |
| `pd-duration-normal` | `220ms` | 狀態轉場（panel expand、fade in/out） |
| `pd-duration-slow` | `380ms` | 頁面層級轉場、signature animation |

### 5.3 Easing Curves

| Token | 值 | 用途 |
|-------|-----|------|
| `pd-easing-default` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | 通用（自然感） |
| `pd-easing-enter` | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` | 元素進場（慢進快出） |
| `pd-easing-exit` | `cubic-bezier(0.4, 0.0, 1.0, 1.0)` | 元素退場（快進慢出） |
| `pd-easing-expressive` | `cubic-bezier(0.34, 1.10, 0.64, 1.0)` | Signature animation（輕微超出再回落，有機感） |

> `pd-easing-expressive` 是 Palladio 動效個性的核心。它產生輕微的過衝（overshoot），類似彈性但不是彈跳——是有機生命感的來源。僅用於 `pd-duration-normal` 以上的動畫，`fast` 等級不適用。

### 5.4 Reduced Motion（`[MUST]`）

當使用者啟用 `prefers-reduced-motion: reduce`：

- 所有 duration 替換為 `pd-duration-instant`（`0ms`）
- 所有 transform 類動畫移除
- 必要的 opacity 狀態可保留，但必須瞬時切換，不保留 transition

---

## 六、間距與密度

### 6.1 基礎單位

Palladio 使用 **4px 基礎單位**。所有間距均為 4 的倍數。

| Token | 值 | |
|-------|-----|--|
| `pd-space-1` | `4px` | |
| `pd-space-2` | `8px` | |
| `pd-space-3` | `12px` | |
| `pd-space-4` | `16px` | |
| `pd-space-5` | `20px` | |
| `pd-space-6` | `24px` | |
| `pd-space-8` | `32px` | |
| `pd-space-10` | `40px` | |
| `pd-space-12` | `48px` | |
| `pd-space-16` | `64px` | |

### 6.2 Density Preset

| | Compact | Default | Spacious |
|--|---------|---------|----------|
| **適用場景** | 資料密集工具、power user 介面 | 一般桌面應用 | 觸控友善、呼吸感版型 |
| **Base spacing unit** | 4px | 4px | 4px |
| **Component padding（v/h）** | 4px / 8px | 8px / 12px | 12px / 20px |
| **Min interactive size** | 32px | 36px | 48px |
| **Body font size** | 13px | 14px | 15px |

---

## 七、分組手段優先順序

當需要將 UI 元素視覺分組時，依以下順序選擇手段（`[SHOULD]`）：

1. **Spacing（留白）** — 首選
2. **Typography hierarchy** — 標題與內文的層級差異
3. **Divider（線條）** — `pd-color-border-subtle` 的 1px 線
4. **Surface elevation** — 使用不同表面層級（`surface` vs `surface-raised`）
5. **Card / 明確邊框** — 最後手段，用於需要獨立互動邊界的場景

---

## 八、可及性規則

### `[MUST]` 硬規則

| 規則 | 標準 |
|------|------|
| A-M1 | 一般文字（含 placeholder、disabled 文字）contrast ratio ≥ 4.5:1 |
| A-M2 | 大字（≥24px regular / ≥18.5px bold）及 UI 元件 contrast ratio ≥ 3:1 |
| A-M3 | 所有互動元件必須有可見的 focus indicator（不得僅依賴 outline: none 後無替代方案） |
| A-M4 | `prefers-reduced-motion` 觸發時，所有非必要動畫停用 |
| A-M5 | 色彩不可作為唯一的資訊傳達手段 |
| A-M6 | 互動元素最小尺寸依 density preset 對應值 |

---

## 九、Token 架構與系統基礎建設

> 本章為技術基礎建設。設計語言（第一至八章）是 source of truth，本章是承載設計語言的容器。

### 9.1 三層 Token 架構

```
Layer 0 — Primitive
  原始值，不直接用於 UI
  例：blue-600, gray-200, 14px, 220ms

Layer 1 — Semantic
  描述用途的語意映射
  例：pd-color-text-primary, pd-duration-normal

Layer 2 — Component（可選）
  元件級 override，各產品可選擇使用
  例：pd-button-bg-default, pd-card-border-color
```

### 9.2 Token 命名空間

```
--pd-color-{role}         例：--pd-color-text-primary
--pd-text-{role}          例：--pd-text-body-md
--pd-space-{n}            例：--pd-space-4
--pd-radius-{size}        例：--pd-radius-md
--pd-duration-{speed}     例：--pd-duration-normal
--pd-easing-{type}        例：--pd-easing-expressive
```

Prefix `pd` = Palladio，避免與各產品自身的 CSS 變數衝突。

### 9.3 Token Pipeline

| 項目 | 選擇 |
|------|------|
| Token 格式 | JSON（Design Tokens Community Group 格式相容） |
| Pipeline 工具 | Style Dictionary |
| CSS 產出 | CSS custom properties（`:root[data-theme]` / `[data-density]`） |
| TS 產出 | TypeScript const object（tree-shakable，供 React 消費） |
| JSON 產出 | Raw JSON（供 Go / Wails 直接讀取） |
| Agent Reference 產出 | `agent-reference.md`（Token 總覽 + 使用規則，AI 代理 context 用） |

### 9.4 Agent Reference（核心交付物）

`agent-reference.md` 是 Palladio pipeline 的必要產出，不是可選附加。

**角色：** 當 AI 代理（Claude Code、Codex）收到概念圖 + 「用 Palladio，compact density」的指令時，`agent-reference.md` 提供可直接查閱的 token 總覽與使用規則，讓 agent 的搜索空間從「無限色值」縮小到「Palladio 定義的有限選項」。它是必要產出，但 AI 的單次生成表現僅作為設計語言的質性訊號，不是完成 gate。

**格式：** Markdown table + 使用規則摘要 + 禁止事項，與 maze-coder skill 結構對齊。

### 9.5 檔案結構

```
palladio/
├── tokens/
│   ├── primitive/          # Layer 0
│   ├── semantic/           # Layer 1
│   │   └── density/        # Compact / Default / Spacious
│   └── component/          # Layer 2（可選）
├── themes/
│   └── dark.json           # 暗色主題（首要）
├── pipeline/
│   ├── config.js           # Style Dictionary 設定
│   └── transforms/
├── dist/
│   ├── css/
│   ├── ts/
│   ├── json/
│   └── agent-reference.md  # 核心交付物
└── docs/
    ├── design-language/    # 第一至八章的完整說明
    ├── components/         # 元件行為規範
    └── accessibility/
```

---

## 十、元件規劃

### 10.1 第一批元件（Foundation 完成後）

優先順序依「能同時驗證最多 Foundation 決策」排序：

| 順序 | 元件 | 驗證項目 |
|------|------|----------|
| 1 | **Button** | accent 插槽、radius、density、hover/active/disabled state、focus ring |
| 2 | **Input** | border、surface、placeholder text、focus state、error state |
| 3 | **Divider** | border token、spacing |
| 4 | **Badge / Tag** | `pd-radius-full`、accent subtle、label text |
| 5 | **Card** | surface-raised、border-subtle、radius、分組手段原則 |
| 6 | **Navigation（sidebar）** | surface、density、active state |

### 10.2 元件驗收標準（每個元件）

- [ ] 在 Compact / Default / Spacious 三種密度下正常呈現，結構不變
- [ ] Hover、active、focus、disabled 四種互動狀態完整定義
- [ ] Keyboard navigation 行為符合規範
- [ ] Focus indicator 可見且符合 A-M2 對比標準
- [ ] `prefers-reduced-motion` 下動畫正確降級
- [ ] Token 引用只使用 Semantic 層（不直接使用 Primitive 值）

---

## 十一、壓力測試

Foundation 完成後，以以下三種產品型態的概念圖進行壓力測試，驗證 token 覆蓋率是否足夠：

| 型態 | 重點驗證 |
|------|----------|
| **資料密集桌面工具**（如 kanban、dashboard） | Compact density 可讀性、線條分組、keyboard nav |
| **內容創作型**（如小說管理、寫作工具） | Long-form typography、sidebar + panel 配合、多密度混用 |
| **專案官網 / Landing page** | Default 至 Spacious density、強調色插槽在網頁情境的表現 |

驗收標準：檢視三種概念圖中的每項 UI 決策，皆可歸類為既有 Semantic token、明確允許的產品插槽，或已確認的系統缺漏；不得存在未分類項目。概念圖或單次 AI 生成結果只作為檢視素材，不作為唯一通過條件。

---

## 十二、風險與限制

| 風險 | 等級 | 緩解策略 |
|------|------|----------|
| Foundation 過度設計（在無產品消費前堆砌太多 token） | 中 | Foundation 先做色彩、字體、間距、動效的 Semantic 層；Component token 等實際元件開發再補 |
| Accent 插槽對比度失控（各產品填入低對比色） | 中 | 產品明確提供全部 accent 狀態，並在 `agent-reference.md` 列出實際前景／背景配對；依 A-M1／A-M2 驗證，pipeline 可加自動驗證 |
| Light theme 補齊時大量調整 | 低 | Semantic token 命名不綁明暗（`surface.default` 而非 `surface.dark`），語意層抽象正確可降低重構幅度 |
| Token pipeline 維護成本 | 低 | Style Dictionary 設定完成後為靜態流程，僅新增 token 時觸發 |

---

## 十三、驗收標準

### Foundation 完成標準

- [ ] Primitive token 完整定義（色彩、字體、間距、圓角、動效）
- [ ] Semantic token 映射完成（暗色主題）
- [ ] 三種 Density preset 定義完成
- [ ] Token pipeline 產出 CSS / TS / JSON / `agent-reference.md` 四種格式
- [ ] 所有 `[MUST]` accessibility 規則文件化

### 設計語言完成標準

- [ ] 第十一章三種概念圖的每項 UI 決策皆可歸類為既有 Semantic token、允許的產品插槽或已確認缺漏
- [ ] 壓力測試三種產品型態完成（第十一章）
- [ ] Accent 插槽在至少兩個產品的實際色彩下驗證行為正確
