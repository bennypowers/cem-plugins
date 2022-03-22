import chalk from 'chalk';
import hirestime from 'hirestime';

import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

/** @typedef {import('custom-elements-manifest/schema').Module} Module */
/** @typedef {import('custom-elements-manifest/schema').ClassMember} ClassMember */
/** @typedef {import('custom-elements-manifest/schema').Declaration} Declaration */
/** @typedef {import('custom-elements-manifest/schema').ClassField} ClassField */
/** @typedef {import('custom-elements-manifest/schema').FunctionDeclaration} FunctionDeclaration */
/** @typedef {import('custom-elements-manifest/schema').FunctionLike} FunctionLike */
/** @typedef {import('custom-elements-manifest/schema').ClassDeclaration} ClassDeclaration */
/** @typedef {import('custom-elements-manifest/schema').ClassMethod} ClassMethod */
/** @typedef {import('custom-elements-manifest/schema').Parameter} Parameter */
/** @typedef {import('custom-elements-manifest/schema').Type} Type */

/**
 * @typedef {object} ReturnType
 * @property {Type} [type]
 * @property {string} [description]
 */

/** @typedef {string} FilePath */
/** @typedef {string} FileContents */

/**
 * @param  {Declaration}  declaration
 * @return {declaration is FunctionDeclaration}
 */
function isFunctionDeclaration(declaration) {
  return declaration.kind === 'function';
}

/**
 * @param  {Declaration}  declaration
 * @return {declaration is ClassDeclaration}
 */
function isClassDeclaration(declaration) {
  return declaration.kind === 'class';
}

/**
 * @param  {ClassMember|Declaration}  member
 * @return {member is FunctionLike}
 */
function isFunctionLike(member) {
  return member.kind === 'method' || member.kind === 'function';
}

/**
 * @param  {ClassMember|Declaration}  member
 * @return {member is ClassField}
 */
function isClassField(member) {
  return member.kind === 'field';
}

/**
 * For any return or parameter type found in the manifest,
 * if it has an associated Markdown file in docs/api/types/,
 * replace the `description` field with the markdown file's contents.
 * @template {Parameter|ReturnType|ClassField} T
 * @param  {import('custom-elements-manifest/schema').Module} moduleDoc custom element manifest module
 * @param  {T} member
 * @param  {import('@custom-elements-manifest/analyzer').Context} context
 * @return {T}
 */
function replaceDescriptionUsingTables(moduleDoc, member, context) {
  const [, , foundMemberTypeName] = member.type?.text.match(context.typeTablesRegexp) ?? [];
  if (!foundMemberTypeName)
    return member;
  else {
    const typeDescription = context.typeTables[foundMemberTypeName];

    const { description: orig } = member;

    member.description =
      (orig ? `${orig}\n\n` : '') +
      // herefollows lame attempt to deal with ts unions in markdown tables.
      // typeDescription.replace(/`(\w+) \\\|/g, '$1 \\|');
      typeDescription;

    if (member.description !== orig) {
      if (context.dev && !context.quiet)
        console.log(chalk.blue(`Replaced description for ${chalk.bold(foundMemberTypeName)} in ${moduleDoc.path}`));
    } else if (!context.quiet)
      console.log(chalk.red(`FAILED to replace description for ${chalk.bold(foundMemberTypeName)} in ${moduleDoc.path}`));
  }
}

/**
 * Processes a function-like Declaration Member
 * @param {FunctionLike} member
 * @param  {Module} moduleDoc
 * @param  {import('@custom-elements-manifest/analyzer').Context} context
 */
function processFunctionLike(member, moduleDoc, context) {
  if (member.parameters)
    member.parameters.forEach(param => replaceDescriptionUsingTables(moduleDoc, param, context));
  if (member.return)
    replaceDescriptionUsingTables(moduleDoc, member.return, context);
}

/**
 * Processes a ClassField Member
 * @param {ClassField} member
 * @param  {Module} moduleDoc
 * @param  {import('@custom-elements-manifest/analyzer').Context} context
 */
function processClassField(member, moduleDoc, context) {
  replaceDescriptionUsingTables(moduleDoc, member, context);
}

/**
 * Processes a Declaration Member
 * @param  {Module} moduleDoc
 * @param  {import('@custom-elements-manifest/analyzer').Context} context
 * @return {(member: Declaration|ClassMember) => void}
 */
function processMember(moduleDoc, context) {
  return function(member) {
    if (isFunctionLike(member))
      processFunctionLike(member, moduleDoc, context);
    else if (isClassField(member))
      processClassField(member, moduleDoc, context);
  };
}

/**
 * Appends Markdown files to descriptions of types
 * @param {{ typeTablesDir: string }} options
 * @return {Partial<import('@custom-elements-manifest/analyzer').Plugin>}
 */
export function typeDescriptionsMarkdownPlugin({ typeTablesDir, quiet }) {
  /**
   * Type tables
   * @type {Record<FilePath, FileContents>}
   */
  const TABLES =
    Object.fromEntries(readdirSync(typeTablesDir)
      .map(filename => [
        filename.replace('.md', ''),
        readFileSync(join(typeTablesDir, filename), 'utf8'),
      ]));

  // /^(Partial<|Promise<)?(a|b|c)/; // Uncomment to preview with regexp-railroad.
  const TYPES_REGEXP = new RegExp(`^(Partial<|Promise<)?(${Object.keys(TABLES).join('|')})`);

  return {
    name: 'type-descriptions-markdown',
    moduleLinkPhase({ moduleDoc, context }) {
      const time = hirestime.default();
      context.typeTables = TABLES;
      context.typeTablesRegexp = TYPES_REGEXP;
      const process = processMember(moduleDoc, { ...context, quiet });
      moduleDoc.declarations?.forEach?.(function(declaration) {
        if (isFunctionDeclaration(declaration))
          process(declaration, context);
        else if (isClassDeclaration(declaration))
          declaration.members?.forEach?.(process);
      });
      if (!quiet)
        console.log(chalk.green(`Replaced descriptions in ${chalk.bold(moduleDoc.path)} in ${time.seconds()}s`));
    },
  };
}
