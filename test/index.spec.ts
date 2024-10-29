import expect from 'expect';
import path from 'path';
import fs from 'fs-extra';
import { describe, it } from '@jest/globals';
import * as vUtils from '../src/etc/utils';
import { minorVerRegex, verRegex } from '../src/etc/utils';
import {
	docsPath,
	jsKeys,
	stubOptionKeys,
	stubPathKeys,
	stubRootPath,
	stubSemanticLinks,
	stubTargetPath,
	stubVersions,
} from './stubs/stubs';
import { Application } from 'typedoc';
import { load } from '../src/index';

describe('Unit testing for typedoc-plugin-versions', () => {
	it('loads and parses options', async () => {
		const app = await Application.bootstrap();
		const options = load(app);

		for (const key of stubOptionKeys) {
			expect(options).toHaveProperty(key);
		}
	});

	describe('retrieving package version', () => {
		it('retrieves patch value from package.json', () => {
			expect(vUtils.getSemanticVersion()).toMatch(verRegex);
			expect(vUtils.getSemanticVersion('0.0.0')).toEqual('v0.0.0');
			expect(vUtils.getSemanticVersion('0.2.0')).toEqual('v0.2.0');
			expect(vUtils.getSemanticVersion('1.2.0')).toEqual('v1.2.0');
			expect(vUtils.getSemanticVersion('1.2.0-alpha.1')).toEqual('v1.2.0-alpha.1');
		});
		it('throws error if version not defined', () => {
			expect(() => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore This is expected to error
				vUtils.getSemanticVersion(null);
			}).toThrow();
		});
		it('retrieves minor value from package.json', () => {
			expect(vUtils.getMinorVersion()).toMatch(minorVerRegex);
		});
	});
	describe('parses and processes directories', () => {
		it('retrieves semantically named directories into a list', () => {
			expect(vUtils.getPackageDirectories(docsPath)).toEqual(['v0.0.0', 'v0.1.0', 'v0.1.1', 'v0.10.1', 'v0.2.3']);
		});
		it('lists semantic versions correctly', () => {
			const directories = vUtils.getPackageDirectories(docsPath);
			expect(vUtils.getVersions(directories)).toEqual(['v0.0.0', 'v0.1.0', 'v0.1.1', 'v0.10.1', 'v0.2.3']);
		});
	});
	describe('creates browser assets', () => {
		it('creates a valid js string from the semantic groups', () => {
			const metadata = vUtils.refreshMetadata(
				vUtils.loadMetadata(docsPath),
				docsPath,
			);
			expect(vUtils.makeJsKeys(metadata)).toEqual(jsKeys);
		});
	});
	describe('gets latest version', () => {
		it('correctly gets the latest stable version', () => {
			expect(vUtils.getLatestVersion(
                'stable',
                stubVersions.map((v) => vUtils.getSemanticVersion(v)),
            )).toEqual(undefined);

			expect(vUtils.getLatestVersion('stable', ['v1.0.0', 'v1.1.0-alpha.1'])).toEqual('v1.0.0');
		});
		it('correctly gets the latest dev version', () => {
			expect(vUtils.getLatestVersion(
                'dev',
                stubVersions.map((v) => vUtils.getSemanticVersion(v)),
            )).toEqual('v0.10.1');

			expect(vUtils.getLatestVersion('dev', ['v1.0.0', 'v1.1.0-alpha.1'])).toEqual('v1.1.0-alpha.1');
		});
	});
	describe('infers stable and dev versions', () => {
		it('correctly interprets versions as stable or dev', () => {
			expect(vUtils.getVersionAlias('v0.2.0')).toEqual('dev');
			expect(vUtils.getVersionAlias('v0.2.0-alpha.1')).toEqual('dev');
			expect(vUtils.getVersionAlias('v1.2.0-alpha.1')).toEqual('dev');
			expect(vUtils.getVersionAlias('v1.2.0')).toEqual('stable');
		});
		const metadata = vUtils.loadMetadata(docsPath);
		it('infers stable version automatically', () => {
			expect(// will fail when our package.json version >= 1.0.0
            vUtils.refreshMetadata(metadata, docsPath).stable).toEqual(undefined);
			expect(vUtils.refreshMetadata(metadata, docsPath, '0.2.3').stable).toEqual('v0.2.3');
			expect(// will fail when our package.json version >= 1.0.0
            vUtils.refreshMetadata(metadata, docsPath, '1.0.0').stable).toEqual(undefined);
		});
		it('infers dev version automatically', () => {
			expect(// will fail when our package.json version > 0.10.1
            vUtils.refreshMetadata(metadata, docsPath).dev).toEqual('v0.10.1');
			const currentVersion = process.env.npm_package_version;
			expect(vUtils.refreshMetadata(
                metadata,
                docsPath,
                undefined,
                currentVersion,
            ).dev).toEqual('v' + currentVersion);
			expect(// will fail when our package.json version > 0.10.1
            vUtils.refreshMetadata(metadata, docsPath, undefined, '1.0.0')
                .dev).toEqual('v0.10.1');
		});
	});
	describe('creates symlinks', () => {
		it('creates a stable version symlink', () => {
			vUtils.makeAliasLink('stable', docsPath, 'v0.1');
			const link = path.join(docsPath, 'stable');
			expect(fs.existsSync(link)).toBe(true);
			expect(() => {
				vUtils.makeAliasLink('stable', docsPath, 'v0.11');
			}).toThrow();
		});
		it('creates a dev version symlink', () => {
			vUtils.makeAliasLink('dev', docsPath, 'v0.1.0');
			const link = path.join(docsPath, 'dev');
			expect(fs.existsSync(link)).toBe(true);
			expect(() => {
				vUtils.makeAliasLink('dev', docsPath, 'v0.11.1');
			}).toThrow();
		});
		it('creates all minor version links', () => {
			const directories = vUtils.getPackageDirectories(docsPath);
			const versions = vUtils.getVersions(directories);
			vUtils.makeMinorVersionLinks(versions, docsPath);
			stubSemanticLinks.forEach((link) => {
				const linkPath = path.join(docsPath, link);
				expect(fs.existsSync(linkPath)).toBe(true);
			});
		});
	});
	describe('handle file operations correctly', () => {
		it('maps correct output paths', async () => {
			const app = await Application.bootstrap();
			const version = 'v0.0.0';
			app.options.setValue('out', docsPath);
			const dirs = vUtils.getPaths(app, version);
			for (const key of stubPathKeys) {
				expect(dirs).toHaveProperty(key);
			}
			expect(dirs.rootPath.endsWith(stubRootPath)).toBe(true);
			expect(dirs.targetPath.endsWith(stubTargetPath(version))).toBe(true);
		});
		it('does not error if .nojekyll is not present', async () => {
			const app = await Application.bootstrap();
			const version = 'v0.0.0';
			app.options.setValue('out', docsPath);
			const dirs = vUtils.getPaths(app, version);
			expect(() => {
				vUtils.handleJeckyll(dirs.rootPath, dirs.targetPath);
			}).not.toThrow();
		});
		it('copies .nojekyll to the document root if exists', async () => {
			const app = await Application.bootstrap();
			const version = 'v0.0.0';
			app.options.setValue('out', docsPath);
			const dirs = vUtils.getPaths(app, version);
			fs.createFileSync(path.join(dirs.targetPath, '.nojekyll'));
			vUtils.handleJeckyll(dirs.rootPath, dirs.targetPath);
			expect(fs.existsSync(path.join(dirs.rootPath, '.nojekyll'))).toBe(true);
		});
		it('copies static assets into the target version folder', async () => {
			const app = await Application.bootstrap();
			const version = 'v0.0.0';
			app.options.setValue('out', docsPath);
			const dirs = vUtils.getPaths(app, version);
			vUtils.handleAssets(dirs.targetPath);
			expect(fs.existsSync(
                path.join(dirs.targetPath, 'assets/versionsMenu.js'),
            )).toBe(true);
		});
	});
});
