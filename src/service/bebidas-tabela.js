import { appConfig } from "../config/app.js";

class BebidasTabela {
  async init() {
    const allBebidas = await this.getTabela();
    console.log("todas: ", allBebidas)
    return this.desenhar(allBebidas);
  }

  desenhar( bebidas ){
    const corpo = document.querySelector( 'tbody' );
    const fragmento = document.createDocumentFragment();
    for ( const b of bebidas ) {
        const linha = document.createElement( 'tr' );
        const dId = document.createElement( 'td' );
        dId.innerText = b.id;
        const dNome = document.createElement( 'td' );
        dNome.innerText = b.nome;        
        linha.append( dId, dNome );
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