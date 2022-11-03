self.addEventListener( 'message', ev => {
  const { method } = ev.data

  if( method === 'post' ){
    const { bebidas } = ev.data
    self.postMessage({message: 'salvar-bebidas', data: bebidas})
  }else{
  }
})