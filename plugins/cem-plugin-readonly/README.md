# cem-plugin-readonly

Adds (non-standard) "readonly" flag to class fields

## Example

`custom-elements-manifest.config.js`
```js
import { readonlyPlugin } from 'cem-plugin-readonly';

export default {
  plugins: [
    readonlyPlugin(),
  ]
}
```

`read-only.ts`
```ts
/** @element read-only */
export class ReadOnly {
  static get x() { return 'x'; }
  static readonly y = 'y';
  /** @readonly */
  static z = 'z';
  readonly x = 'x';
  get y() { return 'y'; }
  /** @readonly */
  z = 'z';
}
```

### Output
```json
{
  "schemaVersion": "1.0.0",
  "readme": "",
  "modules": [
    {
      "kind": "javascript-module",
      "path": "read-only.js",
      "declarations": [
        {
          "kind": "class",
          "description": "",
          "name": "ReadOnly",
          "members": [
            {
              "kind": "field",
              "name": "x",
              "readonly": true,
              "type": {
                "text": "string"
              }
            },
            {
              "kind": "field",
              "name": "y",
              "readonly": true,
              "type": {
                "text": "string"
              }
            },
            {
              "kind": "field",
              "name": "z",
              "readonly": true,
              "type": {
                "text": "string"
              }
            }
          ],
          "tagName": "read-only",
          "customElement": true
        }
      ],
      "exports": [
        {
          "kind": "js",
          "name": "ReadOnly",
          "declaration": {
            "name": "ReadOnly",
            "module": "read-only.js"
          }
        }
      ]
    }
  ]
}
```
