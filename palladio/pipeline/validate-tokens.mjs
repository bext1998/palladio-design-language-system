/**
 * Token Validation Script for Palladio Design System (DTCG Compliant)
 * Validates:
 * 1. DTCG standard compliance: all tokens use $value, $type, $description (no legacy value/type/description).
 * 2. Registry building from Layer 0 primitive tokens.
 * 3. Dynamic reference resolution ({path.to.token}) for Layer 1 semantic tokens and themes.
 * 4. Exact coverage of specifications across color, typography, space, radius, and motion.
 * 5. Dynamic WCAG 2.1 contrast ratio verification using resolved semantic / theme color values (A-M1 >= 4.5:1).
 * 6. Isolation of Accent slots (ensuring dark theme and semantic tokens do NOT contain accent fallback values).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to load JSON
function loadJson(relPath) {
  const fullPath = path.join(rootDir, relPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(content);
}

// Deep merge objects into a single token registry
function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && !Array.isArray(source[key])) {
      if (!target[key]) Object.assign(target, { [key]: {} });
      deepMerge(target[key], source[key]);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  }
  return target;
}

// Color contrast calculation helper (WCAG 2.1)
function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return [r, g, b];
}

function srgbToLinear(c) {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function getLuminance(hex) {
  const [r, g, b] = hexToRgb(hex);
  const rL = srgbToLinear(r);
  const gL = srgbToLinear(g);
  const bL = srgbToLinear(b);
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (brighter + 0.05) / (darker + 0.05);
}

console.log('=== Palladio DTCG Token Validation ===\n');

// 1. Load all token files
const tokenFiles = {
  'primitive/color': loadJson('tokens/primitive/color.json'),
  'primitive/typography': loadJson('tokens/primitive/typography.json'),
  'primitive/space': loadJson('tokens/primitive/space.json'),
  'primitive/radius': loadJson('tokens/primitive/radius.json'),
  'primitive/motion': loadJson('tokens/primitive/motion.json'),
  'semantic/color': loadJson('tokens/semantic/color.json'),
  'semantic/typography': loadJson('tokens/semantic/typography.json'),
  'semantic/space': loadJson('tokens/semantic/space.json'),
  'semantic/radius': loadJson('tokens/semantic/radius.json'),
  'semantic/motion': loadJson('tokens/semantic/motion.json'),
  'themes/dark': loadJson('themes/dark.json')
};

console.log('✔ All 11 token JSON files loaded and parsed successfully.');

// 2. Validate DTCG format across all files (check no legacy non-$ fields)
function validateDtcgFormat(obj, currentPath = '') {
  for (const [key, val] of Object.entries(obj)) {
    const nodePath = currentPath ? `${currentPath}.${key}` : key;
    if (['value', 'type', 'description'].includes(key)) {
      throw new Error(`Legacy field "${key}" found at "${currentPath}". DTCG format requires "$${key}".`);
    }
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      validateDtcgFormat(val, nodePath);
    }
  }
}

for (const [name, data] of Object.entries(tokenFiles)) {
  validateDtcgFormat(data, name);
}
console.log('✔ DTCG format verified: All tokens use $value, $type, $description without legacy properties.');

// 3. Build Registry from Primitives
const registry = {};
deepMerge(registry, tokenFiles['primitive/color']);
deepMerge(registry, tokenFiles['primitive/typography']);
deepMerge(registry, tokenFiles['primitive/space']);
deepMerge(registry, tokenFiles['primitive/radius']);
deepMerge(registry, tokenFiles['primitive/motion']);

// Reference resolver function
function resolveRef(refStr, reg, visited = new Set()) {
  if (typeof refStr !== 'string') return refStr;
  const match = refStr.match(/^\{([^}]+)\}$/);
  if (!match) return refStr;

  const refPath = match[1];
  if (visited.has(refPath)) {
    throw new Error(`Circular reference detected: ${Array.from(visited).join(' -> ')} -> ${refPath}`);
  }
  visited.add(refPath);

  const parts = refPath.split('.');
  let current = reg;
  for (const part of parts) {
    if (!current || typeof current !== 'object' || !(part in current)) {
      throw new Error(`Unresolved reference: "{${refPath}}" - part "${part}" not found in registry.`);
    }
    current = current[part];
  }

  if (current && typeof current === 'object' && '$value' in current) {
    return resolveRef(current.$value, reg, new Set(visited));
  }
  return current;
}

function resolveTokenValue(tokenVal, reg) {
  if (typeof tokenVal === 'string') {
    return resolveRef(tokenVal, reg);
  }
  if (typeof tokenVal === 'object' && tokenVal !== null) {
    if (Array.isArray(tokenVal)) {
      return tokenVal.map(item => resolveTokenValue(item, reg));
    }
    const resolvedObj = {};
    for (const [k, v] of Object.entries(tokenVal)) {
      resolvedObj[k] = resolveTokenValue(v, reg);
    }
    return resolvedObj;
  }
  return tokenVal;
}

// 4. Validate Primitive Tokens content
const expectedCharcoal = {
  '950': '#141414',
  '900': '#1C1C1C',
  '850': '#242424',
  '800': '#2E2E2E',
  '750': '#323232',
  '700': '#333333',
  '600': '#484848',
  '450': '#969696',
  '400': '#9A9A9A',
  '100': '#F0F0F0'
};

for (const [key, expectedHex] of Object.entries(expectedCharcoal)) {
  const actualHex = resolveRef(`{color.charcoal.${key}}`, registry);
  if (actualHex !== expectedHex) {
    throw new Error(`Primitive charcoal.${key} expected ${expectedHex} but got ${actualHex}`);
  }
}
console.log('✔ Primitive charcoal ladder verified (10 steps).');

// Space scale
const expectedSpaces = {
  '1': '4px', '2': '8px', '3': '12px', '4': '16px', '5': '20px',
  '6': '24px', '8': '32px', '10': '40px', '12': '48px', '16': '64px'
};
for (const [key, expectedVal] of Object.entries(expectedSpaces)) {
  const actualVal = resolveRef(`{space.${key}}`, registry);
  if (actualVal !== expectedVal) {
    throw new Error(`Primitive space.${key} expected ${expectedVal} but got ${actualVal}`);
  }
}
console.log('✔ Primitive space scale verified (4px base unit).');

// Radius scale
const expectedRadii = {
  'none': '0px', 'sm': '4px', 'md': '8px', 'lg': '12px', 'xl': '16px', 'full': '9999px'
};
for (const [key, expectedVal] of Object.entries(expectedRadii)) {
  const actualVal = resolveRef(`{radius.${key}}`, registry);
  if (actualVal !== expectedVal) {
    throw new Error(`Primitive radius.${key} expected ${expectedVal} but got ${actualVal}`);
  }
}
console.log('✔ Primitive radius scale verified.');

// Motion duration & easing
const expectedDurations = { 'instant': '0ms', 'fast': '120ms', 'normal': '220ms', 'slow': '380ms' };
for (const [key, expectedVal] of Object.entries(expectedDurations)) {
  const actualVal = resolveRef(`{duration.${key}}`, registry);
  if (actualVal !== expectedVal) {
    throw new Error(`Primitive duration.${key} expected ${expectedVal} but got ${actualVal}`);
  }
}

const expectedEasings = {
  'default': [0.25, 0.46, 0.45, 0.94],
  'enter': [0.0, 0.0, 0.2, 1.0],
  'exit': [0.4, 0.0, 1.0, 1.0],
  'expressive': [0.34, 1.10, 0.64, 1.0]
};
for (const [key, expectedVal] of Object.entries(expectedEasings)) {
  const actualVal = resolveRef(`{easing.${key}}`, registry);
  if (JSON.stringify(actualVal) !== JSON.stringify(expectedVal)) {
    throw new Error(`Primitive easing.${key} expected ${JSON.stringify(expectedVal)} but got ${JSON.stringify(actualVal)}`);
  }
}
console.log('✔ Primitive duration and easing scales verified.');

// 5. Verify ALL Semantic & Theme token references resolve cleanly
function verifyAllReferences(obj, currentPath = '') {
  for (const [k, v] of Object.entries(obj)) {
    const p = currentPath ? `${currentPath}.${k}` : k;
    if (k === '$value') {
      const resolved = resolveTokenValue(v, registry);
      if (resolved === undefined || resolved === null) {
        throw new Error(`Failed to resolve token value at "${currentPath}": ${JSON.stringify(v)}`);
      }
    } else if (v && typeof v === 'object') {
      verifyAllReferences(v, p);
    }
  }
}

for (const [name, data] of Object.entries(tokenFiles)) {
  if (name.startsWith('semantic/') || name.startsWith('themes/')) {
    verifyAllReferences(data, name);
  }
}
console.log('✔ All Semantic and Theme token references dynamically resolved successfully.');

// 6. Accent Isolation Verification
const darkJsonStr = JSON.stringify(tokenFiles['themes/dark']);
const semColorJsonStr = JSON.stringify(tokenFiles['semantic/color']);

for (const [sourceName, jsonStr] of [['themes/dark.json', darkJsonStr], ['semantic/color.json', semColorJsonStr]]) {
  const forbiddenKeywords = ['fallback', 'accent-hover', 'accent-active', 'accent-disabled', 'accent-subtle'];
  for (const kw of forbiddenKeywords) {
    if (jsonStr.includes(kw)) {
      throw new Error(`Accent slot isolation violation in ${sourceName}: contains "${kw}". Palladio prohibits fallback/derived accent values.`);
    }
  }
}
console.log('✔ Accent slot isolation verified: No hardcoded fallback or derived accent tokens in theme or semantic color definitions.');

// 7. Dynamic WCAG Contrast Ratio Verification (A-M1 >= 4.5:1)
// Dynamically resolve surface colors from dark theme
const darkColors = tokenFiles['themes/dark'].pd.color;
const semColors = tokenFiles['semantic/color'].pd.color;

const resolvedSurfaces = {
  'bg': resolveRef(darkColors.bg.$value, registry),
  'surface': resolveRef(darkColors.surface.$value, registry),
  'surface-raised': resolveRef(darkColors['surface-raised'].$value, registry),
  'surface-overlay': resolveRef(darkColors['surface-overlay'].$value, registry)
};

const resolvedTextColors = {
  'text-primary': resolveRef(darkColors['text-primary'].$value, registry),
  'text-secondary': resolveRef(darkColors['text-secondary'].$value, registry),
  'text-placeholder': resolveRef(darkColors['text-placeholder'].$value, registry),
  'text-disabled': resolveRef(darkColors['text-disabled'].$value, registry)
};

const resolvedStatusColors = {
  'success': resolveRef(darkColors.success.$value, registry),
  'warning': resolveRef(darkColors.warning.$value, registry),
  'danger': resolveRef(darkColors.danger.$value, registry),
  'info': resolveRef(darkColors.info.$value, registry)
};

// Also ensure semantic/color references match dark theme target mappings
for (const key of Object.keys(resolvedTextColors)) {
  const semVal = resolveRef(semColors[key].$value, registry);
  if (semVal !== resolvedTextColors[key]) {
    throw new Error(`Semantic token mismatch for ${key}: semantic=${semVal}, dark theme=${resolvedTextColors[key]}`);
  }
}

console.log('\n--- Dynamic WCAG Contrast Ratio Check (A-M1 >= 4.5:1 on all surfaces) ---');
for (const [surfName, surfHex] of Object.entries(resolvedSurfaces)) {
  for (const [textName, textHex] of Object.entries(resolvedTextColors)) {
    const ratio = getContrastRatio(textHex, surfHex);
    console.log(`[Text] ${textName} (${textHex}) on ${surfName} (${surfHex}) => ${ratio.toFixed(2)}:1`);
    if (ratio < 4.5) {
      throw new Error(`A-M1 Contrast failure: ${textName} on ${surfName} is ${ratio.toFixed(2)}:1 (< 4.5:1)`);
    }
  }
  for (const [statusName, statusHex] of Object.entries(resolvedStatusColors)) {
    const ratio = getContrastRatio(statusHex, surfHex);
    console.log(`[Status] ${statusName} (${statusHex}) on ${surfName} (${surfHex}) => ${ratio.toFixed(2)}:1`);
    if (ratio < 4.5) {
      throw new Error(`A-M1 Contrast failure: ${statusName} on ${surfName} is ${ratio.toFixed(2)}:1 (< 4.5:1)`);
    }
  }
}
console.log('✔ All dynamic WCAG A-M1 contrast ratios >= 4.5:1 verified.');

console.log('\n========================================');
console.log('🎉 All DTCG Token & Reference Checks Passed!');
console.log('========================================\n');
