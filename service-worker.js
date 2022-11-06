self.addEventListener( 'install', instalar );
self.addEventListener( 'fetch', buscar );

function instalar( event )  {
  event.waitUntil( instalarRecursos( event ) );
}

function buscar ( event ){    
  event.respondWith( analisarEstrategia( event ) );
}

const CACHE_V1 = 'v1';

const recursos = {
    'http://localhost:3001/index.html' : 'nf',
    'http://localhost:3001/app.webmanifest' : 'nf',
    'http://localhost:3001/src/img/favicon.ico' : 'nf',
    'http://localhost:3001/src/img/cervejaria-192.png' : 'nf',
    'http://localhost:3001/src/img/cervejaria-512.png' : 'nf',
    'http://localhost:3001/src/pages/bebidas-form.html' : 'nf',
    'http://localhost:3001/src/pages/bebidas-table.html' : 'nf',
    'http://localhost:3001/src/service/bebidas-form.js' : 'nf',
    'http://localhost:3001/src/service/bebidas-tabela.js' : 'nf',
    'http://localhost:3001/src/pages/recados.html' : 'swr',
    'http://localhost:3001/#/' : 'nf',
    'http://localhost:3001/src/routes/index.routes.js': 'nf',
    'http://localhost:3001/index.js': 'nf',
    'http://localhost:3001/src/routes/app.routes.js': 'nf',
    'http://localhost:3001/src/routes/router.js': 'nf',
    'http://localhost:3001/src/config/app.js': 'nf',
    'http://localhost:3001/bebidas-worker.js': 'nf',
    'http://localhost:3001/src/utils/load-page.js': 'nf',
    'http://localhost:3001/src/utils/load-script.js': 'nf',
    'http://localhost:3000/bebidas': 'nf',
    'http://localhost:3001/': 'nf'
};

async function analisarEstrategia( event ) {

    if('GET' !== event.request.method){
        return networkFirst( event );
    }
    
    const servidor = 'http://127.0.0.1:3001/#/';
    const url = String( event.request.url ).replace( servidor, '' );
    const estrategia = recursos[ url ];
    switch ( estrategia ) {
        case 'nf': return networkFirst( event );        
        case 'swr': return staleWhileRevalidate( event );
        default: throw new Error(
            'Estratégia de cache incorreta: ' + estrategia );
    }
}

async function instalarRecursos( event ) {
    const cache = await self.caches.open( CACHE_V1 );
    cache.addAll( [
        '/index.html',
        '/app.webmanifest',
        '/src/img/favicon.ico',
        '/src/img/cervejaria-192.png',
        '/src/img/cervejaria-512.png',
        '/src/pages/bebidas-form.html',
        '/src/pages/bebidas-table.html',
        '/src/pages/recados.html'
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
        if ( resposta.ok && event.request.method === 'GET' ) {
            await cache.put( event.request, resposta.clone() );
        }
        return resposta;
    } catch ( err ) { // ex. NetworkError
        console.log( 'Erro de rede: ', err.message );
        return cache.match( event.request );
    }
}

async function staleWhileRevalidate( event ) {
    // Primeiro pega do cache
    const cache = await self.caches.open( CACHE_V1 );
    const recursoCache = await cache.match( event.request );
    // Depois pega da rede para atualizar o cache
    let recursoRede;
    try {
        recursoRede = await fetchComTimeout( event.request );
        if ( recursoRede.ok ) {
            // Terá versão atualizada na próxima vez ;)
            await cache.put( event.request, recursoRede.clone() );
        }
    } catch ( err ) { // ex. NetworkError
        // Só prossegue
    }
    return recursoCache || recursoRede;
}