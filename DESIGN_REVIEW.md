# PR #28 視覺審查

## 修正複核（2026-09-05）

複核 commit：`e556274754f8f203c82bb63548aa7db5d47dad8b`。前次 P2 文件問題解除，本次視覺審查通過。README 現在說明兩種方向在 surface-raised 上皆無可見線條，只剩間距；錯誤例外已移除。與前次審查 commit 的差異只含 README 與契約測試，CSS、token 及渲染輸入未變，沿用原六組截圖，未重跑渲染。最新快照的 Divider 契約測試通過。GitHub checks 仍為空，整體合併門檻不在此結論內。以下保留原審查紀錄。

- 日期：2026-09-05
- 對象：feat: add Divider component (#2)
- PR：https://github.com/bext1998/palladio-design-language-system/pull/28
- 審查 commit：`0a9080aa37ad39dcccee4044de226b8f0c04e6a5`（完成前核對未變動）
- 環境：Windows、PowerShell 7.6.5、headless Microsoft Edge / Chromium 152.0.4191.62、deviceScaleFactor 1、dark theme。
- 範圍：Divider CSS、README、契約測試、Issue #2、spec §2.2／6.1–6.2／7。測試頁的排版與字體是審查載具，不列為 PR 產品設計。

## 結論

CSS 在文件保證的 bg／surface 上通過本次視覺檢查；建議修正下列 P2 文件問題後通過視覺審查。未發現需更改 token 或元件 CSS 的證據。信心：高，依據六組截圖與 computed style。

## 評分

| 維度 | 分數 | 理由 |
|---|---:|---|
| Anti-AI-Slop | 10 | 元件只有線條與留白，無多餘裝飾。 |
| UX | 8 | 用途、原生語意與方向有說明；表面限制的誤述會誤導消費端。修正 P2 可消除此扣分。 |
| 視覺品質 | 9 | 支援表面上的線條、間距與對齊一致；surface 上線條辨識度弱，符合規格「幾乎與表面融合」，保留此設計取捨。 |
| Design System Conformance | 10 | 使用指定 border-subtle 與 space-4；1px 符合 §7，三種 density 一致。 |
| 平均 | 9.25 | 分数不取代問題判定。 |

## P2：surface-raised 的水平變體限制寫錯

位置：`palladio/components/divider/README.md:21`。

README 只警告垂直變體消失，並宣稱水平變體「不受影響」。渲染顯示兩個方向的線條在 surface-raised 上都不可見：border-subtle 與背景同為 `#242424`。水平變體保留上下 16px 留白；垂直變體也保留左右 16px 留白，無法用留白證明只有水平變體不受影響。

影響：消費端依此文字在 raised 容器選用水平 Divider 時，預期的線條分隔不會出現。這是使用契約誤述，並非要求裝飾線達到 A-M2 3:1，也不是 CSS 違反指定 token。

建議：將限制套用到兩個方向，明寫「surface-raised 上兩種變體的線條皆不可見，只保留間距；需要可見線條時，不應使用此 Divider」。刪除水平變體「不受影響」的例外，保留 spacing／typography 優先原則。無須為此新增 fallback 或改色。

證據：[桌面截圖](review-artifacts/pr28/default-1280.png) 第三個表面區塊、[窄版截圖](review-artifacts/pr28/default-375.png) 第三個表面區塊，以及 [computed styles](review-artifacts/pr28/metrics.json)。

## 驗證

- 讀取 PR 完整 diff、Issue #2 與相關規格，從指定 commit 建立 `.git/pr28-review` 快照，未切換工作分支。
- Compact／Default／Spacious，各渲染 1280×900 與 375×900 viewport，保存 full-page PNG 並檢視六張圖片。
- 各案例包含水平與垂直變體，以及 bg、surface、surface-raised、surface-overlay、surface-hover；後三者為限制探索，不擴張 README 的支援保證。
- 水平線高 1px、垂直線寬 1px；兩方向的主軸 margin 為 16px。垂直線在測試容器撐至 64px。六組皆無頁面水平溢位、文字重疊或線條裁切。
- `node .git/pr28-review/palladio/components/divider/divider.test.mjs` 通過。
- 非互動元件無 hover／active／focus／disabled 狀態；本次未將互動控制項要求套用至 Divider。
- GitHub `statusCheckRollup` 為空；無 CI 通過證據，因此本報告不能保證整體 PR 審查流程完成。
- 未執行跨瀏覽器、不同 DPR、螢幕閱讀器或完整 accessibility audit；本次結論限於上述渲染環境。未重跑與視覺變更無關的 Foundation validators。

## 保留與優先順序

保留語意 token、4px spacing scale、原生 hr、垂直 aria-orientation 與裝飾性 role=none 說明。先修正 P2 的支援限制，再附上本次截圖作審查證據。沒有其他優先修正項。

## 產物

`review-artifacts/pr28/` 包含六張 PNG、六份自含 CSS 的 HTML、`metrics.json` 與 `render.cjs`。HTML 可供人工重現，render.cjs 使用本機 bundled Playwright 與 PR 快照路徑。只新增本機審查產物；未修改 PR 程式碼、提交 GitHub review 或留言。
