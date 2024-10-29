"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const versions_js_1 = require("../../versions.js");
const select = document.getElementById('plugin-versions-select');
versions_js_1.DOC_VERSIONS.forEach((version) => {
    const option = document.createElement('option');
    option.value = version;
    option.innerHTML = version;
    select.appendChild(option);
});
const locationSplit = location.pathname.split('/');
const thisVersion = locationSplit.find((path) => ['stable', 'dev', ...versions_js_1.DOC_VERSIONS].includes(path));
select.value = versions_js_1.DOC_VERSIONS.includes(thisVersion)
    ? thisVersion
    : versions_js_1.DOC_VERSIONS[0];
select.onchange = () => {
    const newPaths = window.location.pathname.replace(`/${thisVersion}/`, `/${select.value}/`);
    const newUrl = new URL(newPaths, window.location.origin);
    window.location.assign(newUrl);
};
const header = document.querySelector('header.tsd-page-toolbar #tsd-search');
if (!!header && select.className.includes('title')) {
    header.prepend(select);
}
//# sourceMappingURL=versionsMenu.js.map