import { appConfig } from "../config/app.js";

class BebidasForm {

  async init() {
    document.querySelector('#salvar-bebida').addEventListener('submit', async ( e ) => {
      e.preventDefault()

      if(navigator.onLine) {
        const ultimoId = await this.pegaUltimoId();
        const formValues = {
          id: ultimoId + 1,
          nome: document.querySelector('#nome').value
        }

        fetch('http://localhost:3000/teste', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formValues)
          },
        )
      }else{
        const session = JSON.parse(localStorage.getItem( appConfig.cache.name ))
        if( !session?.bebidas ){
          localStorage.setItem( appConfig.cache.name, JSON.stringify( {
            bebidas: [{
              id: 1,
              nome: document.querySelector('#nome').value
            }]
          } ) )
        }else{
          const ultimoIdSessao = session.bebidas[ session.bebidas.length - 1 ].id
          localStorage.setItem( appConfig.cache.name, JSON.stringify( {
            bebidas: [ ...session.bebidas, {
              id: ultimoIdSessao + 1,
              nome: document.querySelector('#nome').value
            } ]
          } ) )
        }
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

    return Promise.all(allPromises) 
  }
}

export default new BebidasForm();