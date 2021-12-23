import { getClassMemberDoc } from '@custom-elements-manifest/analyzer/src/utils/manifest-helpers.js';
import { isStaticMember } from '@custom-elements-manifest/analyzer/src/utils/ast-helpers.js';

/**
 * Does the node have `readonly` keyword or JSDoc tag, or is the node an unpaired getter?
 * @param  {import('typescript').PropertyDeclaration}  node
 * @param  {typeof import('typescript')}  ts
 * @return {Boolean}
 */
function isReadonly(node, ts) {
  return (
    node.modifiers?.some?.(x => x.kind === ts.SyntaxKind.ReadonlyKeyword) ||
    node.jsDoc?.flatMap(i => i.tags).some(tag => tag?.kind === ts.SyntaxKind.JSDocReadonlyTag)
  );
}

/**
 * @param  {import('typescript').PropertyDeclaration} node
 * @param  {string} name
 * @param  {typeof import('typescript')}  ts
 * @return {Boolean}
 */
function hasSetter(node, name, ts) {
  return node.parent.members.some(x => ts.isSetAccessor(x) && x.name.getText() === name);
}

/**
 * @param  {import('typescript').Node} node
 * @param  {string} name
 * @param  {typeof import('typescript')}  ts
 * @return {Boolean}
 */
function isReadonlyGetter(node, name, ts) {
  return (
    ts.isGetAccessor(node) &&
    ts.isClassDeclaration(node.parent) && (
      !hasSetter(node, name, ts) ||
      isReadonly(node, ts)
    )
  );
}

/**
 * @param  {import('typescript').Node} node
 * @param  {typeof import('typescript')}  ts
 * @return {Boolean}
 */
function isReadonlyClassProperty(node, ts) {
  return ts.isPropertyDeclaration(node) && isReadonly(node, ts);
}

/**
 * @return {Partial<import('@custom-elements-manifest/analyzer').Plugin>}
 */
export function readonlyPlugin() {
  return {
    name: 'readonly',
    analyzePhase({ ts, node, moduleDoc }) {
      const name = node.name?.getText?.();
      const className = node.parent?.name?.getText?.();

      if (!name || !className) return;

      const memberDoc = getClassMemberDoc(moduleDoc, className, name, isStaticMember(node));

      if (!memberDoc) return;

      if (isReadonlyGetter(node, name, ts) || isReadonlyClassProperty(node, ts))
        // @ts-expect-error: adding a non-standard field to ClassField
        memberDoc.readonly = true;
    },
  };
}
