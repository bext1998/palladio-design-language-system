# Palladio Design Language & System — 下一步行動

> 僅保留當前有效前線；明確 closeout 時整體重建，不追加歷史。

## 下一個 Session 目標

Foundation（#1 及其全部子 Issue）已完成，包含 #10 產出的 `palladio/dist/agent-reference.md`。兩個可及性缺口皆已修正並關閉：#21 / PR [#23](https://github.com/bext1998/palladio-design-language-system/pull/23)（`pd-color-border-strong` focus ring 對比），#24 / PR [#25](https://github.com/bext1998/palladio-design-language-system/pull/25)（新增 `pd-color-input-border` 作為 Input 可識別邊界）。第一批元件已啟動：[#11 Button](https://github.com/bext1998/palladio-design-language-system/issues/11) 已於 PR [#26](https://github.com/bext1998/palladio-design-language-system/pull/26) 完成並關閉。剩餘第一批元件：[#2 Divider](https://github.com/bext1998/palladio-design-language-system/issues/2)、[#6 Navigation](https://github.com/bext1998/palladio-design-language-system/issues/6)、[#7 Card](https://github.com/bext1998/palladio-design-language-system/issues/7)、[#12 Badge/Tag](https://github.com/bext1998/palladio-design-language-system/issues/12)、[#13 Input](https://github.com/bext1998/palladio-design-language-system/issues/13)（彼此互不相依，可平行推進）。

## 行動（最多 3 項）

1. 確認 [#1 Foundation 總覽](https://github.com/bext1998/palladio-design-language-system/issues/1) 的子 Issue 皆已關閉後，關閉 #1。（已於 #1 留言確認 6/6 子 Issue 關閉、三個 validator 通過，符合關閉條件。）
2. 接續第一批元件；規格建議順序（規格 10.1 節）中 Button（#11）已完成，下一個是 Input（#13），其後為 Divider（#2）→ Badge/Tag（#12）→ Card（#7）→ Navigation（#6）。每個元件的 focus indicator 驗收依 `palladio/docs/accessibility/accessibility-contract.md` 第四節契約：可直接使用 `pd-color-border-strong`（`#7A7A7A`，已對四層表面通過 A-M2，最低 3.16:1）；若改用產品 accent、`text-primary` 或雙層 ring，仍須對實際相鄰表面逐一驗證 3:1。Button 已建立 `palladio/components/<name>/` + `<name>.css` + `README.md` + `<name>.test.mjs` + `validate:<name>` script 的樣板，後續元件沿用。
3. Input（#13）專屬約束（已併入 #13 驗收條件）：靜止邊界用 `pd-color-input-border`。因 `input-border` 與 `border-strong` 目前解析為同一色（皆 `{color.charcoal.600}` → `#7A7A7A`），`:focus-visible` **不得**只把同色套回同一條 border，必須產生可見的幾何差異（offset outline、外圈 ring、box-shadow 或邊框寬度變化），且該 focus indicator 仍須依 A-M2 對相鄰表面驗證。

## 阻塞與待決策

- 無阻塞。
- **已解決（#24 / #25）**：`pd-color-border-default`（`#333333`）作為 Input 可識別邊界的 A-M2 缺口，已由新增 `pd-color-input-border`（`#7A7A7A`，對 `bg`／`surface`／`surface-raised`／`surface-overlay` 四層皆 ≥3:1）取代。`border-default` 依規格 2.2 修訂收窄為純裝飾性 card edge，`validate-accessibility.mjs` 的 `KNOWN_GAPS` 已清空，契約第十一節記為「目前沒有已確認的 A-M2 缺漏」。若 Card（#7）日後需要可識別的互動邊界，會遇到與 Input 相同的約束。
- **Foundation 行為變更（#26 隨 Button 帶入）**：Default density 的 custom properties 已從 `:root[data-density]` 選擇器移至裸 `:root`，因此「省略 `data-density` = Default」才真正生效（先前產品若不設該屬性會拿不到密度變數）。`config.js`、`dist/css/palladio.css`、`dist/agent-reference.md`、`validate-artifacts.mjs`、`docs/spec.md` §9.3 均已同步。
- **非阻塞（審查遺留，可選）**：契約第三節的 border A-M2 稽核只涵蓋四層表面，規格 2.1 的第五層 `surface-hover`（`#323232`）未納入（`input-border`／`border-strong` 對它均為 2.99:1）——可補一句說明為何排除（暫態表面）。
- **已決策：廢棄 `Spec Revision` 抬頭欄位**（人工維護、已確認低價值）。本次已從 `accessibility-contract.md` 抬頭移除；不再維護，也不開專門 PR 回填。maze 工具產生的新 Issue 內文若仍帶此欄位，視為未維護、可忽略；規格版本以 `git log docs/spec.md` 為準。
- 雙產品 accent 驗證（[#15](https://github.com/bext1998/palladio-design-language-system/issues/15)）仍需兩個產品提供實際 accent 色值後才能執行。

## 權威連結

- [規格第 10 章：元件規劃](docs/spec.md)
- [Foundation parent #1](https://github.com/bext1998/palladio-design-language-system/issues/1)
- [Agent Reference](palladio/dist/agent-reference.md)（#10 交付物；#25 新增「Input 可識別邊界」小節）
- [可及性契約文件](palladio/docs/accessibility/accessibility-contract.md)（#3 交付物；第四節 focus indicator 契約於 #23 更新，第三／十一節於 #25 更新）
- `palladio/components/button/`（#11 交付物；後續元件的結構樣板）
