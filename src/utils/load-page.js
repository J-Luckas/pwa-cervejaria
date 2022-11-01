import { appConfig } from '../config/app.js';

export async function loadPage(path) {
    const fetchPage = await fetch(appConfig.baseURL + path).catch(() => undefined);

    if (fetchPage?.status >= 400) {
        return null;
    }

    const html = await fetchPage.text();

    document.querySelector('main').innerHTML = html;
}
