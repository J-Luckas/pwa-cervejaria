import { appConfig } from "./src/config/app.js";
import bebidasForm from "./src/service/bebidas-form.js";

const sincronizarOnline = async () => {
  const worker = new Worker('/bebidas-worker.js');
  const session = JSON.parse(localStorage.getItem( appConfig.cache.name ));
  if( session && session.bebidas ){
    
    const ultimoId = await bebidasForm.pegaUltimoId()

    const bebidas = session.bebidas.map(
      (bebida, i) => {
        return {
          id: ultimoId + 1 + i,
          nome: bebida.nome,
        }
      }
    )
    worker.postMessage({
      method: "post",
      bebidas
    })
  }

  worker.addEventListener('message', async (ev) => {
    if(ev.data.message === 'salvar-bebidas') {
      await bebidasForm.salvar( ev.data.data )
      localStorage.removeItem( appConfig.cache.name )
    }
  })
}

window.addEventListener('load', async () => {
  try {
    console.log('testeeeee')
    await navigator.serviceWorker.register('/service-worker.js', {
        type: 'module',
    });

    console.log('Registrado com sucesso.');


    if( navigator.onLine ){
      console.log('online');
      await sincronizarOnline();
    }
  } catch (error) {
    console.log('Falha ao registrar:', error);
  }

});

window.addEventListener('online', async () => {
  console.log('online');
  await sincronizarOnline();
})