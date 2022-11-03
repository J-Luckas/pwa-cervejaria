import { router } from './router.js';
import bebidasForm from '../service/bebidas-form.js'

export async function switchRouter() {
    await router({ path: '/', page: 'bebidas-table' });
    await router({ path: '/cadastrar', page: 'bebidas-form', classSelect: bebidasForm });
}
