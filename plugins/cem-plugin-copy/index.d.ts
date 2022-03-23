import { Plugin } from '@custom-elements-manifest/analyzer';

export interface Options {
  /** path to custom-elements-manifest.config.js */
  configUrl: string;
  /** absolute path from config to output dir */
  from: string;
  /** relative path from config to output dir */
  to: string;
  /** suppress logs */
  quiet: boolean;
}

export declare function copyPlugin(options: Options): Plugin
