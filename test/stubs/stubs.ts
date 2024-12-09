import path from 'path';
import { fileURLToPath } from 'url';
import { getSemanticVersion } from '../../src/etc/utils.js';

export const stubsPath = path.dirname(fileURLToPath(import.meta.url));
export const optionsPath = path.join(stubsPath, 'typedoc.json');
export const docsPath = path.join(stubsPath, 'docs');
export const stubVersions = ['v0.0.0', 'v0.1.0', 'v0.1.1', 'v0.2.3', 'v0.10.1'];
export const stubSemanticLinks = ['v0.0', 'v0.1', 'v0.2', 'v0.10'];
export const stubOptionKeys = [
	'stable',
	'dev',
	'domLocation',
	'packageFile',
	'makeRelativeLinks',
];
export const stubPathKeys = ['rootPath', 'targetPath'];
export const stubRootPath =
	process.platform === 'win32' ? '\\test\\stubs\\docs' : '/test/stubs/docs';
export const stubTargetPath = (version: string) =>
	path.join(stubRootPath, getSemanticVersion(version));

export const jsKeys = `"use strict"
export const DOC_VERSIONS = [
	'dev',
	'v0.10',
	'v0.3',
	'v0.2',
	'v0.1',
	'v0.0',
];
`;
