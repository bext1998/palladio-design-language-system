# Palladio Design Language & System — 下一步行動

> 僅保留當前有效前線；明確 closeout 時整體重建，不追加歷史。

## 下一個 Session 目標

Foundation（#1 及其全部子 Issue）已完成，包含 #10 產出的 `palladio/dist/agent-reference.md`，以及 #21（`pd-color-border-strong` focus ring 對比）已於 PR [#23](https://github.com/bext1998/palladio-design-language-system/pull/23) 修正並關閉。下一步是開始第一批元件：[#2 Divider](https://github.com/bext1998/palladio-design-language-system/issues/2)、[#6 Navigation](https://github.com/bext1998/palladio-design-language-system/issues/6)、[#7 Card](https://github.com/bext1998/palladio-design-language-system/issues/7)、[#11 Button](https://github.com/bext1998/palladio-design-language-system/issues/11)、[#12 Badge/Tag](https://github.com/bext1998/palladio-design-language-system/issues/12)、[#13 Input](https://github.com/bext1998/palladio-design-language-system/issues/13)（彼此互不相依，可平行推進）。

## 行動（最多 3 項）

1. 確認 [#1 Foundation 總覽](https://github.com/bext1998/palladio-design-language-system/issues/1) 的子 Issue 皆已關閉後，關閉 #1。
2. 決定 `pd-color-border-default` 作為 Input 可識別邊界的 A-M2 缺口要新開 Issue（#21 已關閉，不能再擴張）並完成 GitHub 追蹤；`validate-accessibility.mjs` 的 `KNOWN_GAPS` 與 `accessibility-contract.md` 第三、十一節目前以此為唯一登記的已確認缺漏。
3. 挑一個第一批元件 Issue 開始實作；規格建議順序是 Button（#11）→ Input（#13）→ Divider（#2）→ Badge/Tag（#12）→ Card（#7）→ Navigation（#6）（依「能同時驗證最多 Foundation 決策」排序，規格 10.1 節）。每個元件的 focus indicator 驗收依 `palladio/docs/accessibility/accessibility-contract.md` 第四節契約：可直接使用 `pd-color-border-strong`（`#7A7A7A`，已對四層表面通過 A-M2，最低 3.16:1）；若改用產品 accent、`text-primary` 或雙層 ring，仍須對實際相鄰表面逐一驗證 3:1。

## 阻塞與待決策

- 無阻塞。
- **待決策**：`pd-color-border-default`（`#333333`）作為 Input 唯一可識別邊界時，對四層表面對比皆 < 3:1（最高 1.46:1）。已於 `accessibility-contract.md` 第十一節登記為已確認缺漏並由 `validate-accessibility.mjs` gated 追蹤；GitHub 追蹤方式（新開 Issue）待維護者決定。在修正前，Input（#13）等元件不得只依賴 `border-default` 作為 A-M2 邊界。
- **非阻塞（PR #23 審查遺留，可選）**：`accessibility-contract.md` 第三節的 border A-M2 稽核只涵蓋 `bg`／`surface`／`surface-raised`／`surface-overlay` 四層；規格 2.1 的第五層 `surface-hover`（`#323232`）未納入（`border-strong` 對它為 2.99:1）。可補一句說明為何排除（暫態表面）。文件抬頭 `Spec Revision：480b27b…` 亦早於本次 spec 2.2 參考值變更。
- 雙產品 accent 驗證（[#15](https://github.com/bext1998/palladio-design-language-system/issues/15)）仍需兩個產品提供實際 accent 色值後才能執行。

## 權威連結

- [規格第 10 章：元件規劃](docs/spec.md)
- [Foundation parent #1](https://github.com/bext1998/palladio-design-language-system/issues/1)
- [Agent Reference](palladio/dist/agent-reference.md)（#10 交付物，AI 代理消費端的 token 總覽與使用規則）
- [可及性契約文件](palladio/docs/accessibility/accessibility-contract.md)（#3 交付物；第四節 focus indicator 契約已於 #23 更新）
