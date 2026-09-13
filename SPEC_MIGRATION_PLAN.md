# Specification Migration Plan

> Scope: complete, read-only classification of `docs/spec.md`, `SPEC_REVIEW.md`, and `SPEC_ADVERSARIAL_REVIEW-2026-09-13.md`.
>
> Source revision: `f03184f7c69882c351008aaed70de1befef35a9b`
>
> Source-spec SHA-256: `30AEE7DBA050F9C0994CBA418479767BE71B86E59EAA176BA9242D42780F0D82`
>
> Status: proposed migration only. The recommendations below await the user's final confirmation; no contract, source token, pipeline, component, governance file, or actual migration has changed.

## Conclusion

`docs/spec.md` should remain, but its role must change from a pre-emptive design answer to the current, promoted implementation contract. `DECISIONS.md` remains an index of durable decisions and cannot replace that contract. Experimental material must not be made authoritative merely because it has been written down or implemented in a prototype.

The current document has **13** top-level chapters, not 11. This plan covers every chapter and subsection. The stated product direction is: concept prototype → experiment and stress test → consumer validation → user decision → promoted contract. That direction materially changes the review scope, so the prior `SPEC_REVIEW.md` verify result cannot be reused.

## Classification model and authority

| Class | Meaning | May constrain implementation now? | Proposed authority |
|---|---|---:|---|
| Guardrail | Safety, accessibility, evidence-integrity, or governance boundary that experimentation may not bypass. | Yes | `docs/guardrails.md` and, for accessibility mechanics, `palladio/docs/accessibility/accessibility-contract.md` |
| Promoted contract | A stable cross-consumer rule with implementation and sufficient verification evidence. | Yes | `docs/spec.md`, with details delegated to the package, component README, or accessibility contract |
| Validation hypothesis | A candidate visual, product, architectural, or workflow rule. It may have an implementation, but lacks promotion evidence. | No | `docs/experiments/YYYY-MM-DD-slug.md`, indexed by `docs/experiments/README.md` |
| Disproved / superseded | A prior claim or completion model contradicted by evidence or replaced by the user-approved workflow. | No | `docs/archive/` with a replacement link |
| Background narrative | History, motivation, risk context, or explanatory material that makes no binding implementation claim. | No | `README.md` or `docs/archive/` |

`DECISIONS.md` should continue to contain only each decision's summary, status, and link to its authoritative contract or experiment. It must not duplicate executable rules such as the focus-ring fallback procedure. Each rule has one authoritative location; every other document links to it without reproducing the full rule.

## Evidence legend

| ID | Evidence | Status |
|---|---|---|
| E1 | `SPEC_REVIEW.md`: prior verify review; its four former Major findings were resolved, while SR-005 remained open because verify did not recheck it. | Fact, historical scope only |
| E2 | `SPEC_ADVERSARIAL_REVIEW-2026-09-13.md`: user dissatisfaction refuted the claim that six components were visually complete; no `main` consumer imported Palladio tokens; Layer 2 was absent. | Fact from the recorded review; current external state not re-queried |
| E3 | `palladio/tokens/`, `palladio/pipeline/`, published package metadata, generated outputs, and six component source directories exist at the source revision. | Fact |
| E4 | `palladio/package.json` exposes `validate:tokens`, `validate:artifacts`, `validate:accessibility`, six component validators, and `validate:component-contracts`. | Fact; this review did not rerun them |
| E5 | `palladio/docs/accessibility/accessibility-contract.md` specifies A-M1–A-M6, focus-ring validation, and accent-pair validation. | Fact |
| E6 | No independently verified, token-consuming production consumer appears in the reviewed repository evidence. | Unverified outside this repository; E2 establishes absence on the reviewed `main` state |

## Complete-review findings

### SR-101 — Major / authority-model contradiction

- Status: open.
- Evidence: `AGENTS.md` rule 2 still makes chapters 1–8 the source of truth; `AGENTS.md` rule 7 and several package documents link `docs/spec.md` as the complete contract. The approved direction makes experiments precede promotion.
- Impact: a prototype author can be blocked by unvalidated visual prose, or an experimental result can be mistaken for a binding rule.
- Required decision before implementation: approve the authority table above and define which files agents must read for a prototype versus a promoted implementation.

### SR-102 — Major / validation strategy superseded

- Status: open.
- Evidence: chapter 11 says production integration is the primary validation path; E2 records that this was not operating on the reviewed `main` state and that the new direction restores experiment and stress-test work before promotion.
- Impact: the current completion language can close work before it has the required visual or stress evidence.
- Required decision before implementation: replace the chapter-11 completion model only after the experiment lifecycle and promotion gates receive user approval.

### SR-103 — Major / evidence-state conflation

- Status: open.
- Evidence: E2 refutes the claims of completed visual quality and operating production validation, while E3/E4 demonstrate real implementation and machine checks. These are different kinds of evidence.
- Impact: implementation existence or a passing token check can be misrepresented as visual or consumer validation.
- Required decision before implementation: each promoted rule must name the evidence type it needs: machine, rendered visual, stress, consumer, and user decision.

### SR-104 — Minor / stale structural and review references

- Status: open.
- Evidence: the document has 13 chapters; `SPEC_REVIEW.md` calls itself a verify report against a former scope; chapter 9.5's illustrative tree differs from the current repository's sparse `palladio/docs/{accessibility,components,design-language}` directories.
- Impact: migration work can silently omit chapters or treat illustrative structure as fact.
- Required decision before implementation: preserve the old document unchanged until the approved migration records all replacements and archive links.

## Migration table

The table is a classification proposal, not a claim that every promoted item has complete consumer evidence. “Promoted contract” means it has a current implementation contract worth preserving; a row marked `revalidate` still requires the listed promotion evidence before its design rationale may be considered settled.

### Chapter 1 — Design language

| Old section | Class | Existing implementation / test / consumer evidence | Authority owner | Promotion or withdrawal condition | Proposed target |
|---|---|---|---|---|---|
| 1.1 Core personality (lines 9–15) | Validation hypothesis | E2 records that agent visual review was not a valid proxy for user visual acceptance. No completed prototype-to-decision evidence is linked. | User as design decision owner | Promote only after representative prototype states and a recorded user decision; withdraw when rejected by a later experiment. | `docs/experiments/design-language/core-personality.md` |
| 1.2 P1 restrained roundness (19–23) | Validation hypothesis | Radius tokens and component CSS exist (E3), but E2 records unresolved visual dissatisfaction, including navigation geometry. | User + experiment owner | Test in intended component contexts and states; promote only with visual comparison and user acceptance. | `docs/experiments/shape/roundness.md` |
| 1.2 P2 line-first grouping (25–27) | Validation hypothesis | Divider and Card source/tests exist (E3/E4); no cross-product visual evidence establishes the priority order. | User + experiment owner | Compare spacing, typography, divider, surface, and card alternatives in stress contexts; promote the chosen rule. | `docs/experiments/grouping/line-first.md` |
| 1.2 P3 carbon-grey hierarchy (29–31) | Validation hypothesis | Surface tokens and contrast checks exist (E3–E5), but no validated consumer establishes the visual hierarchy. | User + token owner | Render in at least one stress context and one consumer; user accepts the hierarchy and contrast gates pass. | `docs/experiments/color/surface-hierarchy.md` |
| 1.2 P4 fluid organic motion (33–35) | Validation hypothesis | Motion tokens exist (E3); reduced-motion rules are separately protected. No motion comparison or user decision is linked. | User + experiment owner | Compare motion fixtures including reduced-motion mode; promote only an accepted, measurable rule. | `docs/experiments/motion/organic-motion.md` |
| 1.2 P5 open accent slots (37–39) | Promoted contract, revalidate | Six-slot validation and no-derivation behaviour exist in E3–E5. E2 reports no independent consumer proof and no Layer 2 proof. | Token and accessibility contract owner | Retain while package/API compatibility requires it; revalidate with two distinct consumer contexts before treating the broader product-flexibility claim as settled. | `docs/spec.md` accent contract; evidence in `docs/experiments/accent/` |
| 1.3 “not Palladio” boundaries (41–47) | Background narrative | No executable or acceptance criterion. | Project maintainer | Keep only if it helps scope communication; remove claims that constrain experiments without a decided boundary. | `README.md` or `docs/archive/spec-v0.1.md` |

### Chapter 2 — Colour

| Old section | Class | Existing implementation / test / consumer evidence | Authority owner | Promotion or withdrawal condition | Proposed target |
|---|---|---|---|---|---|
| 2.1 five-level surface names and values (52–62) | Promoted contract, revalidate | Semantic colour token source, CSS/TS/JSON output, and token validation exist (E3/E4). E2 finds no repository consumer evidence. | Token owner | Preserve API names and values until a versioned change; require rendered stress evidence and user approval before treating the five-level aesthetic as settled. | `docs/spec.md` colour contract; experiments under `docs/experiments/color/` |
| 2.2 `border-subtle`, `border-default`, `input-border`, `border-strong` roles (64–72) | Promoted contract | Implemented in token source, component CSS, E4 validators, and E5's A-M2 explanation. | Token + accessibility contract owner | Any role/value change requires machine checks, affected-component rendering, and explicit compatibility/version decision. | `docs/spec.md` role summary plus `palladio/docs/accessibility/accessibility-contract.md` |
| 2.2 `pd-color-focus-ring` validation/fallback mechanism (71–72) | Promoted contract | `accent-contract.mjs`, generated validation API, component READMEs, and E5 define the same mechanism. | Accessibility contract owner | Withdraw only through a replacement that preserves visible A-M3 focus and A-M2 contrast; revalidate each real backdrop. | `docs/spec.md` summary; E5 is authoritative procedural detail |
| 2.3 text roles and values (74–82) | Promoted contract | Semantic tokens and E5 A-M1 validation exist. | Token + accessibility contract owner | Preserve as API contract; revise only with contrast validation, downstream impact assessment, and version decision. | `docs/spec.md` and E5 |
| 2.4 semantic-colour palette and desaturation rationale (84–95) | Split: contract for contrast; hypothesis for hue rationale | E5 validates semantic text contrast; no visual experiment supports the desaturation/aesthetic claim. | Accessibility owner for thresholds; user for appearance | Keep thresholds as guardrail; move hue/rationale only after visual experiments. | Thresholds in E5; rationale in `docs/experiments/color/semantic-colours.md` |
| 2.5 six accent slots and explicit-pair rules (97–110) | Promoted contract | E3/E4 enforce all six slots; E5 defines validation procedure. Consumer uptake remains E6-unverified. | Token + accessibility contract owner | Keep compatibility; add consumer evidence records per product and reassess only after observed integration gaps. | `docs/spec.md` plus E5; evidence in `docs/experiments/accent/` |

### Chapter 3 — Typography

| Old section | Class | Existing implementation / test / consumer evidence | Authority owner | Promotion or withdrawal condition | Proposed target |
|---|---|---|---|---|---|
| 3.1 Noto Sans / Noto Sans Mono selection and rationale (114–119) | Validation hypothesis | Typography token source and output exist (E3); the stated reason includes personal preference, not experiment evidence. | User + typography experiment owner | Compare intended languages, density, readability, and actual consumer fallback; promote after user decision. | `docs/experiments/typography/font-family.md` |
| 3.2 text-role inventory and metrics (121–134) | Promoted contract, revalidate | Typography tokens, generated independent properties, and component contract work exist (E3/E4). No consumer typography study is recorded. | Token owner | Preserve names as package contract; alter values/roles only after render comparison, consumer evidence, and version decision. | `docs/spec.md` typography contract |
| 3.3 letter-spacing, weight, and minimum-size rules (136–141) | Split: contract where encoded; hypothesis otherwise | Some values are encoded in token data; the 10px minimum and visual rationales have no cited validation. | Token owner + user | Separate each encoded rule from prose; promote non-encoded claims only after readability/accessibility evidence. | Contract rows in `docs/spec.md`; candidates in `docs/experiments/typography/` |

### Chapter 4 — Shape

| Old section | Class | Existing implementation / test / consumer evidence | Authority owner | Promotion or withdrawal condition | Proposed target |
|---|---|---|---|---|---|
| 4.1 radius token scale (146–155) | Promoted contract, revalidate | Radius token source and component consumption exist (E3/E4). | Token owner | Retain current API; require contextual prototypes and user decision before changing values or claimed component mapping. | `docs/spec.md` token contract |
| 4.2 radius usage principles (157–163) | Validation hypothesis | E2 specifically identifies missing guidance for navigation-like items and refutes confidence in the visual result. | User + shape experiment owner | Exercise buttons, navigation, menus, panels, and density variants; promote accepted context rules, not a universal slogan. | `docs/experiments/shape/context-matrix.md` |

### Chapter 5 — Motion

| Old section | Class | Existing implementation / test / consumer evidence | Authority owner | Promotion or withdrawal condition | Proposed target |
|---|---|---|---|---|---|
| 5.1 motion personality (168–170) | Validation hypothesis | E3 supplies motion tokens; no recorded visual or user validation for this personality claim. | User + motion experiment owner | Promote after side-by-side state/transition trials and user decision. | `docs/experiments/motion/personality.md` |
| 5.2 duration scale (172–179) | Promoted contract, revalidate | Token source and generated outputs exist (E3); no usage study is cited. | Token owner | Maintain API; revise values only with rendered evidence, reduced-motion test, and compatibility decision. | `docs/spec.md` motion contract |
| 5.3 easing curves and “expressive” rationale (181–190) | Validation hypothesis | E3 encodes curves, but no experiment establishes the claimed perception or usage limits. | User + motion experiment owner | Test entry, exit, micro-interaction, and reduced-motion cases; promote only accepted restrictions. | `docs/experiments/motion/easing.md` |
| 5.4 reduced motion (192–199) | Guardrail | E5 defines A-M4 and implementation expectations. `SPEC_REVIEW.md` SR-005 and E5 disagree on its status, so wording needs reconciliation before promotion. | Accessibility contract owner | No experiment may retain non-essential motion under reduce. Reconcile SR-005 with E5 and verify rendered behaviour before changing the guardrail. | E5; concise pointer in `docs/guardrails.md` |

### Chapter 6 — Spacing and density

| Old section | Class | Existing implementation / test / consumer evidence | Authority owner | Promotion or withdrawal condition | Proposed target |
|---|---|---|---|---|---|
| 6.1 4px spacing scale (204–219) | Promoted contract, revalidate | Primitive/semantic spacing tokens and generated output exist (E3); SR-002 records the former inconsistency as resolved. | Token owner | Preserve token API; verify proposed changes in stress layouts and consumer screens before versioned alteration. | `docs/spec.md` spacing contract |
| 6.2 Compact / Default / Spacious presets (221–231) | Promoted contract, revalidate | Three density sources and E4 validation exist; E2 finds no independent consumer evidence. | Token owner + component owner | Require all three density renders in each promotion experiment; retain only values that survive the intended contexts. | `docs/spec.md` density contract; evidence in `docs/experiments/density/` |

### Chapter 7 — Grouping priority

| Old section | Class | Existing implementation / test / consumer evidence | Authority owner | Promotion or withdrawal condition | Proposed target |
|---|---|---|---|---|---|
| spacing → typography → divider → surface → card order (233–243) | Validation hypothesis | Divider/Card documentation refers to it, but E2 supplies no evidence that the universal priority order has been visually accepted. | User + grouping experiment owner | Compare alternatives in real task and stress contexts; promote only distinctions that remain useful. | `docs/experiments/grouping/priority.md` |

### Chapter 8 — Accessibility rules

| Old section | Class | Existing implementation / test / consumer evidence | Authority owner | Promotion or withdrawal condition | Proposed target |
|---|---|---|---|---|---|
| A-M1 text contrast (247–258) | Guardrail | E4/E5 provide repeatable token validation and documented scope. | Accessibility contract owner | Never lower without explicit standard/compatibility decision; test any new token or consumer pair. | E5; pointer in `docs/guardrails.md` |
| A-M2 UI/large-text contrast | Guardrail | E5 documents the 3:1 gate and notes the 3.03:1 minimum margin recorded in E2. | Accessibility contract owner | Keep gate; any token change must revalidate all four surfaces and record margin. | E5 |
| A-M3 visible focus | Guardrail | E5 and focus-ring implementation provide a fallback path. | Accessibility contract owner | No replacement may remove visible keyboard focus or bypass backdrop validation. | E5 |
| A-M4 reduced motion | Guardrail | E5 defines the requirement; SR-005 wording reconciliation remains open. | Accessibility contract owner | Resolve textual ambiguity and verify rendering before revising. | E5 |
| A-M5 non-colour cues | Guardrail | E5 documents component examples; component tests exist (E3/E4). | Accessibility contract owner | New state design must provide an observable non-colour cue. | E5 |
| A-M6 density-dependent interaction size | Guardrail | Density token validation exists (E4/E5). | Accessibility contract owner + token owner | Any new density/component context must show the effective minimum interactive size. | E5 |

### Chapter 9 — Token architecture and infrastructure

| Old section | Class | Existing implementation / test / consumer evidence | Authority owner | Promotion or withdrawal condition | Proposed target |
|---|---|---|---|---|---|
| 9.1 Layer 0 primitive / Layer 1 semantic discipline (264–276) | Promoted contract | Token directories and pipeline exist; project instructions prohibit primitives in UI (E3). | Token owner | Preserve until a replacement retains semantic-only consumption; test every new token path. | `docs/spec.md` token contract |
| 9.1 optional Layer 2 component override (275–276) | Validation hypothesis | E2 found no `palladio/tokens/component/` implementation or consumption. | User + architecture experiment owner | Do not promise it as capability until a consumer need, prototype, compatibility model, and validation exist. | `docs/experiments/architecture/component-layer.md` |
| 9.2 token namespace (280–290) | Promoted contract | Names are emitted and distributed through the published package (E3/E4). | Token owner | Treat rename/removal as compatibility event; require migration plan and version decision. | `docs/spec.md` token contract |
| 9.3 DTCG, Style Dictionary, CSS/TS/JSON output (293–302) | Promoted contract | Pipeline, generated artifacts, package exports, and artifact validation exist (E3/E4). | Pipeline owner | Change only with build/artifact checks and package compatibility analysis. | `docs/spec.md` technical contract |
| 9.4 agent reference as deliverable (304–310) | Promoted contract | `config.js` emits it and package exports it (E3/E4). Existing links cite old chapter numbers. | Pipeline owner | Keep as package contract; update links atomically with migration and validate generated output. | `docs/spec.md` technical contract; generated reference links to new paths |
| 9.5 illustrative file tree (312–337) | Background narrative | Current repository has placeholder `palladio/docs/design-language/` and `components/`, not the detailed structure promised by the diagram. | Repository maintainer | Replace only after the target document layout is approved; do not treat the diagram as an implementation requirement. | `docs/archive/spec-v0.1.md` or repository map |

### Chapter 10 — Component planning

| Old section | Class | Existing implementation / test / consumer evidence | Authority owner | Promotion or withdrawal condition | Proposed target |
|---|---|---|---|---|---|
| 10.1 first-batch priority list (341–352) | Background narrative | Six component directories and validators exist (E3/E4). E2 refutes reading completion as visual acceptance. | Product roadmap owner | Preserve as historical record only; future component selection begins from a concrete experiment/consumer need. | `docs/archive/spec-v0.1.md`; future backlog/Issue |
| 10.2 machine-checkable floors: state, keyboard, focus, reduced motion, semantic-only, text role (354–364) | Guardrail | E4 component validators and E5 support several items; component evidence varies by rule. | Accessibility + component contract owners | Maintain as promotion gate; each component experiment supplies tests and rendered evidence for applicable rows. | `docs/experiments/experiment-template.md` plus E5 and component READMEs |
| 10.2 visual rationale and three-density user screenshot gate (361–364) | Guardrail | It describes a user decision step but has not consistently been satisfied; E2 refutes treating prior agent review as substitute. | User + experiment owner | No component becomes promoted from visual hypothesis without requested state/density render evidence and recorded user decision. | `docs/experiments/experiment-template.md` |

### Chapter 11 — Validation strategy

| Old section | Class | Existing implementation / test / consumer evidence | Authority owner | Promotion or withdrawal condition | Proposed target |
|---|---|---|---|---|---|
| production-first validation and direct update loop (370–376) | Disproved / superseded | E2 finds no reviewed `main` consumer actually using Palladio tokens and records the replacement direction: prototype, experiment, stress test, then promotion. | User + governance owner | Archive after the new lifecycle is approved. A future consumer-validation stage may be reintroduced as one promotion gate, not the sole strategy. | `docs/archive/spec-v0.1.md`; replacement `docs/experiments/validation-lifecycle.md` |

### Chapter 12 — Risks and limitations

| Old section | Class | Existing implementation / test / consumer evidence | Authority owner | Promotion or withdrawal condition | Proposed target |
|---|---|---|---|---|---|
| foundation overdesign, accent risk, light theme, pipeline cost (378–387) | Background narrative | Risks are useful context; some claims are contradicted or weakened by E2's lack of consumer evidence. | Governance owner | Convert only actionable, current risks into a risk register with owner, trigger, and review date; archive stale mitigations. | `docs/archive/spec-v0.1-context.md` |

### Chapter 13 — Completion criteria

| Old section | Class | Existing implementation / test / consumer evidence | Authority owner | Promotion or withdrawal condition | Proposed target |
|---|---|---|---|---|---|
| 13.1 Foundation completion checklist (391–397) | Disproved / superseded | E3/E4 show several checklist items are built; E2 shows implementation alone does not establish design completion. | User + governance owner | Replace with per-contract promotion evidence, not a one-time “Foundation complete” declaration. | `docs/experiments/validation-lifecycle.md`; archive old checklist |
| 13.2 design-language completion checklist (399–405) | Disproved / superseded | E2 refutes the implied completion state and lack of real consumer evidence. | User + governance owner | Replace with incremental promotion status per rule and consumer context; never mark the entire language complete from a single milestone. | `docs/experiments/validation-lifecycle.md`; archive old checklist |

## Required migration decisions

1. **Recommended: approve the five-class model and the `DECISIONS.md` / `docs/spec.md` split.** `DECISIONS.md` remains a concise decision index; `docs/spec.md` remains the current promoted, implementable contract. Put each rule in one authoritative location only. `docs/guardrails.md`, the accessibility contract, component READMEs, experiment records, and `DECISIONS.md` link to that source and do not duplicate full normative text.
2. **Recommended: adopt the following promotion-evidence framework, with consumer status as an evidence tag rather than a universal gate.** Safety and accessibility rules require source evidence, an automated check where feasible, and rendered evidence for visual behaviour. Visual rules require a state matrix, at least one stress context, rendered comparison, and an explicit user decision. Token/API contracts require implementation, build/artifact and contract-test evidence, a compatibility or migration decision, and rendered evidence when their effect is visual. Consumer integration and feedback records add a `consumer-validated` evidence tag; they are required only when the rule claims consumer-specific behaviour or readiness, not for every foundational rule.
3. **Recommended: retain existing token and API values during revalidation.** Maintain compatibility until an explicit replacement contract is promoted, with versioning and migration notes where required. The exception is a real security, accessibility, or correctness defect: correct it through an immediate release path and record the compatibility impact rather than preserving a harmful value.
4. **Recommended: use `docs/guardrails.md`, `docs/spec.md`, `docs/experiments/README.md`, `docs/experiments/YYYY-MM-DD-slug.md`, and `docs/archive/`.** Do not create `docs/governance/`. Keep `palladio/docs/accessibility/accessibility-contract.md` as the authoritative procedural accessibility contract, linked from `docs/guardrails.md` and `docs/spec.md` where relevant.

## Suggested revision order after approval

1. Adopt the authority model and promotion template without deleting or moving existing sources.
2. Create the experiment lifecycle and one pilot experiment for a contested visual rule, such as navigation geometry or grouping priority.
3. Reclassify chapter-11 and chapter-13 completion language after the pilot demonstrates the lifecycle.
4. Migrate promoted token and accessibility contracts with redirects/cross-references; regenerate and validate agent-reference links in the same change.
5. Update `AGENTS.md`, README, component READMEs, accessibility-contract cross-references, and `DECISIONS.md` only after target paths and authority are approved.
6. Archive superseded prose with its evidence links; do not delete historical reports or failed experiment evidence.

## Limitations

- This review is repository-scoped. It did not re-query GitHub Issues, npm download data, or external consuming products; such evidence is marked unverified.
- E1 is a prior verify report, not a complete review under the new workflow. Its SR identifiers remain historical and are not reused for SR-101 onward.
- This file proposes classifications. The user retains every promotion, withdrawal, compatibility, and document-layout decision.
