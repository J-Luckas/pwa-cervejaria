import { loadPage } from '../utils/load-page.js';
import { loadScript } from '../utils/load-script.js';

export async function router({
    path,
    page = '',
    classSelect = null,
}) {
    const locationHash = getLocation();

    if (locationHash !== `#${path}`) {
        return null;
    }

    if (!page) {
        page = path.substring(1);
    }

    await loadPage(`/src/pages/${page}.html`);
    return classSelect?.init() || null;
}

export function getLocation() {
    const locationHash = window.location.hash;

    return locationHash.match(/\?/) ? locationHash.split('?')[0] : locationHash;
}
