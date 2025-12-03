import fs from 'fs/promises';
import { globSync } from 'glob';

const files = globSync('./tests/gql/**/*.ts', { cwd: process.cwd() });

for (const file of files) {
  let content = await fs.readFile(file, 'utf-8');
  content = content.replace(/from (['"])(\.\/.*)\.js\1/g, 'from $1$2.ts$1');
  await fs.writeFile(file, content);
}

console.log(`Fixed import extensions in ${files.length} files`);
