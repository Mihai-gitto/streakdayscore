if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/streakdayscore/js/service-worker.js')
      .then(() => console.log('SW registered'))
      .catch(err => console.warn('SW failed', err));
  });
}
