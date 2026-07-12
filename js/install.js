// EduVerse Malaysia — "Add to Home Screen" install helper
// Chrome/Android/desktop support a native install prompt (beforeinstallprompt);
// iOS Safari has no such API — Apple only allows manual Add to Home Screen via
// the Share sheet, so that path gets instructions instead of a dead button.

let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); // stop the mini-infobar; we show our own card instead
  deferredPrompt = e;
});
window.addEventListener('appinstalled', () => { deferredPrompt = null; });

export const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

export const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;

export const canPromptInstall = () => !!deferredPrompt;

export async function promptInstall() {
  if (!deferredPrompt) return null;
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return choice.outcome; // 'accepted' | 'dismissed'
}

export const isInstallDismissed = () => localStorage.getItem('eduverse-install-dismissed') === '1';
export function dismissInstallCard() { localStorage.setItem('eduverse-install-dismissed', '1'); }
