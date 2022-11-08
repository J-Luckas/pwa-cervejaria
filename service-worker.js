import { appConfig } from "./src/config/app.js";
import { validaOnlineSwr } from "./src/utils/validaOnlineSWR.js";

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
    'http://localhost:3001/favicon.ico': 'nf',
    'http://localhost:3001/src/img/cervejaria-192.png' : 'nf',
    'http://localhost:3001/src/img/cervejaria-512.png' : 'nf',
    'http://localhost:3001/src/pages/bebidas-form.html' : 'nf',
    'http://localhost:3001/src/pages/bebidas-table.html' : 'nf',
    'http://localhost:3001/src/service/bebidas-form.js' : 'nf',
    'http://localhost:3001/src/service/bebidas-tabela.js' : 'nf',
    'http://localhost:3001/#/recados' : 'swr',
    'http://localhost:3001/#/cadastrar' : 'nf',
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
    'http://localhost:3001/src/pages/offline.html': 'nf',
    'http://localhost:3001/#/offline': 'nf',
    'http://localhost:3000/bebidas': 'nf',
    'http://localhost:3001/': 'nf',
    'http://localhost:3001/src/img/recados/imagem-1.jpg': 'swr',
    'http://localhost:3001/src/img/recados/imagem-2.jpg': 'swr',
};

async function analisarEstrategia( event ) {
    
    if('GET' !== event.request.method){
        return networkFirst( event );
    }
    
    const servidor = 'http://127.0.0.1:3001/';
    const url = String( event.request.url ).replace( servidor, 'http://localhost:3001/' );
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
        '/src/service/bebidas-form.js',
        '/src/service/bebidas-tabela.js',        
        '/src/pages/recados.html',        
        '/src/routes/index.routes.js',
        '/index.js',
        '/src/routes/app.routes.js',
        '/src/routes/router.js',
        '/src/config/app.js',
        '/bebidas-worker.js',
        '/src/utils/load-page.js',
        '/src/utils/load-script.js',
        'http://localhost:3000/bebidas',
        '/src/pages/offline.html',        
        '/src/img/recados/imagem-1.jpg',
        '/src/img/recados/imagem-2.jpg',            
    ] );
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
    } catch ( err ) { 
        return cache.match( event.request );
    }
}

async function staleWhileRevalidate( event ) {
    const cache = await self.caches.open( CACHE_V1 );
    const recursoCache = await cache.match( event.request );
    let recursoRede;    
    const headReq = await validaOnlineSwr( event );    
    if ( !recursoCache || headReq ) {
        recursoRede = await fetch(event.request).catch(() => undefined);

        if (!recursoRede) {
            return await caches.match(appConfig.offline);
        }

        if( new Date(headReq.headers.get("last-modified")).getTime() > new Date(recursoCache?.headers.get("last-modified")).getTime() ) {
            await cache.put( event.request, recursoRede.clone() );
        }
    }

    return recursoCache || recursoRede;
}