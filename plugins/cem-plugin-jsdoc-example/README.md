# cem-plugin-jsdoc-example

Adds (non-standard) "jsdoc-example" flag to class fields

## Example

`custom-elements-manifest.config.js`
```js
import { jsdocExamplePlugin } from 'cem-plugin-jsdoc-example';

export default {
  plugins: [
    jsdocExamplePlugin(),
  ]
}
```

`thing-doer.js`
```ts
/**
 * @element thing-doer
 * @example Do a thing
 * ```html
 * <thing-doer></thing-doer>
 * ```
 */
export class ThingDoer { }
```

### Output
```json
{
  "schemaVersion": "1.0.0",
  "readme": "",
  "modules": [
    {
      "kind": "javascript-module",
      "path": "thing-doer.js",
      "declarations": [
        {
          "kind": "class",
          "description": "## Examples\n\n### Do a thing\n```html\n<thing-doer></thing-doer>\n```",
          "name": "ThingDoer",
          "tagName": "thing-doer",
          "customElement": true
        }
      ],
      "exports": [
        {
          "kind": "js",
          "name": "ThingDoer",
          "declaration": {
            "name": "ThingDoer",
            "module": "thing-doer.js"
          }
        }
      ]
    }
  ]
}
```
