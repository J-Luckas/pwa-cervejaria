import { appConfig } from "./src/config/app.js";
import bebidasForm from "./src/service/bebidas-form.js";
import bebidasTabela from "./src/service/bebidas-tabela.js";

const worker = new Worker(appConfig.workerURL);
const salvarPendentesOnline = async () => {
  
  const session = JSON.parse(localStorage.getItem( appConfig.cache.name ));
  if( session && session.bebidas ){

    return session.bebidas.map(
      (bebida, i) => {
        if( bebida.situacao !== 'SALVAR' ) return null;
        return {          
          nome: bebida.nome,
        }
      }
    ).filter( (bebida) => bebida !== null )
  }
  return
}

const deletarPendentesOnline = async () => {
  
  const session = JSON.parse(localStorage.getItem( appConfig.cache.name ));
  if( session && session.bebidas ){

    return session.bebidas.map(
      (bebida, i) => {
        if( bebida.situacao !== 'DELETAR' ) return null;
        return {
          id: bebida.id,
        }
      }
    ).filter( (bebida) => bebida !== null )
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
    }
    const todasBebidasParaDeletar = await deletarPendentesOnline();
    if( todasBebidasParaDeletar ) {
      await bebidasTabela.removerListaBebidas( todasBebidasParaDeletar );
    }

    localStorage.removeItem( appConfig.cache.name )
    worker.postMessage({ message: 'resetar-tabela' })
  }else if( ev.data.message === 'resetar-tabela' && ev.data.health === true ){
    if( location.hash !== '#/' ) return
    await bebidasTabela.init();
  }
})

window.addEventListener('online', () => worker.postMessage({message: 'health'}))