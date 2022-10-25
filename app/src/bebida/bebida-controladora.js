import { BebidaVisao } from "./bebida-visao";

const carregarPagina = async ( file ) => {
    const response = await fetch( file );

    return response.text();
};

export class BebidaControladora {

  constructor(){
    this.bebidaVisao = new BebidaVisao();
  }

  async init() {    
    const [ main ] = document.getElementsByTagName( 'main' );

    if( this.bebidaVisao.listarBebidas() ){
      main.innerHTML = await carregarPagina( '../../public/bebidas/bebidas-table.html' )
    }
  }
}