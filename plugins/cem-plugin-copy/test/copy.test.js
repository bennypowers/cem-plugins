import ts from 'typescript';
import test from 'tape';

import { copyPlugin } from '../index.js';
import { create } from '@custom-elements-manifest/analyzer/src/create.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const getRelative = path => resolve(fileURLToPath(new URL(path, import.meta.url)));
const read = path => readFileSync(getRelative(path), 'utf8');

test('copyPlugin', function(t) {
  const path = './my-element.js';
  const source = read(path);

  const customElementsManifest = create({
    modules: [ts.createSourceFile(path, source, ts.ScriptTarget.ES2015, true)],
    plugins: [copyPlugin({
      from: import.meta.url,
      to: './a/place/i/know/',
      quiet: true,
    })],
  });

  t.plan(1);
  t.deepEqual(
    JSON.parse(read('./a/place/i/know/test/custom-elements.json')),
    customElementsManifest
  );
});
