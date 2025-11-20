// app-urls.js - Centralized external app URLs used throughout the site
// Default to existing production urls; can be overridden by server-side injection
(function() {
    window.ELearnersUrl = window.ELearnersUrl || 'https://ivseng.web.app';
    window.IVSTestingUrl = window.IVSTestingUrl || 'https://testplacement.web.app';
    window.KinderlinkUrl = window.KinderlinkUrl || 'https://ivs-7221b.web.app';
})();

export default { ELearnersUrl: window.ELearnersUrl, IVSTestingUrl: window.IVSTestingUrl, KinderlinkUrl: window.KinderlinkUrl };
