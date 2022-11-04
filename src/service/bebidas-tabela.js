import { appConfig } from "../config/app.js";

class BebidasTabela {

  worker = null;
  constructor(){
    this.worker = new Worker(appConfig.workerURL);
    this.worker.addEventListener('message', async (ev) => {      
      if(ev.data.message === 'health' && ev.data.health === true) {
        const allBebidas = await this.getTabela();
        const bebidasFormatadas = allBebidas.map( ({id, nome}) => ({
          id,
          nome,
          situacao: 'CONCLUIDO'
        }) );

        localStorage.setItem(appConfig.cache.name, JSON.stringify({ bebidas: bebidasFormatadas }));
        return this.desenhar(allBebidas);
      }else if( ev.data.message === 'health' && ev.data.health === false ) {
        const session = JSON.parse(localStorage.getItem( appConfig.cache.name ))
        return this.desenhar(session.bebidas);
      }
    });
  }

  async init() {
    return this.worker.postMessage({message: 'health'})
  }

  desenhar( bebidas ){
    const corpo = document.querySelector( 'tbody' );
    corpo.innerHTML = '';
    const fragmento = document.createDocumentFragment();
    for ( const b of bebidas ) {
        const linha = document.createElement( 'tr' );
        const dId = document.createElement( 'td' );
        dId.innerText = b.id;
        const dNome = document.createElement( 'td' );
        dNome.innerText = b.nome;

        const dSituacao = document.createElement( 'td' );
        dSituacao.innerText = '❌';
        if( b.situacao === 'CONCLUIDO' || b.situacao === undefined){
          dSituacao.innerText = '✅';
        }
        

        linha.append( dId, dNome, dSituacao );
        fragmento.append( linha );
    }
    corpo.append( fragmento );
  }

  async getTabela() {
    const response = await fetch(appConfig.apiURL);
    const data = await response.json();
    return data;
  }
}

export default new BebidasTabela();