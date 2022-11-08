import { router } from './router.js';
import bebidasForm from '../service/bebidas-form.js'
import bebibasTabela from '../service/bebidas-tabela.js'

export async function switchRouter() {
    await router({ path: '/', page: 'bebidas-table', classSelect: bebibasTabela });
    await router({ path: '/cadastrar', page: 'bebidas-form', classSelect: bebidasForm });
    await router({ path: '/recados', page: 'recados'})
}
