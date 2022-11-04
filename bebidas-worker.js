self.addEventListener( 'message', ev => {
  const { message } = ev.data
  if( message === 'health' ){
    self.postMessage({
      message: 'health',
      health: navigator.onLine ? true : false
    })
  }

  if( message ==='resetar-tabela' ){
    self.postMessage({
      message: 'resetar-tabela',
      health: true
    })
  }
})