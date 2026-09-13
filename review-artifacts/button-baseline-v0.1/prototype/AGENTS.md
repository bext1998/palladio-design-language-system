# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Button validation decisions

- Preserve the State Observatory three-column information architecture and the Button State Matrix / Button Context Corridor as two distinct views.
- Primary, Secondary, and Tertiary share one DOM anatomy and interaction model across deep charcoal, metal gray, and crescent white.
- Tertiary focus-visible stays linear and never gains a closed rectangular container.
- Disabled state must not add an icon or other anatomy; loading may replace content with an inline progress indicator while preserving the label and footprint.
- Theme comparisons must keep every non-theme state identical.
- Prototype-only theme fixtures are validation inputs, not Palladio token proposals or formal specification values.
- Accessibility results remain pending until exercised against the rendered prototype.
