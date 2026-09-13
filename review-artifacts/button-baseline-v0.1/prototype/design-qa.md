# Button Prototype Design QA

## Comparison inputs

- Source visual truth: `D:\AgentCoding\PalladioDesignLanguageSystem\review-artifacts\button-baseline-v0.1\button-state-matrix.png` (1485 × 1059 px) and `D:\AgentCoding\PalladioDesignLanguageSystem\review-artifacts\button-baseline-v0.1\button-context-corridor.png` (1486 × 1058 px).
- Implementation: `http://127.0.0.1:4174/`, rendered in the Codex in-app browser.
- Playwright captures were taken at a 1280 × 720 CSS viewport and saved under `prototype/qa-evidence/`:
  - `state-matrix-implementation-1280x720.png`
  - `context-corridor-implementation-1280x720.png`
- Persisted equal-height, side-by-side comparisons with source labels are available under `prototype/qa-evidence/`:
  - `state-matrix-comparison-1280x720.png`
  - `context-corridor-comparison-1280x720.png`
- The comparison inputs are now persisted. The source captures retain the earlier composite evidence; the implementation retains the Baseline decision that State Matrix and Context Corridor are separate artifacts. This is a documented scope difference, not a new runtime defect.

## Runtime states checked

- State Matrix: Primary / Secondary / Tertiary × Default / Hover / Focus-visible / Pressed / Loading / Disabled × 深碳灰 / 金屬灰 / 月牙白.
- Context Corridor: Toolbar, Form action, Dialog footer across all three themes and Default, Hover, Focus-visible, Pressed, Loading, Disabled, and Field focus scenarios.
- Focused visual region: State Matrix Focus-visible and Loading rows; Context Corridor Loading and Field focus scenarios.

## Runtime evidence

- All prototype Button controls render as native `<button type="button">` elements with non-empty accessible names.
- Real keyboard Tab traversal reached Primary, Secondary, and Tertiary Focus-visible cells; each matched `:focus-visible`.
- Tertiary Focus-visible retained transparent border and used a linear baseline indicator; it did not form a closed rectangular container.
- Enter and Space activated a default Button and updated the Inspector event log.
- Loading controls remained in the Tab order, retained their label, exposed `aria-busy="true"` and `aria-disabled="true"`, and did not update the event log on Enter or Space.
- Native Disabled controls were skipped by Tab and did not update the event log when clicked.
- Scenario parity was checked after each Corridor scenario. All three themes produced equivalent variant, state, disabled, loading, and field-focus signatures.
- `getByLabel("Email address")` found all three Form fields; Save and other Button names were exposed through the accessibility tree.
- Existing interaction checks had an empty console warning/error log. The Playwright screenshot run reported only the dev-server's missing `/favicon.ico` resource; no Button or application error was reported.
- Under emulated `prefers-reduced-motion: reduce`, Button transitions and loading animation computed to `none`; the emulation was restored afterward.

## Required fidelity surfaces

- Fonts and typography: The implementation preserves the source's product UI sans-serif treatment and uses the display role only for the content heading. The browser-rendered capture was readable at the tested desktop viewports.
- Spacing and layout rhythm: The three-column State Observatory structure and dense linear division remain intact. The first browser pass found Matrix Loading crowding; later browser evidence found the absolute-position workaround put the spinner outside the Button. The sixth-round treatment keeps the spinner in inline flow, retains the semantic `--pd-space-2` indicator, and uses Matrix-only `gap: var(--pd-space-1)` with `padding-inline: 0` to release the button's inline budget. Parent-agent post-fix geometry checks confirmed all nine controls at both target viewports.
- Colors and visual tokens: Three theme fixture surfaces remained visually distinct while using the same component structure and state model. Theme fixtures are prototype-only comparison inputs, not formal Palladio tokens.
- Image quality and asset fidelity: No source imagery or non-standard visual assets are part of these Button artifacts; Phosphor's loading icon is an implementation candidate only.
- Copy and content: State, theme, context, and Inspector labels were present and readable. Accessibility labels remain evidence from the rendered prototype, not formal pass claims.

## Persisted visual comparison outcome

- State Matrix: the three-column navigation/content/Inspector structure, theme columns, six state rows, linear Tertiary focus treatment, and inline Loading indicator remain visible in the implementation capture. The source image contains legacy lower composite sections; current Baseline keeps those context checks in the separate Context Corridor artifact.
- Context Corridor: Toolbar, Form action, Dialog footer, three themes, state coverage, and Inspector remain visible in the implementation capture. The source and implementation use different vertical density because the implementation is captured at the requested 1280 × 720 viewport; this does not change the tested component semantics.
- No new P0, P1, or P2 visual finding was identified from the persisted comparisons. The favicon 404 is a non-Button dev-server resource gap and remains outside this validation change's scope.

## Findings

- [P2 — fixed and browser-verified] Matrix Loading content was space-constrained at 1280 × 720.
  Location: `.matrix .pd-prototype-button[data-force-state="loading"]`.
  Evidence: At 1280 × 720, loading buttons measured 56 px client width while their content required 62 px scroll width; the in-memory browser capture showed spinner/text crowding. At 1440 × 1024 the content was readable but remained dense.
  Impact: Loading may look clipped or noisy in a narrow desktop viewport, weakening the evidence for preserved action identity.
  Fix applied: Matrix cells use compact existing semantic padding with no inter-track gap; Matrix Loading retains an inline `--pd-space-2` spinner and uses `gap: var(--pd-space-1)` with `padding-inline: 0`. The label, spinner, outer layout role, component DOM, state model, three-theme comparison, and three-column structure remain intact. Post-fix browser checks found no remaining P0/P1/P2 finding for this issue.
  Post-fix evidence: At 1440 × 1024 override (`innerWidth=1200`), all 9 controls had `iconInside=true`, `max overlap=0`, `overflow count=0`, and `clientWidth/scrollWidth=68`. At 1280 × 720 override (`innerWidth=1067`), all 9 controls had `iconInside=true`, `max overlap=0`, `overflow count=0`, and `clientWidth/scrollWidth=80`.

## Comparison history

1. Initial runtime comparison: no P0/P1 behavior failure. Runtime checks exposed the Matrix Loading density risk above.
2. Red regression evidence: `npm test` failed the new Matrix loading layout assertion because no narrow-cell positioning treatment existed.
3. Fix: Matrix-only Loading indicators now leave the inline label flow, use an existing Palladio semantic size, and retain the same button DOM, label, state, and outer layout role. `npm test` passed 6/6 after the fix.
4. Second-round browser evidence: the first absolute-position fix still showed a measured icon/label overlap up to 0.237 px at 1280 × 720. This was treated as a second red finding rather than a pass.
5. Third-round browser evidence: at 1440 × 1024 (innerWidth 1200, DPR 1.2), the reduced icon still overlapped the label in all 9 cells, with maximum overlap 1.3808 px. The issue was correctly reclassified as a Matrix track-budget problem, not an icon-size problem.
6. Fourth-round browser evidence: 1440 × 1024 reached overlap 0 and overflow 0, but `iconInside=false` for all 9 cells because the absolute-positioned spinner crossed the Button boundary.
7. Fifth-round red evidence: the revised inline-flow precondition failed against the fourth-round absolute-positioned CSS.
8. Fifth-round fix: restore normal inline flow, retain the `--pd-space-2` spinner, and apply Matrix-only compact spacing. Parent-agent measurement found the icon inside all 9 buttons with zero overflow, but a maximum 1.3753 px icon/label overlap remained.
9. Sixth-round red evidence: after the test precondition changed to the requested inline `gap: var(--pd-space-1)` and `padding-inline: 0`, `npm test` failed against the previous `gap: 0` / `padding-inline: var(--pd-space-1)` rule (1 failed, 5 passed).
10. Sixth-round fix: Matrix Loading now uses normal inline flow with `gap: var(--pd-space-1)` and `padding-inline: 0`, retaining the `--pd-space-2` spinner, full label, Button identity, three-theme comparison, and three-column structure. The unit test is a CSS precondition only; it is not a layout proof. Parent-agent browser measurement must confirm 1280 × 720 and 1440 × 1024 geometry with overlap, overflow, and icon-boundary checks.
11. Sixth-round post-fix browser evidence: at 1440 × 1024 override (`innerWidth=1200`), 9/9 controls passed icon-boundary containment, `max overlap=0`, and `overflow count=0` (`clientWidth/scrollWidth=68`). At 1280 × 720 override (`innerWidth=1067`), 9/9 controls passed the same checks (`clientWidth/scrollWidth=80`). The Matrix Loading P2 is fixed with no remaining P0/P1/P2 finding. The persisted combined comparison input remains unavailable, so the overall result stays blocked.

## Remaining validation limits

- Screen-reader announcement quality was checked through the browser accessibility tree and accessible-name queries, not with a dedicated screen-reader session.
- Reduced-motion behavior was validated through browser media emulation; product-level motion preference integration remains pending.
- Focus contrast was inspected from rendered computed styles and screenshots; formal contrast approval remains pending until implementation accessibility review.
- No Candidate rule is promoted to formal Palladio Design System specification.

**Final result: passed**
