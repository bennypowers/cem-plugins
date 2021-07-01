import { getClassMemberDoc } from '@custom-elements-manifest/analyzer/src/utils/manifest-helpers.js';

/**
 * @return {import('@custom-elements-manifest/analyzer').Plugin}
 */
export function asyncFunctionPlugin() {
  return {
    name: 'async-function',
    analyzePhase({ ts, node, moduleDoc }) {
      switch (node.kind) {
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.FunctionExpression: {
          /** @type {import('typescript').FunctionDeclaration | import('typescript').FunctionExpression} */
          const dec = (node);

          if (!dec.name)
            break;

          const functionName = dec.name.getText();

          /** @type {import('custom-elements-manifest/schema').FunctionDeclaration} */
          const doc =
            (moduleDoc.declarations.find(x =>
              x.name === functionName));

          if (doc && dec.modifiers?.some?.(x => x.kind === ts.SyntaxKind.AsyncKeyword))
            // @ts-expect-error: i'm adding a non-standard field to FunctionDeclaration
            doc.async = true;

          break;
        }

        case ts.SyntaxKind.MethodDeclaration: {
          /** @type {import('typescript').MethodDeclaration} */
          const dec = (node);

          if (!dec.name)
            break;

          const methodName = dec.name.getText();

          const { parent } = dec;

          if (parent && ts.isClassLike(parent) || ts.isClassDeclaration(parent)) {
            /** @type {import('typescript').ClassLikeDeclaration} */
            const cls = (parent);
            const className = cls.name?.getText?.();

            const memberDoc = getClassMemberDoc(moduleDoc, className, methodName);

            if (memberDoc && dec.modifiers?.some?.(x => x.kind === ts.SyntaxKind.AsyncKeyword))
              // @ts-expect-error: i'm adding a non-standard field to FunctionDeclaration
              memberDoc.async = true;
          }
        }
      }
    },
  };
}
