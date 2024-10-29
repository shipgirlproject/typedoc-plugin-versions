/**
 * Typdoc hooks and injections for typedoc-plugin-versions
 *
 * @module
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Application, JSX, RendererHooks } from 'typedoc';

/**
 * Injects browser js to control the behaviour of the new `select` DOM element
 * @param app
 */
export function injectSelectJs(app: Application) {
	app.renderer.hooks.on('body.end', (ctx) => {
		return (
			<script
				src={ctx.relativeURL('assets/versionsMenu.js')}
				type="module"
			></script>
		);
	});
}

const validHookLocations = [
	'body.begin',
	'body.end',
	'content.begin',
	'content.end',
	'navigation.begin',
	'navigation.end',
];
/**
 * Injects the new `select` dropdown into the HTML
 * @param app
 * @param domLocation
 */
export function injectSelectHtml(
	app: Application,
	domLocation: keyof RendererHooks | 'false',
) {
	if (validHookLocations.indexOf(domLocation) > -1) {
		if (domLocation === 'false') return;
		app.renderer.hooks.on(domLocation, () => (
			<select id="plugin-versions-select" name="versions"></select>
		));
	} else {
		app.renderer.hooks.on('body.begin', () => (
			<select
				id="plugin-versions-select"
				class="title"
				name="versions"
			></select>
		));
	}
}
