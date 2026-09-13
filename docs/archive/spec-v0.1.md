# Archive — docs/spec.md v0.1 已取代／背景內容

> 本文件保留 `docs/spec.md` v0.1（本次遷移前版本，見 `SPEC_MIGRATION_PLAN.md` 記錄的 source revision）裡被分類為「Disproved / superseded」或「Background narrative」的原文，供歷史稽核使用。**這裡的內容不是有效規則**，不得被引用為現行契約或設計判斷依據。

## 1.3 「不是 Palladio 的東西」（Background narrative）

> 原規格 §1.3。無可執行或驗收標準，保留作範圍溝通參考。

- 不是一套「只要套用就有設計感」的 UI kit
- 不是鼓勵所有產品長一樣的視覺模板
- 不是追求極簡到失去個性的設計系統
- 不涵蓋非互動式媒體（影片、印刷品）

## 9.5 檔案結構示意圖（Background narrative，與現況不符）

> 原規格 §9.5。這張示意圖描述的是理想化的完整目錄結構，跟目前 repo 實際的 `palladio/docs/{accessibility,components,design-language}` 稀疏結構不符，不得當成實作要求或現況描述。

```
palladio/
├── tokens/
│   ├── primitive/          # Layer 0
│   ├── semantic/           # Layer 1
│   │   └── density/        # Compact / Default / Spacious
│   └── component/          # Layer 2（可選，見 docs/experiments/architecture-component-layer.md）
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

## 10.1 第一批元件優先順序（Background narrative）

> 原規格 §10.1。六個目錄與驗證器確實存在（實作證據），但這不代表視覺品質已被驗收——見 Issue #84、#85。未來新元件的選擇不應直接沿用這張表的排序邏輯，應從具體實驗／消費端需求出發。

優先順序依「能同時驗證最多 Foundation 決策」排序：

| 順序 | 元件 | 驗證項目 |
|------|------|----------|
| 1 | **Button** | accent 插槽、radius、density、hover/active/disabled state、focus ring |
| 2 | **Input** | border、surface、placeholder text、focus state、error state |
| 3 | **Divider** | border token、spacing |
| 4 | **Badge / Tag** | `pd-radius-full`、accent subtle、label text |
| 5 | **Card** | surface-raised、border-subtle、radius、分組手段原則 |
| 6 | **Navigation（sidebar）** | surface、density、active state |

## 十一、驗證策略（Disproved / superseded）

> 原規格 §11。查核結果（`SPEC_ADVERSARIAL_REVIEW-2026-09-13.md`）：`main` 上唯一可能代表「真實產品接入」的 `site/`（PR #47／#48）手動複製色值、未實際消費 Palladio token；真正會消費 token 的文件站建置只存在於未合併的 PR #70。這代表「生產環境接入即為驗證」這個策略截至遷移當下**從未被實踐**。已被取代為：概念原型 → 實驗／壓力測試 → 消費端驗證 → 使用者裁決 → 規格升格，見 `docs/experiments/README.md`。消費端驗證未來仍可能作為升格的其中一種證據，但不再是唯一或優先策略。

> 原文保留：「Palladio 的驗證以生產環境為主。每當有新產品或網頁接入 Palladio，即為一次實際驗證。發現 token 覆蓋不足或設計決策需要調整時，直接更新 Palladio 並同步至接入該系統的產品。Accent 插槽的對比度驗證於各產品定義強調色時進行。」

## 十二、風險與限制（Background narrative）

> 原規格 §12。部分主張已被 E2（`SPEC_ADVERSARIAL_REVIEW-2026-09-13.md`）削弱或反證（例如「生產環境驗證」相關描述），保留作背景脈絡，不再是有效風險登記表。

| 風險 | 等級 | 緩解策略 |
|------|------|----------|
| Foundation 過度設計（在無產品消費前堆砌太多 token） | 中 | Foundation 先做色彩、字體、間距、動效的 Semantic 層；Component token 等實際元件開發再補 |
| Accent 插槽對比度失控（各產品填入低對比色） | 中 | 產品明確提供全部 accent 狀態，並在 `agent-reference.md` 列出實際前景／背景配對；依 A-M1／A-M2 驗證，pipeline 可加自動驗證 |
| Light theme 補齊時大量調整 | 低 | Semantic token 命名不綁明暗（`surface.default` 而非 `surface.dark`），語意層抽象正確可降低重構幅度 |
| Token pipeline 維護成本 | 低 | Style Dictionary 設定完成後為靜態流程，僅新增 token 時觸發 |

## 十三、驗收標準（Disproved / superseded）

> 原規格 §13。兩份完成度清單把「元件目錄與 token 存在」跟「設計語言已被驗收」混為一談（見 SR-103）。已被取代為：每條規則依 `docs/guardrails.md`／`docs/experiments/README.md` 定義的證據類型逐條升格，不再有一次性的「Foundation 完成」或「設計語言完成」宣稱。

### Foundation 完成標準（原文）

- [ ] Primitive token 完整定義（色彩、字體、間距、圓角、動效）
- [ ] Semantic token 映射完成（暗色主題）
- [ ] 三種 Density preset 定義完成
- [ ] Token pipeline 產出 CSS / TS / JSON / `agent-reference.md` 四種格式
- [ ] 所有 `[MUST]` accessibility 規則文件化

### 設計語言完成標準（原文）

- [ ] 第一至八章設計語言完整，且與第九章 pipeline 產出一致
- [ ] 至少一個真實產品或網頁已接入 Palladio，並依第十一章完成一輪回饋更新
- [ ] Accent 插槽對比度驗證已於某個接入產品定義強調色時實際執行（見可及性契約第九節）
