import { appConfig } from "../config/app.js";

class BebidasForm {

  ultimoId = 1;
  worker = null;
  constructor() {
    this.worker = new Worker(appConfig.workerURL)
    this.worker.addEventListener('message', async (ev) => {   

      if(ev.data.message === 'health' && ev.data.health === true) {
        const formValues = {          
          nome: document.querySelector('#nome').value
        }

        const res = await this.salvar([formValues]);
        this.ultimoId = (await res[0].value.json()).id;
      }else{
        const session = JSON.parse(localStorage.getItem( appConfig.cache.name ))
        let ultimoIdSessao = (session?.bebidas.length || 0) + this.ultimoId        

        const idExists = session.bebidas.find( ( bebida ) => bebida.id === ultimoIdSessao );

        if(idExists) {
          ultimoIdSessao++
          this.ultimoId = ultimoIdSessao
        }


        localStorage.setItem( appConfig.cache.name, JSON.stringify( {
          bebidas: session?.bebidas ? [ ...session.bebidas, {
            id: ultimoIdSessao,
            nome: document.querySelector('#nome').value,
            situacao: 'SALVAR'
          } ] : [{
            id: ultimoIdSessao,
            nome: document.querySelector('#nome').value,
            situacao: 'SALVAR'
          }]
        } ) )
      }
    })
  }

  async init() {
    document.querySelector('#salvar-bebida').addEventListener('submit', async ( e ) => {
      e.preventDefault()
      this.worker.postMessage({message: 'health'})
    })
  }

  async pegaUltimoId() {
    const response = await fetch(appConfig.apiURL)
    const data = await response.json()
    return Number(data[ data.length - 1 ]?.id || 0) 
  }

  async salvar( bebidas ) {
    const allPromises = bebidas.map( (bebida) => fetch(appConfig.apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bebida)
      },
    ));

    return Promise.allSettled(allPromises) 
  }
}

export default new BebidasForm();