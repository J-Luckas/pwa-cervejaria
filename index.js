import { appConfig } from "./src/config/app.js";
import bebidasForm from "./src/service/bebidas-form.js";

const worker = new Worker('/bebidas-worker.js');
const salvarPendentesOnline = async () => {
  
  const session = JSON.parse(localStorage.getItem( appConfig.cache.name ));
  if( session && session.bebidas ){
    
    const ultimoId = await bebidasForm.pegaUltimoId()

    return session.bebidas.map(
      (bebida, i) => {
        return {
          id: ultimoId + 1 + i,
          nome: bebida.nome,
        }
      }
    )
  }
  return
}

window.addEventListener('load', async () => {
  try {
    await navigator.serviceWorker.register('/service-worker.js', {
        type: 'module',
    });

    console.log('Registrado com sucesso.');
    worker.postMessage({message: 'health'})
  } catch (error) {
    console.log('Falha ao registrar:', error);
  }

});

worker.addEventListener('message', async (ev) => {      
  if(ev.data.message === 'health' && ev.data.health === true) {
    const todasBebidasParaSalvar = await salvarPendentesOnline();
    if( todasBebidasParaSalvar ) {
      await bebidasForm.salvar( todasBebidasParaSalvar )
      localStorage.removeItem( appConfig.cache.name )
    }
  }
})

window.addEventListener('online', () => worker.postMessage({message: 'health'}))