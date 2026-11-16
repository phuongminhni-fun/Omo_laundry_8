// Replace the game's synthesized background melody with the public-domain
// Christmas carol "We Wish You a Merry Christmas". Keep the game's sound
// effects and game controls unchanged.
(() => {
  const frame = document.getElementById('game-frame');
  if (!frame) return;

  frame.addEventListener('load', () => {
    try {
      const game = frame.contentWindow;
      if (!game || typeof game.playMusicNote !== 'function') return;

      // G4 C5 C5 D5 C5 B4 A4 A4 D5 D5 E5 D5 C5 B4 G4 G4
      // E5 E5 F5 E5 D5 C5 A4 G4 G4 A4 D5 B4 C5
      const melody = [392, 523.25, 523.25, 587.33, 523.25, 493.88,
        440, 440, 587.33, 587.33, 659.25, 587.33, 523.25, 493.88,
        392, 392, 659.25, 659.25, 698.46, 659.25, 587.33, 523.25,
        440, 392, 392, 440, 587.33, 493.88, 523.25];
      let noteIndex = 0;
      let audioContext;

      game.playMusicNote = (frequency, duration) => {
        if (!game.bgmOn || game.S !== 'play' || game.paused || game.cd > 0) return;
        try {
          const AudioContext = game.AudioContext || game.webkitAudioContext;
          if (!audioContext) audioContext = new AudioContext();
          if (audioContext.state === 'suspended') audioContext.resume();

          const now = audioContext.currentTime;
          const note = melody[noteIndex++ % melody.length];
          const length = Math.max(0.06, duration);
          const lead = audioContext.createOscillator();
          const leadGain = audioContext.createGain();
          lead.type = 'triangle';
          lead.frequency.setValueAtTime(note, now);
          leadGain.gain.setValueAtTime(0.0001, now);
          leadGain.gain.linearRampToValueAtTime(0.045, now + 0.025);
          leadGain.gain.exponentialRampToValueAtTime(0.0001, now + length * 0.88);
          lead.connect(leadGain);
          leadGain.connect(audioContext.destination);
          lead.start(now);
          lead.stop(now + length * 0.9);

          // Soft octave bass accompaniment.
          const bass = audioContext.createOscillator();
          const bassGain = audioContext.createGain();
          bass.type = 'sine';
          bass.frequency.setValueAtTime(note / 2, now);
          bassGain.gain.setValueAtTime(0.0001, now);
          bassGain.gain.linearRampToValueAtTime(0.018, now + 0.03);
          bassGain.gain.exponentialRampToValueAtTime(0.0001, now + length * 0.82);
          bass.connect(bassGain);
          bassGain.connect(audioContext.destination);
          bass.start(now);
          bass.stop(now + length * 0.84);
        } catch (error) {
          // Audio may be unavailable until the player interacts with the page.
        }
      };
    } catch (error) {
      // Keep the game playable if browser frame access or audio is unavailable.
    }
  }, { once: true });
})();
