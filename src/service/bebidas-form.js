import { appConfig } from "../config/app.js";

class BebidasForm {

  ultimoId = 1;

  async init() {
    document.querySelector('#salvar-bebida').addEventListener('submit', async ( e ) => {
      e.preventDefault()

      if(navigator.onLine) {
        const formValues = {          
          nome: document.querySelector('#nome').value
        }

        const res = await this.salvar([formValues]);
        this.ultimoId = (await res[0].value.json()).id;
        
      }else{
        const session = JSON.parse(localStorage.getItem( appConfig.cache.name ))
        const ultimoIdSessao = (session?.bebidas.length || 0) + this.ultimoId
        localStorage.setItem( appConfig.cache.name, JSON.stringify( {
          bebidas: session?.bebidas ? [ ...session.bebidas, {
            id: ultimoIdSessao + 1,
            nome: document.querySelector('#nome').value,
            situcao: 'SALVAR'
          } ] : [{
            id: ultimoIdSessao + 1,
            nome: document.querySelector('#nome').value,
            situcao: 'SALVAR'
          }]
        } ) )
        
      }
    })
  }

  async pegaUltimoId() {
    const response = await fetch('http://localhost:3000/teste')
    const data = await response.json()
    return Number(data[ data.length - 1 ]?.id || 0) 
  }

  async salvar( bebidas ) {
    const allPromises = bebidas.map( (bebida) => fetch('http://localhost:3000/teste', {
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