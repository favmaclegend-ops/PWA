// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service Worker registered:', registration);
      updateStatus('Service Worker Active');
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
      updateStatus('Service Worker Failed');
    });
}

// Handle install prompt
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn?.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const {outcome} = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    deferredPrompt = null;
    installBtn.style.display = 'none';
  }
});

window.addEventListener('appinstalled', () => {
  console.log('App installed successfully');
  updateStatus('App Installed!');
  deferredPrompt = null;
});

// Update status
function updateStatus(message) {
  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.textContent = message;
  }
}

// Check online/offline status
function updateOnlineStatus() {
  if (navigator.onLine) {
    updateStatus('✓ Online - All features available');
  } else {
    updateStatus('✗ Offline - Using cached content');
  }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();
