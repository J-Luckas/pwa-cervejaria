window.addEventListener( 'load', async () => {

  try {
      dbArquivos()
      await navigator.serviceWorker.register( 'sw.js' );
  } catch ( err ) {
      alert( 'Ocorreu um erro: ' + err.message );
  }

} );

const dbArquivos = async () => {
  try{
    const res = await fetch( 'http://localhost:3000/teste' );
    desenharRegistros( await res.json() );
  }catch ( err ) {
    console.log( err );
  }
}

function desenharRegistros( registros ) {
  const corpo = document.querySelector( 'tbody' );
  const fragmento = document.createDocumentFragment();
  for ( const c of contatos ) {
      const linha = document.createElement( 'tr' );
      const dNome = document.createElement( 'td' );
      dNome.innerText = c.nome;      
      linha.append( dNome );
      fragmento.append( linha );
  }
  corpo.append( fragmento );
}