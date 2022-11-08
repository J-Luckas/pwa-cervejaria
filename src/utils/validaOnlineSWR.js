export async function validaOnlineSwr( event ) {
  console.log('online: ', navigator.onLine)
  if( navigator.onLine ) {
    return fetch( event.request, {
        method: 'HEAD'            
    } )
  }
  return false;
}