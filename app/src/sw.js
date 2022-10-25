self.addEventListener( 'install', instalar );
self.addEventListener( 'fetch', buscar );

function instalar( event )  {
  event.waitUntil( instalarRecursos( event ) );
}

function buscar ( event ){
  event.respondWith( buscarRecursos( event ) );
}

const CACHE_V1 = 'v1';

async function instalarRecursos( event ) {
    const cache = await self.caches.open( CACHE_V1 );
    cache.addAll( [
        'index.html',
        'index.js',
        'app.webmanifest',
        'app/public/img/favicon.ico',
        'app/public/img/cervejaria-192.png',
        'app/public/img/cervejaria-512.png'
    ] );
}

async function buscarRecursos( event ) {
  return networkFirst( event );
}

async function fetchComTimeout( requisicao ) {
    const TIMEOUT = 5000;
    const expiraEmTimeout = () => {
        return new Promise( ( resolve, reject ) => {
            setTimeout( () => {
                reject( new Error( 'Tempo esgotado' ) );
            }, TIMEOUT )
        } );
    };
    return Promise.race( [
        fetch( requisicao ), // sem await
        expiraEmTimeout() // sem await
    ] );
}

async function networkFirst( event ) {
    const cache = await self.caches.open( CACHE_V1 );
    try {
        const resposta = await fetchComTimeout( event.request );        
        if ( resposta.ok ) {
            await cache.put( event.request, resposta.clone() );
        }
        return resposta;
    } catch ( err ) { // ex. NetworkError
        console.log( 'Erro de rede: ', err.message );
        return cache.match( event.request );
    }
}