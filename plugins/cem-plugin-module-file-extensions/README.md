# cem-plugin-module-file-extensions

Rewrite module path file extentions

## Options

`from` and `to` are the 1st and 2nd parameter to [`String#replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter).

| Option | Type               | Default          | Description |
| ------ | ------------------ | ---------------- | ----------- |
| from   | string \| RegExp   | `/\.(t\|j)sx?$/` | path replacement test |
| to     | string \| function | '.js'            | replacer string or function |

## Example

`custom-elements-manifest.config.js`
```js
import { moduleFileExtensionsPlugin } from 'cem-plugin-module-file-extensions';

export default {
  globs: '*.ts',
  plugins: [
    moduleFileExtensionsPlugin(),
  ]
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
      "path": "my-element.js",
      "declarations": [
        {
          "kind": "class",
          "description": "",
          "name": "MyElement",
          "customElement": true
        }
      ],
      "exports": [
        {
          "kind": "js",
          "name": "MyElement",
          "declaration": {
            "name": "MyElement",
            "module": "my-element.js"
          }
        }
      ]
    }
  ]
}
```
