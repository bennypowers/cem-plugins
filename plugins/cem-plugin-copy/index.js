import chalk from 'chalk';
import hirestime from 'hirestime';

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

function readJSONSync(path) {
  const url = new URL(path, import.meta.url);
  const content = readFileSync(url.toString().replace('file://', ''), 'utf-8');
  return JSON.parse(content);
}

/**
 * @typedef {object} Options
 * @property {string} configUrl path to custom-elements-manifest.config.js
 * @property {string} to relative path to from config to output dir
 * @property {boolean} quiet suppress logs
 */

/**
 * @param  {Options} options
 * @return {import('@custom-elements-manifest/analyzer').Plugin}
 */
export function copyPlugin({ from, to, quiet }) {
  return {
    name: 'copy',
    packageLinkPhase({ customElementsManifest }) {
      const time = hirestime.default();

      const pkgDirPath = dirname(fileURLToPath(new URL(from)));
      const pkgJsonPath = join(pkgDirPath, 'package.json');

      const { name } = readJSONSync(pkgJsonPath);

      // TODO: get package root here.
      const outDir = join(fileURLToPath(new URL(to, from)), `${name}/`);

      mkdirSync(outDir, { recursive: true });

      copyFileSync(pkgJsonPath, join(outDir, 'package.json'));
      writeFileSync(
        join(outDir, 'custom-elements.json'),
        JSON.stringify(customElementsManifest, null, 2)
      );

      if (!quiet)
        console.log(chalk.green`Copied manifest and package for ${chalk.bold(name)} in ${time.seconds()}s`);
    },
  };
}
