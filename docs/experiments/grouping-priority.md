# 分組手段優先順序

- 狀態：Hypothesis（實際已被 Divider、Card 元件文件引用並依此排序實作，屬於「有實作但無視覺驗收證據」的情況，見結論）
- 舊規格出處：`docs/spec.md` 舊 §7
- 假設：當需要將 UI 元素視覺分組時，依以下順序選擇手段：
  1. **Spacing（留白）** — 首選
  2. **Typography hierarchy** — 標題與內文的層級差異
  3. **Divider（線條）** — `pd-color-border-subtle` 的 1px 線
  4. **Surface elevation** — 使用不同表面層級（`surface` vs `surface-raised`）
  5. **Card / 明確邊框** — 最後手段，用於需要獨立互動邊界的場景
- 輸入：原規格第七章全文；`palladio/components/divider/README.md`、`palladio/components/card/README.md` 皆引用此順序作為各自元件定位的理由。
- 狀態矩陣：尚未在同一個實際版面裡並列比較「照這個順序選擇」與「其他順序」的視覺效果。
- 壓力測試／情境：Divider、Card 元件本身已依此順序實作並通過各自的元件驗收，但這只證明「這個順序在技術上可被實作出兩個一致的元件」，不證明「這個優先順序本身是使用者認可的正確設計判斷」。
- 證據：Divider／Card 原始碼與測試存在（E3/E4）；沒有記錄顯示這個優先順序本身經過候選方案比較或使用者裁決——它是規格撰寫當下直接寫下的判斷。
- 使用者裁決：尚未裁決。
- 結論：維持 Hypothesis。這是「有實作存在」跟「已被驗證是正確設計判斷」被混為一談的一個具體例子（見 `SPEC_MIGRATION_PLAN.md` SR-103）——Divider／Card 的實作不需要因此重做，但這個優先順序作為未來新元件（例如看板欄位容器 Issue #60）的判斷依據前，應該先有候選方案比較，而不是直接沿用。
