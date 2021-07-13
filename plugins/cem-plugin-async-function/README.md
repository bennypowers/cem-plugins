# cem-plugin-async-function

Adds (non-standard) "async" flag to functions and class methods

## Example

`custom-elements-manifest.config.js`
```js
import { asyncFunctionPlugin } from 'cem-plugin-async-function';

export default {
  plugins: [
    asyncFunctionPlugin(),
  ]
}
```

`async-function.ts`
```js
/** @element async-method */
export class Async {
  async a() {}
}

export async function b() {}
```

### Output
```json
{
  "schemaVersion": "1.0.0",
  "readme": "",
  "modules": [
    {
      "kind": "javascript-module",
      "path": "async-function.js",
      "declarations": [
        {
          "kind": "class",
          "description": "",
          "name": "Async",
          "members": [
            {
              "kind": "method",
              "name": "a",
              "async": true
            }
          ],
          "tagName": "async-method",
          "customElement": true
        },
        {
          "kind": "function",
          "name": "b",
          "async": true
        }
      ],
      "exports": [
        {
          "kind": "js",
          "name": "Async",
          "declaration": {
            "name": "Async",
            "module": "async-function.js"
          }
        },
        {
          "kind": "js",
          "name": "b",
          "declaration": {
            "name": "b",
            "module": "async-function.js"
          }
        }
      ]
    }
  ]
}
```
