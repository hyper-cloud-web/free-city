let deferredPrompt;
const installOverlay = document.getElementById('install-overlay');
const installBtn = document.getElementById('install-btn');
const closeInstallBtn = document.getElementById('close-install');

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registered successfully!'))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}

// Handle Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Check if the user is already in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        return; // Already installed
    }
    
    // Show our custom UI
    installOverlay.classList.remove('hidden');
});

installBtn.addEventListener('click', async () => {
    installOverlay.classList.add('hidden');
    
    if (deferredPrompt) {
        // Show the native install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, throw it away
        deferredPrompt = null;
    }
});

closeInstallBtn.addEventListener('click', () => {
    installOverlay.classList.add('hidden');
});

// Hide overlay if app is launched via home screen
window.addEventListener('appinstalled', () => {
    installOverlay.classList.add('hidden');
    console.log('App was successfully installed');
});
