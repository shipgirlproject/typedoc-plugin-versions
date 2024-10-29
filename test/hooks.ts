import 'source-map-support/register';
import { jest, beforeAll, afterEach, afterAll } from '@jest/globals';
process.env.Node = 'test';

import fs from 'fs-extra';
import path from 'path';
import { docsPath, stubVersions } from './stubs/stubs';

jest.spyOn(console, 'error').mockClear();
jest.spyOn(console, 'warn').mockClear();
jest.spyOn(console, 'log').mockClear();

beforeAll(() => {
	deleteFolders([docsPath]);
	fs.mkdirSync(docsPath);
	stubVersions.forEach((version) => {
		fs.mkdirSync(path.join(docsPath, version));
	});
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.spyOn(console, 'error').mockClear();
	jest.spyOn(console, 'warn').mockClear();
	jest.spyOn(console, 'log').mockClear();
});

afterAll(() => {
	deleteFolders([docsPath]);
});

const deleteFolders = (folders: string[]) => {
	folders.forEach((folder) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		fs.existsSync(folder) && fs.rmSync(folder, { recursive: true });
	});
};
