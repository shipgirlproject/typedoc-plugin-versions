/**
 * Type definitions for typedoc-plugin-versions
 *
 * @module
 */

import { RendererHooks } from 'typedoc';

/**
 * User defined options under the key of `versions` in typedoc.json
 */
export interface versionsOptions {
	/**
	 * The minor version that you would like to be marked as `stable`
	 * Defaults to the latest patch version of the version being built
	 */
	stable?: version | 'auto';
	/**
	 * The version that you would like to be marked as `dev`
	 * Defaults to the latest patch version of the version being built
	 */
	dev?: version | 'auto';
	/**
	 * A custom DOM location to render the HTML `select` dropdown corresponding to [typedoc render hooks](https://typedoc.org/api/interfaces/RendererHooks.html)
	 * Default: Injects to left of header using vanilla js - not a typedoc render hook.
	 */
	domLocation?: keyof RendererHooks | 'false';
	packageFile?: string | 'package.json';
	makeRelativeLinks?: boolean;
}
export type version = `v${string}`;
export type semanticAlias = 'stable' | 'dev';

export type metadata = {
	versions?: version[];
	stable?: version;
	dev?: version;
};
