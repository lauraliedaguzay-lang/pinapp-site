/**
 * Son AURA — opt-in strict (aucune lecture avant clic utilisateur sur le toggle).
 */
(function () {
  var KEY = 'pinapp-aura-sound';
  function read() {
    try {
      return localStorage.getItem(KEY) === '1';
    } catch (e) {
      return false;
    }
  }
  function write(on) {
    try {
      localStorage.setItem(KEY, on ? '1' : '0');
    } catch (e2) {}
  }

  window.PINAPP_AURA_SOUND = {
    isEnabled: read,
    setEnabled: write,
  };
})();
