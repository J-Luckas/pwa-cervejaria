import { loadPage } from '../utils/load-page.js';
import { loadScript } from '../utils/load-script.js';

export function router({
    path,
    page = ''
}) {
    const locationHash = getLocation();

    if (locationHash !== `#${path}`) {
        return null;
    }

    if (!page) {
        page = path.substring(1);
    }

    return loadPage(`/src/pages/${page}.html`);
}

export function getLocation() {
    const locationHash = window.location.hash;

    return locationHash.match(/\?/) ? locationHash.split('?')[0] : locationHash;
}
