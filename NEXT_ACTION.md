# Palladio Design Language & System — 下一步行動

> 僅保留當前有效前線；明確 closeout 時整體重建，不追加歷史。

## 下一個 Session 目標

Foundation（#1 及其全部子 Issue）已完成，包含 #10 產出的 `palladio/dist/agent-reference.md`。下一步是開始第一批元件：[#2 Divider](https://github.com/bext1998/palladio-design-language-system/issues/2)、[#6 Navigation](https://github.com/bext1998/palladio-design-language-system/issues/6)、[#7 Card](https://github.com/bext1998/palladio-design-language-system/issues/7)、[#11 Button](https://github.com/bext1998/palladio-design-language-system/issues/11)、[#12 Badge/Tag](https://github.com/bext1998/palladio-design-language-system/issues/12)、[#13 Input](https://github.com/bext1998/palladio-design-language-system/issues/13)（彼此互不相依，可平行推進）。

## 行動（最多 3 項）

1. 確認 [#1 Foundation 總覽](https://github.com/bext1998/palladio-design-language-system/issues/1) 的子 Issue 皆已關閉後，關閉 #1。
2. 挑一個第一批元件 Issue 開始實作；規格建議順序是 Button（#11）→ Input（#13）→ Divider（#2）→ Badge/Tag（#12）→ Card（#7）→ Navigation（#6）（依「能同時驗證最多 Foundation 決策」排序，規格 10.1 節）。
3. 每個元件的 focus indicator 驗收，需依 `palladio/docs/accessibility/accessibility-contract.md` 第四節契約自行驗證對比達 A-M2（不得預設沿用 `pd-color-border-strong`，該 token 已列為已確認缺漏，追蹤於 [#21](https://github.com/bext1998/palladio-design-language-system/issues/21)）。

## 阻塞與待決策

- 無。雙產品 accent 驗證（#15）須在後續取得兩個產品的實際色彩資料。
- 已確認缺漏，追蹤於 [#21](https://github.com/bext1998/palladio-design-language-system/issues/21)（非阻塞，但每個元件都需個別處理直到 #21 完成）：`pd-color-border-strong` 作為 focus ring 底色對現有表面對比未達 A-M2 3:1，詳見 `palladio/docs/accessibility/accessibility-contract.md` 第三、四、十一節。

## 權威連結

- [規格第 10 章：元件規劃](docs/spec.md)
- [Foundation parent #1](https://github.com/bext1998/palladio-design-language-system/issues/1)
- [Agent Reference](palladio/dist/agent-reference.md)（#10 交付物，AI 代理消費端的 token 總覽與使用規則）
- [可及性契約文件](palladio/docs/accessibility/accessibility-contract.md)（#3 交付物）
- [Focus ring 對比缺漏 #21](https://github.com/bext1998/palladio-design-language-system/issues/21)
