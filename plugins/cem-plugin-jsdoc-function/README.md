# cem-plugin-jsdoc-function

Allows JSDoc `@function` tag to override variable declarations

## Example

`custom-elements-manifest.config.js`
```js
import { jsdocFunctionPlugin } from 'cem-plugin-jsdoc-function';

export default {
  plugins: [
    jsdocFunctionPlugin(),
  ]
}
```

`jsdoc-function.ts`
```js
/**
 * @function
 * @template T
 * @param {T} x
 * @return T
 */
export const identity = x => x;
```

### Output
```json
{
  "schemaVersion": "1.0.0",
  "readme": "",
  "modules": [
    {
      "kind": "javascript-module",
      "path": "jsdoc-function.js",
      "declarations": [
        {
          "kind": "function",
          "name": "identity",
          "parameters": [
            {
              "name": "x",
              "type": {
                "text": "T"
              }
            }
          ],
          "return": {
            "type": {
              "text": ""
            }
          }
        }
      ],
      "exports": [
        {
          "kind": "js",
          "name": "identity",
          "declaration": {
            "name": "identity",
            "module": "jsdoc-function.js"
          }
        }
      ]
    }
  ]
}

```
