import { appConfig } from "../config/app.js";

class BebidasTabela {

  worker = null;
  constructor(){
    this.worker = new Worker(appConfig.workerURL);
    this.worker.addEventListener('message', async (ev) => { 
      const deveRemover = ev.data.message === 'health' && ev.data.metodo === 'deletar-bebida'     
      
      if( deveRemover && ev.data.health === true  ) {
        return this.removerBebidaOnline( ev.data.id )
      }else if( deveRemover && ev.data.health === false){
        const todasBebidas = (JSON.parse(localStorage.getItem( appConfig.cache.name ))).bebidas
        const idParaDeletar = ev.data.id
        
        const novaListaBebidas = todasBebidas.map( ( bebida ) => {
          if( bebida.id === Number(idParaDeletar) && bebida.situacao === 'CONCLUIDO') {
            return { ...bebida, situacao: 'DELETAR' }              
          }

          if( bebida.id === Number(idParaDeletar) && bebida.situacao === 'SALVAR' ) {
            return null
          }

          return bebida
        } ).filter( bebida => bebida !== null )
        localStorage.setItem(appConfig.cache.name, JSON.stringify({ bebidas: novaListaBebidas }));

        this.init()
      }else if(ev.data.message === 'health' && ev.data.health === true) {


        const allBebidas = await this.getTabela();
        const bebidasFormatadas = allBebidas.map( (bebida) => ({
          ...bebida,
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

  async removerBebidaOnline( id ) {
    const res = await fetch( `${appConfig.apiURL}/${id}`, {
      method: 'DELETE'
    } )

    if( !res.ok ){
      console.error( 'falha requisicao de delete' );
    }

    return this.worker.postMessage({
      message: 'health'
    })
  }
  async validarRemoverBebida ( idBebida ) {
      const idBebidaForm = idBebida.replace( 'del-', '' );
      try {          
          this.worker.postMessage({
            message: 'deletar-bebida',
            idBebida: idBebidaForm
          })
          
      } catch ( error ) {
          console.error('Não removeu - ', error.message)
      }
  };

  async removerListaBebidas ( bebidasId ) {

    const allBebidas = bebidasId.map( ({ id }) => this.removerBebidaOnline( id ));

    return Promise.allSettled( allBebidas )
  }

  aoDispararRemover(){
    const delBebidaBotao = document.querySelectorAll('.remover-bebida')
    delBebidaBotao.forEach( (el) => {
      el.addEventListener('click', (elem) => {
        const botao = elem.target

        elem.preventDefault()
        return this.validarRemoverBebida( botao.id )
      })
    })
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

        const dFabricante = document.createElement( 'td' );
        dFabricante.innerText = b.fabricante;

        const dTipo = document.createElement( 'td' );
        dTipo.innerText = b.tipo || '';

        const dNota = document.createElement( 'td' );
        dNota.innerText = b.nota || '';
        
        const dFoto = document.createElement( 'td' );
        
        if( b.foto ){
          const foto = document.createElement( 'img' );
          foto.src = `data:image/png;base64,${b.foto}`;
          foto.width = 100
          dFoto.append(foto);        
        }else{
          dFoto.innerText = '';
        }
        
        const dOrigem = document.createElement( 'td' );
        dOrigem.innerText = b.origem || '';

        const dSituacao = document.createElement( 'td' );
        dSituacao.innerText = '❌';        
        if( b.situacao === 'CONCLUIDO' || b.situacao === undefined){
          dSituacao.innerText = '✅';
        }

        const dAcoes = document.createElement( 'td' );
        dAcoes.innerHTML = `<button class='remover-bebida' id='del-${b.id}' >🗑️</button>`;
        
        linha.append( dId, dNome, dFabricante, dTipo, dNota, dFoto, dOrigem, dSituacao, dAcoes );

        if( b.situacao === 'DELETAR'){
          linha.style.display = 'none';
        }

        fragmento.append( linha );
    }
    corpo.append( fragmento );
    this.aoDispararRemover();
  }

  async getTabela() {
    const response = await fetch(appConfig.apiURL);
    const data = await response.json();
    return data;
  }
}

export default new BebidasTabela();