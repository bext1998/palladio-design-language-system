# Palladio Design Language & System — 下一步行動

> 僅保留當前有效前線；明確 closeout 時整體重建，不追加歷史。

## 下一個 Session 目標

Foundation（#1 及其全部子 Issue）已完成，包含 #10 產出的 `palladio/dist/agent-reference.md`。兩個可及性缺口皆已修正並關閉：#21 / PR [#23](https://github.com/bext1998/palladio-design-language-system/pull/23)（`pd-color-border-strong` focus ring 對比），#24 / PR [#25](https://github.com/bext1998/palladio-design-language-system/pull/25)（新增 `pd-color-input-border` 作為 Input 可識別邊界）。下一步是開始第一批元件：[#2 Divider](https://github.com/bext1998/palladio-design-language-system/issues/2)、[#6 Navigation](https://github.com/bext1998/palladio-design-language-system/issues/6)、[#7 Card](https://github.com/bext1998/palladio-design-language-system/issues/7)、[#11 Button](https://github.com/bext1998/palladio-design-language-system/issues/11)、[#12 Badge/Tag](https://github.com/bext1998/palladio-design-language-system/issues/12)、[#13 Input](https://github.com/bext1998/palladio-design-language-system/issues/13)（彼此互不相依，可平行推進）。

## 行動（最多 3 項）

1. 確認 [#1 Foundation 總覽](https://github.com/bext1998/palladio-design-language-system/issues/1) 的子 Issue 皆已關閉後，關閉 #1。（已於 #1 留言確認 6/6 子 Issue 關閉、三個 validator 通過，符合關閉條件。）
2. 挑一個第一批元件 Issue 開始實作；規格建議順序是 Button（#11）→ Input（#13）→ Divider（#2）→ Badge/Tag（#12）→ Card（#7）→ Navigation（#6）（依「能同時驗證最多 Foundation 決策」排序，規格 10.1 節）。每個元件的 focus indicator 驗收依 `palladio/docs/accessibility/accessibility-contract.md` 第四節契約：可直接使用 `pd-color-border-strong`（`#7A7A7A`，已對四層表面通過 A-M2，最低 3.16:1）；若改用產品 accent、`text-primary` 或雙層 ring，仍須對實際相鄰表面逐一驗證 3:1。
3. Input（#13）專屬約束（已併入 #13 驗收條件）：靜止邊界用 `pd-color-input-border`。因 `input-border` 與 `border-strong` 目前解析為同一色（皆 `{color.charcoal.600}` → `#7A7A7A`），`:focus-visible` **不得**只把同色套回同一條 border，必須產生可見的幾何差異（offset outline、外圈 ring、box-shadow 或邊框寬度變化），且該 focus indicator 仍須依 A-M2 對相鄰表面驗證。

## 阻塞與待決策

- 無阻塞。
- **已解決（#24 / #25）**：`pd-color-border-default`（`#333333`）作為 Input 可識別邊界的 A-M2 缺口，已由新增 `pd-color-input-border`（`#7A7A7A`，對 `bg`／`surface`／`surface-raised`／`surface-overlay` 四層皆 ≥3:1）取代。`border-default` 依規格 2.2 修訂收窄為純裝飾性 card edge，`validate-accessibility.mjs` 的 `KNOWN_GAPS` 已清空，契約第十一節記為「目前沒有已確認的 A-M2 缺漏」。若 Card（#7）日後需要可識別的互動邊界，會遇到與 Input 相同的約束。
- **非阻塞（審查遺留，可選）**：契約第三節的 border A-M2 稽核只涵蓋四層表面，規格 2.1 的第五層 `surface-hover`（`#323232`）未納入（`input-border`／`border-strong` 對它均為 2.99:1）——可補一句說明為何排除（暫態表面）。契約文件抬頭 `Spec Revision：480b27b…` 早於 #23／#25 對 spec 2.2 與契約 §3／§11 的變更，應更新為實際 merge commit。
- 雙產品 accent 驗證（[#15](https://github.com/bext1998/palladio-design-language-system/issues/15)）仍需兩個產品提供實際 accent 色值後才能執行。

## 權威連結

- [規格第 10 章：元件規劃](docs/spec.md)
- [Foundation parent #1](https://github.com/bext1998/palladio-design-language-system/issues/1)
- [Agent Reference](palladio/dist/agent-reference.md)（#10 交付物；#25 新增「Input 可識別邊界」小節）
- [可及性契約文件](palladio/docs/accessibility/accessibility-contract.md)（#3 交付物；第四節 focus indicator 契約於 #23 更新，第三／十一節於 #25 更新）
