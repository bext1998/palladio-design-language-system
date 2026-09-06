#!/usr/bin/env node
/**
 * skill lint — checks this skill's own integrity, not the consuming codebase.
 *
 *   node skills/palladio-design-tokens/scripts/check-skill.mjs
 *
 * Verifies:
 *  - SKILL.md has YAML frontmatter with non-empty `name` and `description`
 *  - `name` matches the directory name
 *  - no AI-vendor / tool names anywhere (keeps the skill harness-neutral)
 *  - SKILL.md gives no `node_modules/...` instruction path (that belongs in
 *    references/integration.md, which is per-environment)
 *  - every relative link in SKILL.md and references/*.md resolves on disk
 *
 * It deliberately does NOT try to prove the consuming project uses tokens
 * correctly — that is a per-product lint (accent slots, contrast, format).
 */

import { readFileSync, existsSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillName = path.basename(skillDir);
const errors = [];

const skillMd = path.join(skillDir, 'SKILL.md');
if (!existsSync(skillMd)) {
  console.error('FAIL: SKILL.md missing');
  process.exit(1);
}
const src = readFileSync(skillMd, 'utf8');

// frontmatter
const fm = src.match(/^---\n([\s\S]*?)\n---\n/);
if (!fm) {
  errors.push('SKILL.md has no YAML frontmatter block');
} else {
  const name = (fm[1].match(/^name:\s*(.+)$/m) || [])[1]?.trim();
  const desc = (fm[1].match(/^description:\s*(.+)$/m) || [])[1]?.trim();
  if (!name) errors.push('frontmatter: `name` missing or empty');
  else if (name !== skillName) errors.push(`frontmatter: name "${name}" != directory "${skillName}"`);
  if (!desc) errors.push('frontmatter: `description` missing or empty');
}

// vendor / tool names — the skill must stay harness-neutral
const VENDORS = /\b(claude|anthropic|cursor|copilot|openai|gpt-4|gemini|codeium|windsurf|aider|zed)\b/i;
const mdFiles = [
  skillMd,
  ...readdirSync(path.join(skillDir, 'references'))
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(skillDir, 'references', f)),
];
for (const f of mdFiles) {
  const text = readFileSync(f, 'utf8');
  const hit = text.match(VENDORS);
  if (hit) errors.push(`${path.relative(skillDir, f)}: mentions "${hit[0]}" — keep the skill vendor-neutral`);
  // relative links
  for (const m of text.matchAll(/\]\((?!https?:|#)([^)]+)\)/g)) {
    const target = m[1].split('#')[0];
    if (!target) continue;
    const resolved = path.resolve(path.dirname(f), target);
    if (!existsSync(resolved)) errors.push(`${path.relative(skillDir, f)}: dead link -> ${target}`);
  }
}

// node_modules path only allowed outside SKILL.md
if (/node_modules\//.test(src)) {
  errors.push('SKILL.md: has a `node_modules/...` path — move ecosystem-specific paths to references/integration.md');
}

if (errors.length) {
  console.error('skill lint FAILED:');
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`skill lint OK (${skillName})`);
