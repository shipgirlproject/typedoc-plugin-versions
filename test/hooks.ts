import mock from 'jest-mock';
import { jest } from '@jest/globals';
process.env.Node = 'test';

import fs from 'fs-extra';
import path from 'path';
import { docsPath, stubVersions } from './stubs/stubs';

mock.spyOn(console, 'error').mockClear();
mock.spyOn(console, 'warn').mockClear();
mock.spyOn(console, 'log').mockClear();

export const mochaHooks = {
	beforeAll(done) {
		deleteFolders([docsPath]);
		fs.mkdirSync(docsPath);
		stubVersions.forEach((version) => {
			fs.mkdirSync(path.join(docsPath, version));
		});
		done();
	},
	beforeEach(done) {
		done();
	},
	afterEach(done) {
		jest.restoreAllMocks();
		mock.spyOn(console, 'error').mockClear();
		mock.spyOn(console, 'warn').mockClear();
		mock.spyOn(console, 'log').mockClear();
		done();
	},
	afterAll(done) {
		deleteFolders([docsPath]);
		done();
	},
};

const deleteFolders = (folders: string[]) => {
	folders.forEach((folder) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		fs.existsSync(folder) && fs.rmSync(folder, { recursive: true });
	});
};
