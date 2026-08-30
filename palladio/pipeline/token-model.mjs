import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export function deepMerge(target, source) {
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

export function loadJsonFrom(root, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

export function loadTokenSources(sourceRoot = rootDir) {
  const sourceRootResolved = path.resolve(rootDir, sourceRoot);
  const semanticFiles = [
    'tokens/semantic/color.json',
    'tokens/semantic/typography.json',
    'tokens/semantic/space.json',
    'tokens/semantic/radius.json',
    'tokens/semantic/motion.json'
  ];
  const densityFiles = {
    compact: 'tokens/semantic/density/compact.json',
    default: 'tokens/semantic/density/default.json',
    spacious: 'tokens/semantic/density/spacious.json'
  };

  const primitive = {};
  for (const file of [
    'tokens/primitive/color.json',
    'tokens/primitive/typography.json',
    'tokens/primitive/space.json',
    'tokens/primitive/radius.json',
    'tokens/primitive/motion.json'
  ]) {
    deepMerge(primitive, loadJsonFrom(sourceRootResolved, file));
  }

  const semantic = {};
  for (const file of semanticFiles) {
    deepMerge(semantic, loadJsonFrom(sourceRootResolved, file));
  }

  const density = {};
  for (const [name, file] of Object.entries(densityFiles)) {
    density[name] = loadJsonFrom(sourceRootResolved, file);
  }

  const theme = { dark: loadJsonFrom(sourceRootResolved, 'themes/dark.json') };
  return { primitive, semantic, density, theme };
}

export function collectTokenPaths(tokenTree, currentPath = '') {
  const paths = [];
  if (!tokenTree || typeof tokenTree !== 'object' || Array.isArray(tokenTree)) return paths;
  if ('$value' in tokenTree) return [currentPath];
  for (const [key, value] of Object.entries(tokenTree)) {
    if (key.startsWith('$')) continue;
    paths.push(...collectTokenPaths(value, currentPath ? `${currentPath}.${key}` : key));
  }
  return paths;
}

export function resolveRef(refStr, registry, visited = new Set()) {
  if (typeof refStr !== 'string') return refStr;
  const match = refStr.match(/^\{([^}]+)\}$/);
  if (!match) return refStr;

  const refPath = match[1];
  if (visited.has(refPath)) {
    throw new Error(`Circular reference detected: ${Array.from(visited).join(' -> ')} -> ${refPath}`);
  }
  visited.add(refPath);

  const parts = refPath.split('.');
  let current = registry;
  for (const part of parts) {
    if (!current || typeof current !== 'object' || !(part in current)) {
      throw new Error(`Unresolved reference: "{${refPath}}" - part "${part}" not found in registry.`);
    }
    current = current[part];
  }

  if (current && typeof current === 'object' && '$value' in current) {
    return resolveRef(current.$value, registry, new Set(visited));
  }
  return current;
}

export function resolveTokenValue(tokenValue, registry) {
  if (typeof tokenValue === 'string') return resolveRef(tokenValue, registry);
  if (Array.isArray(tokenValue)) return tokenValue.map((item) => resolveTokenValue(item, registry));
  if (tokenValue && typeof tokenValue === 'object') {
    if ('value' in tokenValue && 'unit' in tokenValue && Object.keys(tokenValue).length === 2) {
      return {
        value: resolveTokenValue(tokenValue.value, registry),
        unit: resolveTokenValue(tokenValue.unit, registry)
      };
    }
    if ('colorSpace' in tokenValue && 'components' in tokenValue) return tokenValue;
    const resolved = {};
    for (const [key, value] of Object.entries(tokenValue)) {
      resolved[key] = resolveTokenValue(value, registry);
    }
    return resolved;
  }
  return tokenValue;
}

export function collectTokenRecords(tokenTree, registry, currentPath = '', inheritedType, inheritedDescription) {
  const records = [];
  if (!tokenTree || typeof tokenTree !== 'object' || Array.isArray(tokenTree)) return records;
  const type = tokenTree.$type ?? inheritedType;
  const description = tokenTree.$description ?? inheritedDescription;
  if ('$value' in tokenTree) {
    records.push({ path: currentPath, value: resolveTokenValue(tokenTree.$value, registry), type, description });
    return records;
  }
  for (const [key, value] of Object.entries(tokenTree)) {
    if (key.startsWith('$')) continue;
    records.push(...collectTokenRecords(value, registry, currentPath ? `${currentPath}.${key}` : key, type, description));
  }
  return records;
}
