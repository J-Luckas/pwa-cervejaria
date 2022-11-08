export async function validaOnlineSwr( event ) {  
  if( navigator.onLine ) {
    return fetch( event.request, {
        method: 'HEAD'            
    } )
  }
  return false;
}