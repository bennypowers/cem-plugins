# cem-plugin-copy

Copies `custom-elements.json` and `package.json` to `outdir/${packageName}`.

## Options

| Option | Type    | Description |
| ------ | ------- | ---------------- |
| from   | string  | config file's `import.meta.url` |
| to     | string  | path to copy files to. Files will be written to `to/${packageName}` |
| quiet  | boolean | suppress logs |

## Example


`custom-elements-manifest.config.js`
```js
import { copyPlugin } from 'cem-plugin-copy';

export default {
  plugins: [
    copyPlugin({ from: import.meta.url, to: './docs/_data/customElementsManifests/' }),
  ]
}
```
