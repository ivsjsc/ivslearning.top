// Utils placeholder
// Global debug flag - allow enabling debug logs using localStorage or during local dev
window.APP_DEBUG = window.APP_DEBUG || (typeof localStorage !== 'undefined' && localStorage.getItem('IVS_DEBUG') === '1') || (typeof location !== 'undefined' && (location.hostname === 'localhost' || location.hostname === '127.0.0.1'));

// If not in debug mode, mute console debug/info logs that leak PII or clutter output
if (!window.APP_DEBUG) {
	['log', 'debug', 'info'].forEach(fn => {
		if (console && console[fn]) {
			console[fn] = () => {};
		}
	});
}

// Small helper to safely select elements
window.$ = (sel, root = document) => root.querySelector(sel);