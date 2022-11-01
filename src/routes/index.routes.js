import { switchRouter } from './app.routes.js';

export function initRoutes() {
    window.addEventListener('hashchange', () => {
        switchRouter();
    });

    window.addEventListener('load', async () => {
        if (!location.hash) {
            location.hash = '/';
        }

        await switchRouter();
    });
}

initRoutes();
