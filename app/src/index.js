import { BebidaControladora } from './bebida/bebida-controladora'

const bebidaControladora = new BebidaControladora();

window.addEventListener( 'load', async () => {
  const urlAtual = location.pathname;
  const caminhoBebidas = ( /^\/bebidas\/?([^\s]+)?$/i ).test( urlAtual );
  if(caminhoBebidas){
    bebidaControladora.init();
  }

  // try {
  //   await navigator.serviceWorker.register( 
  //     new URL('sw.js', import.meta.url),
  //     {type: 'module'} 
  //   );

  // } catch ( err ) {
  //     alert( 'Ocorreu um erro: ' + err.message );
  // }
} );

// const dbArquivos = async () => {
//   try{
//     const res = await fetch( 'http://localhost:3000/teste' );
//     desenharRegistros( await res.json() );
//   }catch ( err ) {
//     console.log( err );
//   }
// }

// function desenharRegistros( registros ) {
//   const corpo = document.querySelector( 'tbody' );
//   const fragmento = document.createDocumentFragment();
//   for ( const c of registros ) {
//       const linha = document.createElement( 'tr' );
//       const dNome = document.createElement( 'td' );
//       dNome.innerText = c.nome;
//       linha.append( dNome );
//       fragmento.append( linha );
//   }
//   corpo.append( fragmento );
// }