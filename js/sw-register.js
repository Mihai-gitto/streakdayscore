/* ================================================================
   StreakDayscore · Service Worker Registration
   ================================================================ */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/streakdayscore/js/service-worker.js')
      .then(() => console.log('StreakDayscore: Service Worker registered'))
      .catch(err => console.warn('StreakDayscore: SW registration failed', err));
  });
}
