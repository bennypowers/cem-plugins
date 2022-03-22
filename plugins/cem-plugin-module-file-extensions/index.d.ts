import type { Plugin } from '@custom-elements-manifest/analyzer';
export declare function moduleFileExtensionsPlugin(opts?: {
  from?: string|RegExp;
  to?: string|(Parameters<typeof String.prototype.replace>)[1];
}): Plugin;

