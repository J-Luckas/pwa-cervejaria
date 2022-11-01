import { router } from './router.js';

export async function switchRouter() {
    await router({ path: '/', page: 'bebidas-table' });
}
