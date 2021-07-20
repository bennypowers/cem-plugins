import { getClassMemberDoc } from '@custom-elements-manifest/analyzer/src/utils/manifest-helpers.js';

/**
 * @param  {import('typescript').JSDocTag}  tag
 * @return {Boolean}
 */
function isJsDocExampleTag(tag) {
  try {
    return tag.tagName.getText() === 'example';
  } catch {
    return false;
  }
}

/**
 * Does the AST node have JSDoc tags?
 * @template {import('typescript').Node} N
 * @param  {N}  node
 * @return {node is N & { jsDoc: import('typescript').JSDoc[] }}
 */
function hasJsDocComments(node) {
  return 'jsDoc' in node;
}

/**
 * Given a manifest and a declaration name, get the declaration doc
 * @param  {Partial<import("custom-elements-manifest/schema").Module>} moduleDoc
 * @param  {string} name
 * @return {import("custom-elements-manifest/schema").Declaration}
 */
function getDeclarationDoc(moduleDoc, name) {
  return moduleDoc.declarations.find(x => x.name === name);
}

/**
 * Add a Node's JSDoc examples to a manifest object
 * @param {import('typescript').Node & { jsDoc: import('typescript').JSDoc[] }} node
 * @param {import("custom-elements-manifest/schema").Declaration} doc
 * @param {*} context
 * @param {number} [offset=0]
 */
function addExamples(node, doc, context, offset = 0) {
  const heading = Array.from({ length: (2 + offset) }, () => '#').join('');
  let sawExamples = false;

  // eslint-disable-next-line easy-loops/easy-loops
  for (const jsdoc of node.jsDoc ?? []) {
    if (!Array.isArray(jsdoc?.tags))
      continue;

    const tags = jsdoc.tags.filter(isJsDocExampleTag);

    doc.description ??= '';

    if (tags.length && !sawExamples) {
      doc.description += `\n\n${heading} Examples\n\n`;
      sawExamples = true;
    }

    // eslint-disable-next-line easy-loops/easy-loops
    for (const tag of tags) {
      if (typeof tag.comment === 'string') {
        const [caption, ...rest] = tag.comment.split('\n');
        if (context.dev)
          console.log(`[jsdoc-example] found @example ${caption}`);
        doc.description += `${heading}# ${caption}\n${rest.join('\n')}\n\n`;
      }
    }
    doc.description = doc.description.trim();
  }
}

/**
 * @return {import('@custom-elements-manifest/analyzer').Plugin}
 */
export function jsdocExamplePlugin() {
  return {
    name: 'jsdoc-example',
    analyzePhase({ ts, node, moduleDoc, context }) {
      if (!hasJsDocComments(node))
        return;
      if (ts.isClassDeclaration(node)) {
        const className = node.name.getText();
        const classDoc = getDeclarationDoc(moduleDoc, className);
        if (!classDoc)
          return context.dev && console.warn(`[jsdoc-example]: Could not find class ${className} in module doc for path ${moduleDoc.path}`);
        addExamples(node, classDoc, context);
      } else if (ts.isPropertyDeclaration(node)) {
        const propertyName = node.name.getText();
        const className = node.parent?.name?.getText?.();
        const classDoc = getDeclarationDoc(moduleDoc, className);
        if (!classDoc)
          return;
        const isStatic = node.modifiers?.some?.(x => x.kind === ts.SyntaxKind.StaticKeyword);
        const propertyDoc = getClassMemberDoc(moduleDoc, className, propertyName, isStatic);
        if (!propertyDoc)
          return context.dev && console.warn(`[jsdoc-example]: Could not find property ${propertyName} of ${className} in module doc for path ${moduleDoc.path}`);
        addExamples(node, propertyDoc, context, 1);
      } else if (ts.isMethodDeclaration(node)) {
        // TODO: handle object methods
        if (!ts.isClassDeclaration(node.parent))
          return;
        const methodName = node.name.getText();
        const className = node.parent.name.getText();
        const classDoc = getDeclarationDoc(moduleDoc, className);
        if (!classDoc)
          return;
        const isStatic = node.modifiers?.some?.(x => x.kind === ts.SyntaxKind.StaticKeyword);
        const methodDoc = getClassMemberDoc(moduleDoc, className, methodName, isStatic);
        if (!methodDoc)
          return context.dev && console.warn(`[jsdoc-example]: Could not find method ${methodName} of ${className} in module doc for path ${moduleDoc.path}`);
        addExamples(node, methodDoc, context, 1);
      } else if (ts.isFunctionDeclaration(node)) {
        const functionName = node.name.getText();
        const functionDoc = getDeclarationDoc(moduleDoc, functionName);
        if (!functionDoc)
          return context.dev && console.warn(`[jsdoc-example]: Could not find function ${functionName} in module doc for path ${moduleDoc.path}`);
        addExamples(node, functionDoc, context);
      }

      // TODO: GetAccessor and SetAccessor
    },
  };
}
