if (!Error.prepareStackTrace) {
	require('source-map-support/register');
}

export { default } from './plugin-manager';