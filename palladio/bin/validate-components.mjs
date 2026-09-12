#!/usr/bin/env node

import fs from 'node:fs/promises';
import { validateComponentHtml } from '../dist/validate-components.js';

const args = process.argv.slice(2);
const components = [];
const files = [];

for (let index = 0; index < args.length; index += 1) {
  const argument = args[index];
  if (argument === '--component') {
    const component = args[index + 1];
    if (!component) {
      console.error('Missing component name after --component.');
      process.exitCode = 2;
      break;
    }
    components.push(component);
    index += 1;
  } else if (argument.startsWith('--component=')) {
    components.push(argument.slice('--component='.length));
  } else {
    files.push(argument);
  }
}

if (process.exitCode || files.length === 0) {
  if (!process.exitCode) {
    console.error('Usage: palladio-validate-components [--component <name>]... <html-file>...');
    process.exitCode = 2;
  }
} else {
  let hasErrors = false;
  for (const file of files) {
    const html = await fs.readFile(file, 'utf8');
    const errors = validateComponentHtml(html, { components });
    for (const error of errors) {
      console.error(`${file}: ${error}`);
    }
    hasErrors ||= errors.length > 0;
  }
  if (hasErrors) process.exitCode = 1;
}
