# Palladio Design Language & System — 下一步行動

> 僅保留當前有效前線；明確 closeout 時整體重建，不追加歷史。

## 下一個 Session 目標

完成 [#10 產生 agent-reference.md 與 token 使用規則](https://github.com/bext1998/palladio-design-language-system/issues/10)，Foundation 僅剩此項。

## 行動（最多 3 項）

1. 完成 [#10](https://github.com/bext1998/palladio-design-language-system/issues/10)：從既有 token 來源產出 `agent-reference.md`（Token 總覽 table + 使用規則 + 禁止事項），可參考 `palladio/docs/accessibility/accessibility-contract.md` 已定義的 A-M1–A-M6 契約作為可及性規則段落的來源。
2. #10 完成後關閉 [#1 Foundation 總覽](https://github.com/bext1998/palladio-design-language-system/issues/1)，開始第一批元件 Issue（#2、#6、#7、#11、#12、#13，彼此互不相依，可平行推進）。
3. 每個元件 Issue 驗收 focus indicator 時，需依 `accessibility-contract.md` 第四節契約自行驗證對比達 A-M2（不得預設沿用 `pd-color-border-strong`，該 token 已列為已確認缺漏）。

## 阻塞與待決策

- 無。雙產品 accent 驗證（#15）須在後續取得兩個產品的實際色彩資料。
- 已確認缺漏，追蹤於 [#21](https://github.com/bext1998/palladio-design-language-system/issues/21)（非阻塞，但每個元件都需個別處理直到 #21 完成）：`pd-color-border-strong` 作為 focus ring 底色對現有表面對比未達 A-M2 3:1，詳見 `palladio/docs/accessibility/accessibility-contract.md` 第三、四、十一節。

## 權威連結

- [規格第 9–13 章](docs/spec.md)
- [Foundation parent #1](https://github.com/bext1998/palladio-design-language-system/issues/1)
- [下一項 Foundation #10](https://github.com/bext1998/palladio-design-language-system/issues/10)
- [可及性契約文件](palladio/docs/accessibility/accessibility-contract.md)（#3 交付物）
- [Focus ring 對比缺漏 #21](https://github.com/bext1998/palladio-design-language-system/issues/21)
