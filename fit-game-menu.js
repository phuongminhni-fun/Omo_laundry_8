(() => {
  const frame = document.getElementById('game-frame');
  if (!frame) return;

  function applyMenuFit() {
    try {
      const doc = frame.contentDocument;
      if (!doc || !doc.head || !doc.body) return;

      if (!doc.getElementById('site-fit-layout')) {
        const style = doc.createElement('style');
        style.id = 'site-fit-layout';
        style.textContent = `
          #app-container { width: min(100vw, 177.7778vh) !important; height: min(56.25vw, 100vh) !important; aspect-ratio: 16 / 9; }

          /* Character setup layout retained in the same 16:9 viewport. */
          #title.ov { padding: clamp(8px, 1.1vw, 18px); overflow: hidden; justify-content: space-evenly; gap: clamp(3px, .45vw, 8px); }
          #title > div:first-child { flex: 0 0 auto; display: flex; align-items: center; justify-content: center; }
          #title h1 { font-size: clamp(25px, 3.2vw, 56px); line-height: 1; margin: 2px 0; }
          #title .bt-icon { width: clamp(24px, 3.3vw, 48px); height: clamp(40px, 5.2vw, 70px); margin: 0 clamp(4px, .7vw, 12px); }
          #title .sub { flex: 0 0 auto; margin: 0; font-size: clamp(13px, 1.55vw, 24px); line-height: 1.1; }
          #cards { flex: 0 1 auto; flex-wrap: nowrap; gap: clamp(8px, 1.2vw, 20px); margin: 2px 0; }
          #cards .card { width: min(280px, 38vw); padding: clamp(7px, .8vw, 14px); font-size: clamp(13px, 1.25vw, 18px); }
          #cards .card h3 { font-size: clamp(17px, 1.7vw, 24px); margin-bottom: 4px; }
          #cards .pv { width: clamp(42px, 5.5vw, 64px); height: clamp(62px, 8vw, 90px); margin-bottom: 3px; }
          #cards .nm { font-size: clamp(14px, 1.4vw, 19px); margin: 3px 0; padding: 3px 6px; }
          #cards .sw { gap: 4px; }
          #cards .sw button { width: clamp(17px, 2vw, 24px); height: clamp(17px, 2vw, 24px); }
          #title > div[style*="margin: 8px"] { flex: 0 0 auto; margin: 2px 0 !important; }
          #title .btn { font-size: clamp(15px, 1.8vw, 25px); padding: 5px clamp(10px, 1.6vw, 24px); margin: 3px; }
          #title #go { font-size: clamp(19px, 2.4vw, 34px) !important; padding: 6px clamp(16px, 2.5vw, 36px) !important; }
          #title .how { flex: 0 1 auto; width: min(820px, 94%); max-height: 25%; overflow: auto; margin: 2px auto; padding: clamp(6px, .7vw, 12px) clamp(9px, 1vw, 16px); font-size: clamp(11px, 1.15vw, 16px); line-height: 1.2; }
          #title .how > div { gap: 5px 12px !important; }

          /* Content-sized level cards: don't stretch cards to fill unused viewport height. */
          #lv.ov { padding: clamp(12px, 2vh, 22px) clamp(10px, 1.5vw, 24px); overflow: auto; justify-content: center; align-items: center; gap: clamp(8px, 1.2vh, 14px); }
          #lv > h1 { flex: 0 0 auto; margin: 0 !important; font-size: clamp(24px, 2.6vw, 44px) !important; line-height: 1.05; }
          #lvGrid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); align-items: start; gap: clamp(8px, .9vw, 16px); width: 100%; max-width: 1540px; min-height: 0; flex: 0 0 auto; margin: 0 auto; }
          .lv-card { position: relative; width: auto; height: auto; min-width: 0; min-height: 0; align-self: start; justify-content: flex-start; gap: 0; padding: clamp(8px, .8vw, 14px); overflow: hidden; border-radius: 12px; background: linear-gradient(155deg, rgba(20,83,145,.98), rgba(3,28,58,.98)); border: 2px solid rgba(187,225,255,.72); box-shadow: 0 8px 20px rgba(0,0,0,.32), inset 0 1px rgba(255,255,255,.14); transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease; }
          .lv-card > div:first-child { flex: 0 0 auto; }
          .lv-card > div:last-child { flex: 0 0 auto; margin-top: 4px; }
          .lv-card:hover:not(.locked) { transform: translateY(-4px); border-color: #ffd23f; box-shadow: 0 12px 26px rgba(0,0,0,.42), 0 0 14px rgba(19,213,239,.2); }
          .lv-thumb { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; margin: 0 0 7px; border: 2px solid #6acde8; border-radius: 7px; box-shadow: 0 4px 12px rgba(0,0,0,.34); }
          .lv-title { font-size: clamp(14px, 1.2vw, 22px); line-height: 1.08; margin: 4px 0; }
          .lv-stars { font-size: clamp(18px, 1.5vw, 27px); line-height: 1; margin: 4px 0; text-shadow: 0 2px 6px rgba(0,0,0,.45); }
          .lv-desc { min-height: 0; margin: 5px 0 7px; font-size: clamp(12px, .9vw, 16px); line-height: 1.16; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; }
          .lv-goal { margin: 0 0 7px; padding: 5px 3px; border-radius: 5px; font-size: clamp(11px, .82vw, 15px); white-space: nowrap; }
          .lv-play { max-width: 100%; padding: 6px 9px; border-radius: 6px; font-size: clamp(12px, 1vw, 18px); }
          #lv > .btn { flex: 0 0 auto; align-self: center; margin: 2px; padding: 6px 16px; font-size: clamp(16px, 1.5vw, 26px); }
          @media (max-width: 900px) {
            #title.ov { overflow-y: auto; }
            #cards { flex-wrap: wrap; }
            #lv.ov { justify-content: flex-start; overflow-y: auto; }
            #lvGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); width: min(100%, 700px); }
            .lv-thumb { height: auto; }
          }
          @media (max-height: 600px) and (min-width: 901px) {
            #lv.ov { padding-top: 7px; padding-bottom: 7px; gap: 6px; }
            #lvGrid { gap: 8px; }
            .lv-card { padding: 7px; }
            .lv-thumb { margin-bottom: 4px; }
            .lv-desc { -webkit-line-clamp: 2; margin: 3px 0 4px; }
            .lv-stars { margin: 2px 0; }
            .lv-goal { margin-bottom: 4px; padding: 3px; }
          }
        `;
        doc.head.appendChild(style);
      }

      // Use each level's real rendered background plus its actual machine/furniture layout.
      if (!doc.getElementById('faithful-stage-previews')) {
        const patch = doc.createElement('script');
        patch.id = 'faithful-stage-previews';
        patch.textContent = `
          drawStagePreview = function(canvas, index) {
            const ctx = canvas.getContext('2d');
            const oldLevel = lv, oldContext = g, oldFont = LF;
            const width = 330, height = 185;
            lv = index;
            buildBg();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(bgc, 0, 0, 1920, 1080, 0, 0, width, height);
            ctx.save();
            ctx.scale(width / 1920, height / 1080);
            g = ctx;
            const machine = (type, x, y) => drawSt({t:type, x:x*4, y:y*4, w:136, h:136, s:0}, 0);
            const shelf = (color, x, y) => drawSt({t:'S', c:color, x:x*4, y:y*4, w:144, h:88}, 0);
            const fold = (x, y) => drawSt({t:'F', x:x*4, y:y*4, w:136, h:80, s:0}, 0);
            const other = (type, x, y, w, h) => drawSt({t:type, x:x*4, y:y*4, w:w*4, h:h*4, s:0}, 0);
            if (index < 2) {
              [56,94,132].forEach(y => { machine('W',100,y); machine('D',436,y); });
              fold(394,196); fold(436,196); shelf('b',98,190); shelf('p',98,214);
              other('C',245,236,90,18); other('K',190,200,34,18); other('K',300,40,34,18); other('X',98,171,22,16);
              drawChar(ctx,240*4,190*4,cfg[0],0); drawChar(ctx,290*4,190*4,cfg[1],0);
            } else if (index === 2) {
              [104,142,180].forEach(x => machine('W',x,48)); [356,394,432].forEach(x => machine('D',x,48));
              shelf('b',100,106); shelf('p',100,132); fold(434,112); fold(434,142);
              other('C',245,236,90,18); other('K',268,152,34,18); other('X',100,206,22,16);
              drawSantaStatue(248*4,38*4); drawChar(ctx,210*4,188*4,cfg[0],0); drawChar(ctx,335*4,188*4,cfg[1],0);
            } else if (index === 3) {
              [96,132,168].forEach(y => { machine('W',92,y); machine('D',438,y); });
              shelf('b',180,56); shelf('p',180,82); fold(354,202); fold(398,202);
              other('C',245,236,90,18); other('K',278,106,34,18); other('X',94,206,22,16);
              drawChar(ctx,210*4,188*4,cfg[0],0); drawChar(ctx,335*4,188*4,cfg[1],0);
            } else {
              [88,124,160].forEach(y => { machine('W',92,y); machine('D',438,y); });
              shelf('b',174,74); shelf('p',174,100); fold(328,190); fold(372,190);
              other('C',245,236,90,18); other('K',264,132,34,18); other('X',94,206,22,16);
              drawChar(ctx,210*4,188*4,cfg[0],0); drawChar(ctx,226*4,188*4,cfg[1],0);
            }
            ctx.restore();
            g = oldContext; lv = oldLevel; LF = oldFont;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 3;
            ctx.strokeRect(2, 2, width - 4, height - 4);
            ctx.fillStyle = 'rgba(2,18,38,.78)'; ctx.fillRect(8, 8, 92, 22);
            ctx.fillStyle = '#13d5ef'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'left';
            ctx.fillText('GAMEPLAY · 0' + (index + 1), 15, 23);
          };
          [stage3Artwork, stage4Artwork, auroraArtwork].forEach(image => image && image.addEventListener('load', () => document.querySelectorAll('.lv-thumb').forEach((canvas, i) => drawStagePreview(canvas, i))));
        `;
        doc.body.appendChild(patch);
      }
    } catch (error) {
      // Do not block the original game if a browser disallows page customization.
    }
  }

  frame.addEventListener('load', applyMenuFit);
  if (frame.contentDocument && frame.contentDocument.readyState === 'complete') applyMenuFit();
})();
