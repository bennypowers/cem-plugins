import type { Plugin } from '@custom-elements-manifest/analyzer';

export interface Options {
  quiet?: boolean;
  typeTablesDir: string;
}

/**
 * Appends Markdown files to descriptions of types
 */
export declare function typeDescriptionsMarkdownPlugin(options: Options): Plugin;
