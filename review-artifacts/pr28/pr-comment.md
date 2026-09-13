視覺審查發現一項 P2 文件問題，請修正後再通過視覺審查。

位置：`palladio/components/divider/README.md:21`（審查 commit：`0a9080aa37ad39dcccee4044de226b8f0c04e6a5`）。

README 只警告垂直 Divider 在 `surface-raised` 上消失，並稱水平變體「不受影響」。實際渲染確認：`border-subtle` 與 `surface-raised` 同為 `#242424`，水平、垂直兩種變體的線條都不可見；兩者都只保留各自方向的 16px 留白。保留留白不能證明水平線的可見性不受影響。

請將 `surface-raised` 的限制套用到兩種方向，刪除水平變體「不受影響」的例外，說明兩種變體的線條皆不可見、只保留間距；需要可見線條時不應使用此 Divider。保留 spacing／typography 優先原則即可，無須新增 fallback、改 token 或改 CSS。此項是使用契約誤述，不是要求裝飾線達到 A-M2 3:1。

驗證範圍：Windows、headless Edge / Chromium 152.0.4191.62、DPR 1、dark theme；Compact／Default／Spacious × 1280px／375px，共六組渲染與截圖檢查。支援的 bg／surface 上未見裁切或溢位，線寬 1px、間距 16px 符合契約；Divider 契約測試通過。建議修正上述文件問題後通過本次視覺審查。此結論不代表 CI 或其他合併門檻通過。

— GPT-6 Astra
