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

      // Fit the 1920x1080 game viewport to the available display and keep menus
      // inside it instead of allowing the page/overlay to grow vertically.
      const fitStyle = game.document.createElement('style');
      fitStyle.id = 'omo-viewport-fit-fix';
      fitStyle.textContent = `
        html, body {
          width: 100%; height: 100%; min-height: 0; margin: 0; padding: 0;
          overflow: hidden !important;
        }
        #app-container {
          width: min(100vw, 177.7778vh) !important;
          height: min(100vh, 56.25vw) !important;
          max-width: none !important; max-height: none !important;
          aspect-ratio: 16 / 9;
        }
        .ov {
          min-height: 0; padding: clamp(8px, 1.25vw, 20px) !important;
          overflow: hidden !important;
        }
        #title { justify-content: center; }
        #title h1 { font-size: clamp(28px, 4vw, 58px) !important; }
        #title .sub { font-size: clamp(13px, 1.6vw, 22px); margin-bottom: 6px; }
        #cards { gap: clamp(8px, 1.2vw, 18px); margin: 6px 0; }
        .card { width: clamp(180px, 23vw, 280px); padding: clamp(8px, 1vw, 14px); font-size: clamp(14px, 1.4vw, 18px); }
        .card h3 { font-size: clamp(17px, 1.8vw, 23px); }
        .pv { width: clamp(44px, 5vw, 64px); height: clamp(68px, 7.5vw, 88px); margin-bottom: 4px; }
        .how { max-width: min(820px, 95%); margin: 6px auto; padding: 8px 12px; font-size: clamp(12px, 1.25vw, 16px); }
        #lv { justify-content: flex-start; }
        #lv > h1 { flex: 0 0 auto; font-size: clamp(24px, 3vw, 42px) !important; margin: 0 0 4px !important; }
        #lvGrid.lv-grid {
          flex: 1 1 auto; min-height: 0; width: min(100%, 1100px); max-width: 1100px;
          display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
          grid-template-rows: repeat(2, minmax(0, 1fr)); align-content: stretch;
          gap: clamp(6px, .9vw, 14px); margin: 4px auto; overflow: hidden;
        }
        .lv-card {
          width: auto; min-width: 0; min-height: 0; padding: clamp(6px, .8vw, 12px);
          overflow: hidden; justify-content: space-between;
        }
        .lv-thumb { width: 100%; height: auto; max-height: min(17vh, 185px); margin-bottom: 3px; }
        .lv-title { font-size: clamp(13px, 1.45vw, 20px); margin: 2px 0; }
        .lv-stars { font-size: clamp(17px, 2vw, 26px); margin: 0; }
        .lv-desc { min-height: 0; font-size: clamp(11px, 1.1vw, 15px); margin: 3px 0 5px; }
        .lv-goal { padding: 4px; font-size: clamp(11px, 1.1vw, 15px); margin-bottom: 5px; }
        .lv-play { max-width: 100%; font-size: clamp(12px, 1.2vw, 17px); padding: 5px 8px; }
        #backTitle { flex: 0 0 auto; margin: 3px; font-size: clamp(14px, 1.5vw, 20px); padding: 5px 12px; }
        @media (max-aspect-ratio: 4/3) {
          #lvGrid.lv-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(3, minmax(0, 1fr)); }
          .lv-thumb { max-height: 13vh; }
        }
      `;
      game.document.head.appendChild(fitStyle);

      // Keep input focus in the game canvas and clear stale pressed-key state
      // whenever the game window loses focus.
      if (!game.__OMO_INPUT_FOCUS_FIX) {
        game.__OMO_INPUT_FOCUS_FIX = true;
        game.eval(`
          cv.addEventListener('pointerdown', () => cv.focus({ preventScroll: true }));
          window.addEventListener('blur', () => keys.clear(), true);
        `);
      }

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
