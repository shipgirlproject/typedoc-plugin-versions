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

type ValidHookLocation = keyof RendererHooks | 'false';

const validHookLocations: ValidHookLocation[] = [
	'head.begin',
	'head.end',
	'body.begin',
	'body.end',
	'content.begin',
	'content.end',
	'sidebar.begin',
	'sidebar.end',
	'pageSidebar.begin',
	'pageSidebar.end',
	'footer.begin',
	'footer.end',
	'comment.beforeTags',
	'comment.afterTags',
] as const;
/**
 * Injects the new `select` dropdown into the HTML
 * @param app
 * @param domLocation
 */
export function injectSelectHtml(
	app: Application,
	domLocation: ValidHookLocation,
) {
	if (validHookLocations.indexOf(domLocation) > -1) {
		if (domLocation === 'false') return;
		app.renderer.hooks.on(domLocation, () => (
			<select id="plugin-versions-select" name="versions"></select>
		));
	} else {
		app.renderer.hooks.on('head.end', () => (
			<style>{`
				.tsd-ext-version-select .settings-label {
					margin: 0.75rem 0.75rem 0 0;
			`}</style>
		));

		app.renderer.hooks.on('pageSidebar.begin', () => (
			<div class="tsd-ext-version-select">
				<label class="settings-label" for="plugin-versions-select">Version</label>
				<select id="plugin-versions-select" name="versions"></select>
			</div>
		));
	}
}
