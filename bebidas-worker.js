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

  if( message === 'deletar-bebida' ){
    self.postMessage({
      message: 'health',
      health: navigator.onLine ? true : false,
      metodo: 'deletar-bebida',
      id: ev.data.idBebida 
    })
  }
})