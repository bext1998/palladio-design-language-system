# Palladio Design Language & System

> **命名由來：** Andrea Palladio（1508–1580），文藝復興建築師。將建築設計提煉成可複用的比例系統與規則，被全世界採用，但每棟建築長得都不一樣。對應本專案核心定位：提供共同規則，不強迫所有產品長一樣。

---

> **本文件的角色（2026-09-14 起）：** `docs/spec.md` 只收錄**已升格、可實作、有實作與驗證證據**的跨消費端契約——主要是 token 值、API 命名與 pipeline 技術契約。尚待視覺／產品裁決的候選規則在 `docs/experiments/`；安全與可及性等不可突破的底線在 `docs/guardrails.md`；已被取代或純背景脈絡的舊內容在 `docs/archive/spec-v0.1.md`。三者的分類依據與升格條件見 `SPEC_MIGRATION_PLAN.md`。
>
> 這代表本文件**不是**一份预先寫死、宣稱完整定案的設計語言全文——過去的版本混淆了「已驗證的契約」與「尚待驗證的方向」，造成 Issue #84／#85／#88 這類「規則存在但視覺結果沒人真的看過、驗證策略從未被實踐」的落差。

---

## 一、可及性、動效與視覺原則的位置

- 可及性硬規則（A-M1–A-M6）、Reduced Motion 規則、元件升格的機器可驗底線與人眼裁決 gate：見 **`docs/guardrails.md`**。
- 核心個性、P1–P4 視覺原則（克制的圓潤、線條優先、深碳灰層次、流體有機動效）、圓角情境化原則、動效個性與 easing 使用限制、分組手段優先順序、Layer 2 元件級 token override：目前皆為**尚待驗證的候選規則**，見 **`docs/experiments/`**（分別在 `design-language-personality.md`、`shape-context-principles.md`、`motion-personality.md`、`grouping-priority.md`、`architecture-component-layer.md`）。
- 強調色插槽的開放承諾（「不強迫所有產品長一樣」）：契約本身（六個插槽、不提供 fallback）已升格，見下方 §2.5；產品自主權作為架構承諾是否可實現（Layer 2）仍是 Hypothesis，見上一點。

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

> 這五層的具體 token 值與 API 已被實作與 pipeline 驗證消費，維持相容；「這個層級劃分感知起來是否正確」屬於美學判斷，見 `docs/experiments/design-language-personality.md`（P3）。

### 2.2 線條與分隔

| Token | 角色 | 參考值 |
|-------|------|--------|
| `pd-color-border-subtle` | 最輕量的分隔（幾乎與表面融合） | `#242424` |
| `pd-color-border-default` | 標準裝飾性 border（card edge） | `#333333` |
| `pd-color-input-border` | Input 可識別邊界 | `#777777` |
| `pd-color-border-strong` | 互動元件的強調邊框與 focus ring fallback | `#777777` |
| `pd-color-focus-ring`（機制，非固定色值） | Focus indicator 的實際顏色。消費端呼叫 `enableValidatedAccentFocusRing()` 對實際 focus backdrop 驗證 accent 通過 A-M2 後才設定；未呼叫、未驗證或驗證失敗時，CSS 原生 fallback（`var(--pd-color-focus-ring, var(--pd-color-border-strong))`）自動退回 `border-strong`，確保 A-M3 不會因缺少此設定而失效 | 見 `palladio/pipeline/accent-contract.mjs`；不提供固定 hex 值，因為值本身就是「驗證通過的 accent 或 fallback」這個決策過程的結果 |

### 2.3 文字層級

| Token | 角色 | 參考值 |
|-------|------|--------|
| `pd-color-text-primary` | 主要文字 | `#F0F0F0` |
| `pd-color-text-secondary` | 次要文字（meta、說明） | `#9A9A9A` |
| `pd-color-text-placeholder` | placeholder 文字 | `#9A9A9A` |
| `pd-color-text-disabled` | disabled 元件的文字 | `#7A7A7A` |
| `pd-color-text-inverse` | 深色背景上的反白文字（用於強調色按鈕） | `#141414` |

### 2.4 語意色彩

語意色彩用於系統狀態，非品牌色。暗色系上的語意色需確保 contrast ratio ≥ 4.5:1（A-M1，見 `docs/guardrails.md`）。

| Token | 語意 | 參考色相 |
|-------|------|----------|
| `pd-color-success` | 成功、完成 | 綠色系 |
| `pd-color-warning` | 警告、需注意 | 琥珀色系 |
| `pd-color-danger` | 錯誤、危險操作 | 紅色系 |
| `pd-color-info` | 資訊、提示 | 藍色系 |

> 上表色相族群是已升格的 token 契約。「是否應該去飽和（desaturated）」這個美學選擇本身尚未經驗證，不得視為已定案的視覺要求，見 `docs/experiments/color-desaturation-rationale.md`；≥4.5:1 的對比要求本身是 guardrail，不受影響。

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

### 3.1 字體比例

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

> 字體家族選擇（Noto Sans／Noto Sans Mono）的理由尚未經驗證，見 `docs/experiments/typography-font-family.md`；上表尺寸比例本身已被 pipeline 產出並被元件消費，維持相容。

### 3.2 字體規則

- Letter-spacing：標題使用 `-0.01em` 到 `-0.02em`（輕微收緊），body 維持 `0`——此值已編碼於 token（`palladio/tokens/semantic/typography.json`），為已升格契約。

> 「不使用 font-weight 100–300」「最小可用字體尺寸 10px」這兩條沒有對應 token 或驗證器（純敘述性文字），尚待驗證，見 `docs/experiments/typography-font-family.md`。

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

> 上表是已升格的 token 數值契約，維持相容。「哪個元件該用哪個圓角」的情境判斷（含 Navigation 圓角空白這個已知失敗案例）尚待驗證，見 `docs/experiments/shape-context-principles.md`。

---

## 五、動效

### 5.1 Duration Scale

| Token | 值 | 用途 |
|-------|-----|------|
| `pd-duration-instant` | `0ms` | `prefers-reduced-motion` fallback |
| `pd-duration-fast` | `120ms` | Micro-interaction（hover 顏色變化、checkbox toggle） |
| `pd-duration-normal` | `220ms` | 狀態轉場（panel expand、fade in/out） |
| `pd-duration-slow` | `380ms` | 頁面層級轉場、signature animation |

### 5.2 Easing Curves

| Token | 值 | 用途 |
|-------|-----|------|
| `pd-easing-default` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | 通用（自然感） |
| `pd-easing-enter` | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` | 元素進場（慢進快出） |
| `pd-easing-exit` | `cubic-bezier(0.4, 0.0, 1.0, 1.0)` | 元素退場（快進慢出） |
| `pd-easing-expressive` | `cubic-bezier(0.34, 1.10, 0.64, 1.0)` | Signature animation（輕微超出再回落，有機感） |

> 上兩表是已升格的 token 數值契約，維持相容。動效個性的整體敘事與 `pd-easing-expressive` 的使用限制（僅限 `pd-duration-normal` 以上）尚待驗證，見 `docs/experiments/motion-personality.md`。Reduced motion 的降級規則是 guardrail，見 `docs/guardrails.md`。

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

## 七、Token 架構與系統基礎建設

### 7.1 Token 層級紀律

```
Layer 0 — Primitive
  原始值，不直接用於 UI
  例：blue-600, gray-200, 14px, 220ms

Layer 1 — Semantic
  描述用途的語意映射
  例：pd-color-text-primary, pd-duration-normal
```

Primitive 不得直接被 UI 元件消費；元件只引用 Semantic 層。

> 可選的「Layer 2 — Component」元件級 override 尚未被任何消費端實作或驗證，見 `docs/experiments/architecture-component-layer.md`，不得當成已存在的能力。

### 7.2 Token 命名空間

```
--pd-color-{role}         例：--pd-color-text-primary
--pd-text-{role}          例：--pd-text-body-md
--pd-space-{n}            例：--pd-space-4
--pd-radius-{size}        例：--pd-radius-md
--pd-duration-{speed}     例：--pd-duration-normal
--pd-easing-{type}        例：--pd-easing-expressive
```

Prefix `pd` = Palladio，避免與各產品自身的 CSS 變數衝突。

### 7.3 Token Pipeline

| 項目 | 選擇 |
|------|------|
| Token 格式 | JSON（Design Tokens Community Group 格式相容） |
| Pipeline 工具 | Style Dictionary |
| CSS 產出 | CSS custom properties（`:root` 含 Default density、`:root[data-theme="dark"]`、`:root[data-density="compact"\|"spacious"]`） |
| TS 產出 | TypeScript const object（tree-shakable，供 React 消費） |
| JSON 產出 | Raw JSON（供 Go / Wails 直接讀取） |
| Agent Reference 產出 | `agent-reference.md`（Token 總覽 + 使用規則，AI 代理 context 用） |

### 7.4 Agent Reference（核心交付物）

`agent-reference.md` 是 Palladio pipeline 的必要產出，不是可選附加。

**角色：** 當 AI 代理（Claude Code、Codex）收到概念圖 + 「用 Palladio，compact density」的指令時，`agent-reference.md` 提供可直接查閱的 token 總覽與使用規則，讓 agent 的搜索空間從「無限色值」縮小到「Palladio 定義的有限選項」。它是必要產出，但 AI 的單次生成表現僅作為設計語言的質性訊號，不是完成 gate。

**格式：** Markdown table + 使用規則摘要 + 禁止事項，與 maze-coder skill 結構對齊。

---

## 八、元件規劃與驗收流程

新元件不再依「規格先寫完整範圍，再逐一實作」的流程推進。流程改為：

1. 依 `docs/experiments/README.md` 的生命週期，先產出候選原型／概念圖並記錄假設。
2. 對照 `docs/guardrails.md` 的機器可驗底線與人眼裁決 gate 收集證據。
3. 使用者裁決後，才把對應規則寫入本文件（`docs/spec.md`）；被拒絕的假設標記 `Rejected` 並保留紀錄，不刪除。

舊有的第一批元件優先順序（歷史紀錄，非現行判準）與兩份一次性「完成度」清單已移入 `docs/archive/spec-v0.1.md`。改動 token 值或新增機制時的同步更新義務見 `docs/guardrails.md`「證據誠實與治理底線」。
