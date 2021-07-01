/**
 * @param {{ from: string|RegExp; to: string|function }}
 * @return {Partial<import('@custom-elements-manifest/analyzer').Plugin>}
 */
export function moduleFileExtensionsPlugin({ from = /\.(t|j)sx?$/, to = '.js' } = {}) {
  return {
    name: 'module-file-extensions',
    packageLinkPhase({ customElementsManifest }) {
      customElementsManifest?.modules?.forEach(mod => {
        mod.path = mod.path.replace(from, to);
        for (const ex of mod.exports ?? [])
          ex.declaration.module = ex.declaration.module?.replace?.(from, to);
        // eslint-disable-next-line easy-loops/easy-loops
        for (const dec of mod.declarations ?? []) {
          if (dec.kind === 'class') {
            // eslint-disable-next-line easy-loops/easy-loops
            for (const member of dec.members ?? []) {
              if (member.inheritedFrom)
                member.inheritedFrom.module = member.inheritedFrom.module?.replace?.(from, to);
            }
          }
        }
      });
    },
  };
}
