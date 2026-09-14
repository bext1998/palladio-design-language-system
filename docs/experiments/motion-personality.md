# 動效個性與 Easing 使用限制

- 狀態：Hypothesis
- 舊規格出處：`docs/spec.md` 舊 §5.1（動效個性）、§5.3 的使用限制與感知描述（duration／easing 的實際數值表本身是 Promoted contract，保留在 `docs/spec.md`；本檔只處理「為什麼這樣設計」與「使用限制是否成立」）
- 假設：
  - 動效個性：迴避線性（機械、沒有生命感）和彈跳（活潑但不專業）兩個極端，目標是自然的加速與減速，進場比退場稍慢。
  - `pd-easing-expressive` 是動效個性的核心，產生輕微過衝（overshoot），類似彈性但不是彈跳，是「有機生命感」的來源；僅限 `pd-duration-normal` 以上使用，`fast` 等級不適用。
- 輸入：原規格 5.1、5.3 全文與註記。
- 狀態矩陣：尚未針對進場／退場／micro-interaction／reduced-motion 各種組合做並列比較，也沒有驗證「僅限 normal 以上使用」這條限制是否在實際元件中被遵守或有例外需求。
- 壓力測試／情境：尚無記錄。
- 證據：duration／easing token 已產出並被消費（E3），但「這個 easing 曲線讓人感覺有機」是感知層面的主張，沒有使用者驗證。
- 使用者裁決：尚未裁決。
- 結論：維持 Hypothesis。Reduced motion 的降級規則（原 §5.4）是機器可驗的硬規則，已移入 `docs/guardrails.md`，不受本檔影響。
