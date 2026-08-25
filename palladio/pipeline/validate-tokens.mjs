/**
 * Token Validation Script for Palladio Design System (DTCG 2025.10 Compliant)
 * Validates:
 * 1. DTCG 2025.10 format compliance:
 *    - Token/Group metadata uses $value, $type, $description (no legacy non-$ metadata properties).
 *    - Strict payload type verification:
 *      - dimension: { value: number, unit: "px" | "rem" } (rejects "em" or raw strings)
 *      - duration: { value: number, unit: "ms" | "s" } (rejects raw strings)
 *      - number: JSON number (e.g. 1.0, 1.2, 1.35)
 *      - fontWeight: JSON number (e.g. 400, 500, 600)
 *      - fontFamily: string or string[]
 *      - cubicBezier: [number, number, number, number]
 *      - color: { colorSpace: "srgb", components: [r, g, b], hex?: string, alpha?: number } (rejects raw hex strings)
 *      - typography: composite object with fontFamily, fontSize, fontWeight, letterSpacing, lineHeight
 * 2. Dynamic reference resolution ({path.to.token}) for Layer 1 semantic tokens and themes.
 * 3. Exact coverage of specifications across all scales.
 * 4. Dynamic WCAG 2.1 contrast ratio verification using resolved semantic / theme color values (A-M1 >= 4.5:1).
 * 5. Isolation of Accent slots (ensuring dark theme and semantic tokens do NOT contain accent fallback values).
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
function srgbToLinear(c) {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function getLuminanceFromColor(colorObj) {
  if (colorObj && typeof colorObj === 'object' && Array.isArray(colorObj.components)) {
    const [r, g, b] = colorObj.components;
    const rL = srgbToLinear(r);
    const gL = srgbToLinear(g);
    const bL = srgbToLinear(b);
    return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
  }
  if (typeof colorObj === 'string' && colorObj.startsWith('#')) {
    const cleanHex = colorObj.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    const rL = srgbToLinear(r);
    const gL = srgbToLinear(g);
    const bL = srgbToLinear(b);
    return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
  }
  throw new Error('Unsupported color format for luminance: ' + JSON.stringify(colorObj));
}

function getContrastRatio(colorObj1, colorObj2) {
  const l1 = getLuminanceFromColor(colorObj1);
  const l2 = getLuminanceFromColor(colorObj2);
  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (brighter + 0.05) / (darker + 0.05);
}

console.log('=== Palladio DTCG 2025.10 Token Validation ===\n');

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

// 2. Validate DTCG format metadata across all files (check no legacy non-$ metadata properties)
function validateDtcgMetadata(obj, currentPath = '') {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return;

  for (const [key, val] of Object.entries(obj)) {
    const nodePath = currentPath ? `${currentPath}.${key}` : key;
    // Check if token/group level metadata incorrectly uses non-$ legacy fields
    if (['type', 'description'].includes(key)) {
      throw new Error(`Legacy metadata property "${key}" found at "${nodePath}". DTCG format requires "$${key}".`);
    }
    if (key === 'value' && !currentPath.endsWith('$value')) {
      throw new Error(`Legacy property "value" found at "${nodePath}". DTCG format requires "$value".`);
    }

    if (key !== '$value' && val && typeof val === 'object' && !Array.isArray(val)) {
      validateDtcgMetadata(val, nodePath);
    }
  }
}

for (const [name, data] of Object.entries(tokenFiles)) {
  validateDtcgMetadata(data, name);
}
console.log('✔ DTCG metadata verified: All tokens and groups use $value, $type, $description.');

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
  let inheritedType = undefined;
  for (const part of parts) {
    if (!current || typeof current !== 'object' || !(part in current)) {
      throw new Error(`Unresolved reference: "{${refPath}}" - part "${part}" not found in registry.`);
    }
    if (current.$type) inheritedType = current.$type;
    current = current[part];
  }

  if (current && typeof current === 'object' && '$value' in current) {
    const resolvedVal = resolveRef(current.$value, reg, new Set(visited));
    return resolvedVal;
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
    // If it is a dimension or duration object { value, unit }
    if ('value' in tokenVal && 'unit' in tokenVal && Object.keys(tokenVal).length === 2) {
      return {
        value: resolveTokenValue(tokenVal.value, reg),
        unit: resolveTokenValue(tokenVal.unit, reg)
      };
    }
    // If it is a color object { colorSpace, components, ... }
    if ('colorSpace' in tokenVal && 'components' in tokenVal) {
      return tokenVal;
    }
    const resolvedObj = {};
    for (const [k, v] of Object.entries(tokenVal)) {
      resolvedObj[k] = resolveTokenValue(v, reg);
    }
    return resolvedObj;
  }
  return tokenVal;
}

// 4. Validate DTCG Payload Types (Strict DTCG 2025.10 specifications)
function validatePayloadType(type, val, tokenPath) {
  if (typeof val === 'string' && val.startsWith('{') && val.endsWith('}')) {
    // Valid alias
    return;
  }

  switch (type) {
    case 'dimension': {
      if (!val || typeof val !== 'object' || typeof val.value !== 'number' || !['px', 'rem'].includes(val.unit)) {
        throw new Error(`Invalid DTCG dimension payload at "${tokenPath}": expected { value: number, unit: "px"|"rem" }, got ${JSON.stringify(val)}`);
      }
      break;
    }
    case 'duration': {
      if (!val || typeof val !== 'object' || typeof val.value !== 'number' || !['ms', 's'].includes(val.unit)) {
        throw new Error(`Invalid DTCG duration payload at "${tokenPath}": expected { value: number, unit: "ms"|"s" }, got ${JSON.stringify(val)}`);
      }
      break;
    }
    case 'number': {
      if (typeof val !== 'number') {
        throw new Error(`Invalid DTCG number payload at "${tokenPath}": expected JSON number, got ${typeof val} (${JSON.stringify(val)})`);
      }
      break;
    }
    case 'fontWeight': {
      if (typeof val !== 'number' && typeof val !== 'string') {
        throw new Error(`Invalid DTCG fontWeight payload at "${tokenPath}": expected number or string, got ${typeof val}`);
      }
      break;
    }
    case 'fontFamily': {
      if (typeof val !== 'string' && !Array.isArray(val)) {
        throw new Error(`Invalid DTCG fontFamily payload at "${tokenPath}": expected string or string[], got ${typeof val}`);
      }
      break;
    }
    case 'cubicBezier': {
      if (!Array.isArray(val) || val.length !== 4 || !val.every(n => typeof n === 'number')) {
        throw new Error(`Invalid DTCG cubicBezier payload at "${tokenPath}": expected [x1, y1, x2, y2] numbers, got ${JSON.stringify(val)}`);
      }
      break;
    }
    case 'color': {
      if (
        !val ||
        typeof val !== 'object' ||
        val.colorSpace !== 'srgb' ||
        !Array.isArray(val.components) ||
        val.components.length !== 3 ||
        !val.components.every(n => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 1) ||
        (val.alpha !== undefined && (typeof val.alpha !== 'number' || !Number.isFinite(val.alpha) || val.alpha < 0 || val.alpha > 1)) ||
        (val.hex !== undefined && (typeof val.hex !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(val.hex)))
      ) {
        throw new Error(`Invalid DTCG color payload at "${tokenPath}": expected srgb components and alpha in [0, 1] plus a 6-digit CSS hex, got ${JSON.stringify(val)}`);
      }
      break;
    }
    case 'typography': {
      if (!val || typeof val !== 'object') {
        throw new Error(`Invalid DTCG typography payload at "${tokenPath}": expected composite object, got ${typeof val}`);
      }
      const required = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'];
      for (const req of required) {
        if (!(req in val)) {
          throw new Error(`Invalid DTCG typography payload at "${tokenPath}": missing required property "${req}".`);
        }
      }
      break;
    }
  }
}

function traverseAndValidateTypes(obj, inheritedType = undefined, currentPath = '') {
  if (!obj || typeof obj !== 'object') return;
  const currentType = obj.$type || inheritedType;

  if ('$value' in obj) {
    validatePayloadType(currentType, obj.$value, currentPath);
  }

  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object') {
      traverseAndValidateTypes(v, currentType, currentPath ? `${currentPath}.${k}` : k);
    }
  }
}

for (const [name, data] of Object.entries(tokenFiles)) {
  traverseAndValidateTypes(data, undefined, name);
}
console.log('✔ DTCG 2025.10 Payload types verified: color (srgb object), dimension (px/rem), duration (ms/s), number, cubicBezier, fontFamily, typography.');

// 5. Validate Primitive Scales content
const expectedCharcoal = {
  '950': '#141414', '900': '#1C1C1C', '850': '#242424', '800': '#2E2E2E', '750': '#323232',
  '700': '#333333', '600': '#484848', '450': '#969696', '400': '#9A9A9A', '100': '#F0F0F0'
};
for (const [key, expectedHex] of Object.entries(expectedCharcoal)) {
  const actualColor = resolveRef(`{color.charcoal.${key}}`, registry);
  if (actualColor.hex !== expectedHex || actualColor.colorSpace !== 'srgb') {
    throw new Error(`Primitive charcoal.${key} expected hex ${expectedHex} in srgb but got ${JSON.stringify(actualColor)}`);
  }
}
console.log('✔ Primitive charcoal ladder verified (10 steps, DTCG colorSpace srgb).');

// Space scale
const expectedSpaces = {
  '1': 4, '2': 8, '3': 12, '4': 16, '5': 20,
  '6': 24, '8': 32, '10': 40, '12': 48, '16': 64
};
for (const [key, expectedVal] of Object.entries(expectedSpaces)) {
  const actual = resolveRef(`{space.${key}}`, registry);
  if (actual.value !== expectedVal || actual.unit !== 'px') {
    throw new Error(`Primitive space.${key} expected {value: ${expectedVal}, unit: 'px'} but got ${JSON.stringify(actual)}`);
  }
}
console.log('✔ Primitive space scale verified (4px base unit, dimension objects).');

// Radius scale
const expectedRadii = {
  'none': 0, 'sm': 4, 'md': 8, 'lg': 12, 'xl': 16, 'full': 9999
};
for (const [key, expectedVal] of Object.entries(expectedRadii)) {
  const actual = resolveRef(`{radius.${key}}`, registry);
  if (actual.value !== expectedVal || actual.unit !== 'px') {
    throw new Error(`Primitive radius.${key} expected {value: ${expectedVal}, unit: 'px'} but got ${JSON.stringify(actual)}`);
  }
}
console.log('✔ Primitive radius scale verified (dimension objects).');

// Motion duration & easing
const expectedDurations = { 'instant': 0, 'fast': 120, 'normal': 220, 'slow': 380 };
for (const [key, expectedVal] of Object.entries(expectedDurations)) {
  const actual = resolveRef(`{duration.${key}}`, registry);
  if (actual.value !== expectedVal || actual.unit !== 'ms') {
    throw new Error(`Primitive duration.${key} expected {value: ${expectedVal}, unit: 'ms'} but got ${JSON.stringify(actual)}`);
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
console.log('✔ Primitive duration and easing scales verified (DTCG payloads).');

// 6. Verify ALL Semantic & Theme token references resolve cleanly
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

// 7. Verify typography letter-spacing preserves the specification's em values
const expectedTypographyLetterSpacing = {
  display: { fontSize: 32, em: -0.02 },
  'heading-lg': { fontSize: 24, em: -0.02 },
  'heading-md': { fontSize: 18, em: -0.01 },
  'heading-sm': { fontSize: 14, em: -0.01 },
  'body-lg': { fontSize: 16, px: 0 },
  'body-md': { fontSize: 14, px: 0 },
  'body-sm': { fontSize: 12, px: 0 },
  'label-md': { fontSize: 14, px: 0 },
  'label-sm': { fontSize: 12, px: 0 },
  mono: { fontSize: 13, px: 0 }
};
for (const [tokenName, expected] of Object.entries(expectedTypographyLetterSpacing)) {
  const typography = resolveTokenValue(tokenFiles['semantic/typography'].pd.text[tokenName].$value, registry);
  const expectedPx = expected.px ?? expected.fontSize * expected.em;
  if (typography.letterSpacing?.unit !== 'px' || typography.letterSpacing.value !== expectedPx) {
    throw new Error(`Typography ${tokenName} letter-spacing expected { value: ${expectedPx}, unit: "px" } but got ${JSON.stringify(typography.letterSpacing)}`);
  }
}
console.log('✔ Typography letter-spacing preserves spec em equivalents as px dimensions.');

// 8. Accent Isolation Verification
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

// 9. Dynamic WCAG Contrast Ratio Verification (A-M1 >= 4.5:1)
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

// Check parity
for (const key of Object.keys(resolvedTextColors)) {
  const semVal = resolveRef(semColors[key].$value, registry);
  if (semVal.hex !== resolvedTextColors[key].hex) {
    throw new Error(`Semantic token mismatch for ${key}: semantic=${semVal.hex}, dark theme=${resolvedTextColors[key].hex}`);
  }
}

console.log('\n--- Dynamic WCAG Contrast Ratio Check (A-M1 >= 4.5:1 on all surfaces) ---');
for (const [surfName, surfObj] of Object.entries(resolvedSurfaces)) {
  for (const [textName, textObj] of Object.entries(resolvedTextColors)) {
    const ratio = getContrastRatio(textObj, surfObj);
    console.log(`[Text] ${textName} (${textObj.hex}) on ${surfName} (${surfObj.hex}) => ${ratio.toFixed(2)}:1`);
    if (ratio < 4.5) {
      throw new Error(`A-M1 Contrast failure: ${textName} on ${surfName} is ${ratio.toFixed(2)}:1 (< 4.5:1)`);
    }
  }
  for (const [statusName, statusObj] of Object.entries(resolvedStatusColors)) {
    const ratio = getContrastRatio(statusObj, surfObj);
    console.log(`[Status] ${statusName} (${statusObj.hex}) on ${surfName} (${surfObj.hex}) => ${ratio.toFixed(2)}:1`);
    if (ratio < 4.5) {
      throw new Error(`A-M1 Contrast failure: ${statusName} on ${surfName} is ${ratio.toFixed(2)}:1 (< 4.5:1)`);
    }
  }
}
console.log('✔ All dynamic WCAG A-M1 contrast ratios >= 4.5:1 verified.');

console.log('\n========================================');
console.log('🎉 All DTCG 2025.10 Token Checks Passed!');
console.log('========================================\n');
