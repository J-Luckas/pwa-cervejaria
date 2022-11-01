window.addEventListener('load', async () => {
  try {
    await navigator.serviceWorker.register('/service-worker.js', {
        type: 'module',
    });

    console.log('Registrado com sucesso.');
  } catch (error) {
    console.log('Falha ao registrar:', error);
  }

});