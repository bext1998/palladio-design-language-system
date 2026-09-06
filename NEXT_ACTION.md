# Palladio Design Language & System — 下一步行動

> 僅保留當前有效前線；明確 closeout 時整體重建，不追加歷史。

## 下一個 Session 目標

Foundation（#1 及全部子 Issue）、兩個可及性缺漏修正（#21、#24）與第一批元件（#2、#6、#7、#11、#12、#13）皆已完成關閉。壓力測試階段已啟動：Landing page（#4）檢視素材已完成，以 [PR #32](https://github.com/bext1998/palladio-design-language-system/pull/32) 提交（awaiting-merge，`Closes #4`）。剩餘前線：#8、#14 兩種型態的壓力測試，以及 #15 雙產品 accent 驗證。

## 行動（最多 3 項）

1. Review 並合併 [PR #32](https://github.com/bext1998/palladio-design-language-system/pull/32)（Landing page 壓力測試素材：原型 `palladio/docs/stress-tests/landing-page/index.html`、23 項 UI 決策分類表、accent 六插槽配對驗證全過 A-M1/A-M2）；合併後確認 #4 自動關閉。
2. 接續 [#8](https://github.com/bext1998/palladio-design-language-system/issues/8)（資料密集桌面工具）或 [#14](https://github.com/bext1998/palladio-design-language-system/issues/14)（內容創作型）壓力測試；素材結構沿用 `palladio/docs/stress-tests/landing-page/` 樣式（原型 + `decisions.md` 分類表 + `product.json` + `validate-accents.mjs`），放置於 `palladio/docs/stress-tests/` 下的新目錄。
3. [#15](https://github.com/bext1998/palladio-design-language-system/issues/15) 需兩個真實產品提供全部六個 accent 插槽實際色值後執行；驗證函式 `palladio/pipeline/validate-accessibility.mjs` 的 `validateAccentPairs()` 已可直接呼叫，流程見可及性契約第九節。

## 阻塞與待決策

- **#15 blocked**：需兩個產品的實際色彩資料（外部輸入），現有 PR #32 的 accent 色盤為檢視素材用虛構資料，不滿足 #15。
- **待決策：缺漏 C-1**——壓力測試登記「版面容器欄寬／欄數／格比／對齊策略無 token 規範」（`palladio/docs/stress-tests/landing-page/decisions.md`）；是否 token 化交由規格修訂流程決定，目前僅記錄、不實作。
- 無其他阻塞。

## 權威連結

- [PR #32（Landing page 壓力測試素材）](https://github.com/bext1998/palladio-design-language-system/pull/32)
- [壓力測試說明](palladio/docs/stress-tests/README.md)
- [Agent Reference](palladio/dist/agent-reference.md)（#10 交付物）
- [可及性契約](palladio/docs/accessibility/accessibility-contract.md)（第九節：accent 插槽對比驗證流程）
