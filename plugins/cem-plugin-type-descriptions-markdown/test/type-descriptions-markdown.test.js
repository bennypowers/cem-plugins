import ts from 'typescript';
import test from 'tape';

import { typeDescriptionsMarkdownPlugin } from '../index.js';
import { create } from '@custom-elements-manifest/analyzer/src/create.js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const getRelative = path => resolve(fileURLToPath(new URL(path, import.meta.url)));
const read = path => readFileSync(getRelative(path), 'utf8');

test('typeDescriptionsMarkdownPlugin', function(t) {
  const path = './shoe-sizer.ts';
  const source = read(path);
  const expected = JSON.parse(read('./expected.json'));

  const customElementsManifest = create({
    modules: [ts.createSourceFile(path, source, ts.ScriptTarget.ES2015, true)],
    plugins: [typeDescriptionsMarkdownPlugin({
      typeTablesDir: fileURLToPath(new URL('./type-tables/', import.meta.url)),
      quiet: true,
    })],
  });

  writeFileSync(getRelative('./output.json'), JSON.stringify(customElementsManifest, null, 2));

  t.plan(1);
  t.deepEqual(customElementsManifest, expected);
});
