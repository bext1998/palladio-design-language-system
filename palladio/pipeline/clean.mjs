import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

for (const relativePath of ['css/palladio.css', 'ts/tokens.ts', 'json/tokens.json', 'agent-reference.md']) {
  fs.rmSync(path.join(distDir, relativePath), { force: true });
}
