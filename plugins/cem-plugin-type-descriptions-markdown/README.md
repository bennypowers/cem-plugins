# cem-plugin-type-descriptions-markdown

Appends Markdown documents to function parameter and return types and class field types.

## Options
| Option        | Type   | Required | Description |
| ------------- | ------ | -------- | ----------- |
| typeTablesDir | string | yes      | Absolute path to the directory holding the type docs. |
| quiet         | bool   | no       | Suppress logs |

## Example

`custom-elements-manifest.config.js`
```js
import { fileURLToPath } from 'url';
import { typeDescriptionsMarkdownPlugin } from 'cem-plugin-type-descriptions-markdown';

export default {
  plugins: [
    typeDescriptionsMarkdownPlugin({
      typeTablesDir: fileURLToPath(new URL('../../docs/type-tables/', import.meta.url)),
    }),
  ]
}
```

`docs/type-tables/BigBagOfProperties.md`

```markdown
| Option     | Type   | Description |
| ---------- | ------ | ----------- |
| name       | string | The name of the thing |
| shoeSize   | number | Act your age |
```

`src/shoe-sizer.ts`
```ts
interface BigBagOfProperties {
  name?: string;
  shoeSize?: number;
}

/** @element shoe-sizer */
export class ShoeSizer {
  /** @summary Shoe Size options */
  declare options: BigBagOfProperties;
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
      "path": "src/shoe-sizer.js",
      "declarations": [
        {
          "kind": "class",
          "name": "ShoeSizer",
          "description": "",
          "members": [
            {
              "kind": "field",
              "name": "options",
              "summary": "Shoe Size options",
              "description": "| Option     | Type   | Description |\n| ---------- | ------ | ----------- |\n| name       | string | The name of the thing |\n| shoeSize   | number | Act your age |",
              "type": {
                "text": "BigBagOfProperties"
              }
            }
          ],
          "tagName": "shoe-sizer",
          "customElement": true
        }
      ],
      "exports": [
        {
          "kind": "js",
          "name": "ShoeSizer",
          "declaration": {
            "name": "ShoeSizer",
            "module": "src/shoe-sizer.js"
          }
        }
      ]
    }
  ]
}
```
