/*
  script.js — optimized init
  - Defer initialization until DOMContentLoaded to avoid blocking parsing
  - Move partner click handling here (removed inline script)
  - Avoid blocking touchmove preventDefault and reduce synchronous DOM queries
  - Added streamings form submission to Discord webhook
*/

(function(){
  const BRAND = "BKS Influencer";

  // lightweight helper for pulse animation
  function pulse(btn){
    if (!btn || !btn.animate) return;
    try {
      btn.animate([
        { transform: 'scale(1)', boxShadow: '0 6px 18px rgba(0,0,0,0.6)' },
        { transform: 'scale(0.98)', boxShadow: '0 12px 30px rgba(140,0,197,0.18)' },
        { transform: 'scale(1)', boxShadow: '0 6px 18px rgba(0,0,0,0.6)' }
      ], { duration:260, easing:'cubic-bezier(.2,.8,.2,1)' });
    } catch(e){}
  }

  function createAnimatedName(container, text){
    if (!container) return;
    const frag = document.createDocumentFragment();
    for (let i=0;i<text.length;i++){
      const ch = text[i];
      if (ch === " "){
        const space = document.createElement('span');
        space.className = 'letter';
        space.style.width = '0.36em';
        space.style.display = 'inline-block';
        space.setAttribute('data-char',' ');
        frag.appendChild(space);
        continue;
      }
      const span = document.createElement('span');
      span.className = 'letter';
      span.setAttribute('data-char', ch);
      span.textContent = ch;
      // small deterministic stagger to avoid heavy layout thrash
      span.style.animationDelay = `${(i % 6) * 60}ms`;
      span.style.transform = `scale(${0.98 + ((i%4)/100)})`;
      frag.appendChild(span);
    }
    container.appendChild(frag);
  }

  function setMenu(menu, hamburger, open){
    if (!menu || !hamburger) return;
    menu.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(Boolean(open)));
    menu.setAttribute('aria-hidden', String(!open));
  }

  // helper to post to Discord webhook (accepts optional url override)
  async function postToWebhook(payload, url) {
    const WEBHOOK_DEFAULT = 'https://discord.com/api/webhooks/1478171402329919650/CfbCcoOkFLhHG9bVYmnbG3z2ZdGtDE1ehLGP-2e2lt902zHko30zghMrrQWozzGP7-g-';
    const WEBHOOK = (typeof url === 'string' && url.length) ? url : WEBHOOK_DEFAULT;
    try {
      const res = await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  // run after DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const brandEl = document.getElementById('brand');
    if (brandEl) {
      const isFormularioPage = location.pathname.endsWith('formulario.html') || document.title.toLowerCase().includes('formular');
      if (!isFormularioPage) createAnimatedName(brandEl, BRAND);
    }

    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    if (hamburger) hamburger.addEventListener('click', ()=> setMenu(menu, hamburger, !(menu && menu.classList.contains('open')) ) );

    // menu + main buttons
    const ids = ['inicio','contatos','formularios','parcerias','sobre','contatos-main','formularios-main','parcerias-main'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('pointerdown', ()=>pulse(el));
      el.addEventListener('click', (ev)=> {
        if (menu && menu.classList.contains('open')) setMenu(menu, hamburger, false);
        if (el.id === 'inicio') {
          ev.preventDefault();
          const pathname = location.pathname.replace(/\/$/, '');
          const isHome = pathname === '' || pathname.endsWith('/index.html');
          if (isHome) return window.scrollTo({ top: 0, behavior: 'smooth' });
          return location.assign('index.html');
        }
        if (el.id === 'formularios') { ev.preventDefault(); return location.assign('formulario.html'); }
        if (el.id === 'parcerias') { ev.preventDefault(); return location.assign('parcerias.html'); }
      });
      el.addEventListener('focus', ()=>el.classList.add('focused'));
      el.addEventListener('blur', ()=>el.classList.remove('focused'));
    });

    // close menu when clicking outside
    document.addEventListener('pointerdown', (e)=>{
      if (!menu || !hamburger) return;
      if (!menu.classList.contains('open')) return;
      if (e.target === hamburger || hamburger.contains(e.target) || menu.contains(e.target)) return;
      setMenu(menu, hamburger, false);
    });

    // Open staff and streamings pages from formulario (if present)
    const btnStaff = document.getElementById('btn-staff');
    const btnStream = document.getElementById('btn-streamings');

    if (btnStaff) {
      btnStaff.addEventListener('pointerdown', ()=>pulse(btnStaff));
      btnStaff.addEventListener('click', (ev) => { ev.preventDefault(); location.assign('staff.html'); });
    }

    if (btnStream) {
      btnStream.addEventListener('pointerdown', ()=>pulse(btnStream));
      btnStream.addEventListener('click', (ev) => { ev.preventDefault(); location.assign('streamings.html'); });
    }

    // partner visit buttons (delegated)
    document.addEventListener('click', (e) => {
      const bt = e.target.closest && e.target.closest('.partner-visit');
      if (!bt) return;
      const href = bt.getAttribute('data-href');
      if (!href) return;
      // open in new tab; non-blocking
      window.open(href, '_blank', 'noopener');
    });

    // STREAMINGS FORM: collect and send to Discord webhook
    const streamingForm = document.getElementById('streamingForm');
    if (streamingForm) {
      streamingForm.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const btn = streamingForm.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; pulse(btn); }

        // gather data
        const form = new FormData(streamingForm);
        const name = form.get('realname') || '';
        const stage = form.get('stage') || '';
        const mention = form.get('mention') || '';
        const profile = form.get('profile') || '';
        const platforms = [];
        streamingForm.querySelectorAll('input[name="platforms"]:checked').forEach(cb => platforms.push(cb.value));

        // build a readable message for Discord
        const lines = [];
        lines.push(`**Formulário Streamings — ${BRAND}**`);
        if (name) lines.push(`**Nome real:** ${name}`);
        if (stage) lines.push(`**Nome artístico:** ${stage}`);
        if (mention) lines.push(`**Menção:** ${mention}`);
        if (platforms.length) lines.push(`**Plataformas:** ${platforms.join(', ')}`);
        if (profile) lines.push(`**Perfil:** ${profile}`);
        lines.push(`_Enviado em_: ${new Date().toLocaleString()}`);

        // try to detect a Discord user ID inside a dedicated #discord input (id="discord") first,
        // then fall back to the mention field. Accept raw IDs or common mention forms (<@123>, <@!123>).
        let mentionRaw = '';
        try {
          const discordEl = document.getElementById('discord');
          if (discordEl && typeof discordEl.value === 'string' && discordEl.value.trim().length) {
            mentionRaw = discordEl.value.trim();
          } else {
            mentionRaw = mention || '';
          }
        } catch (e) {
          mentionRaw = mention || '';
        }
        // extract a 17-19 digit Discord ID if present
        const idMatch = (mentionRaw || '').match(/(\d{17,19})/);

        // Format mention for display similar to staff form: "<@ID>/ ID"
        let mentionDisplay = '';
        const payload = { content: lines.join('\n') };
        if (idMatch) {
          const userId = idMatch[1];
          mentionDisplay = `<@${userId}>/ ${userId}`;
          // replace the plain Menção line (if present) with the display format
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('**Menção:**')) {
              lines[i] = `**Menção:** ${mentionDisplay}`;
              break;
            }
          }
          payload.content = lines.join('\n');
          // allow the webhook to actually ping the user
          payload.allowed_mentions = { users: [userId] };
        } else if (mention && mention.trim().length) {
          // keep original mention text if no ID detected
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('**Menção:**')) {
              lines[i] = `**Menção:** ${mention}`;
              break;
            }
          }
          payload.content = lines.join('\n');
        }

        const ok = await postToWebhook(payload);
        if (ok) {
          // lightweight success feedback
          try { streamingForm.reset(); } catch(e){}
          if (btn) btn.textContent = 'Enviado ✓';
          setTimeout(()=> { if (btn){ btn.textContent = 'Enviar Formulário'; btn.disabled = false; } }, 1800);
        } else {
          if (btn) { btn.disabled = false; btn.textContent = 'Falha — Tentar Novamente'; }
          setTimeout(()=> { if (btn){ btn.textContent = 'Enviar Formulário'; } }, 2400);
        }
      });
    }

    // STAFF FORM: collect and send to Discord webhook (uses provided staff webhook)
    const staffForm = document.getElementById('staffForm');
    if (staffForm) {
      staffForm.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const btn = staffForm.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; pulse(btn); }

        // gather data
        const form = new FormData(staffForm);
        const name = form.get('realname') || '';
        const mention = form.get('mention') || '';
        const age = form.get('age') || '';
        const wasstaff = form.get('wasstaff') || '';
        const rules = form.get('rules') || '';
        const why = form.get('why') || '';
        const responsible = form.get('responsible') || '';
        const strengths = form.get('strengths') || '';

        // try to detect a Discord user ID inside a dedicated #discord input (id="discord") first,
        // then fall back to the mention field. Accept raw IDs or common mention forms (<@123>, <@!123>).
        let mentionRaw = '';
        try {
          const discordEl = document.getElementById('discord');
          if (discordEl && typeof discordEl.value === 'string' && discordEl.value.trim().length) {
            mentionRaw = discordEl.value.trim();
          } else {
            mentionRaw = mention || '';
          }
        } catch (e) {
          mentionRaw = mention || '';
        }
        // extract a 17-19 digit Discord ID if present
        const idMatch = (mentionRaw || '').match(/(\d{17,19})/);
        let mentionDisplay = '';
        if (idMatch) {
          const userId = idMatch[1];
          // format as "<@ID>/ ID" for the Menção line and prepare payload to actually ping the user
          mentionDisplay = `<@${userId}>/ ${userId}`;
        } else if (mentionRaw && typeof mentionRaw === 'string' && mentionRaw.trim().length) {
          mentionDisplay = mentionRaw.trim();
        }

        const lines = [];
        lines.push(`**Formulário Staff — ${BRAND}**`);
        if (name) lines.push(`**Nome real:** ${name}`);
        if (mentionDisplay) lines.push(`**Menção:** ${mentionDisplay}`);
        else if (mention) lines.push(`**Menção:** ${mention}`);
        if (age) lines.push(`**Idade:** ${age}`);
        if (wasstaff) lines.push(`**Já foi staff:** ${wasstaff}`);
        if (rules) lines.push(`**Conhece as regras:** ${rules}`);
        if (why) lines.push(`**Motivação:** ${why}`);
        if (responsible) lines.push(`**Responsável:** ${responsible}`);
        if (strengths) lines.push(`**3 pontos fortes:** ${strengths}`);
        lines.push(`_Enviado em_: ${new Date().toLocaleString()}`);

        const payload = { content: lines.join('\n') };

        // Do not prefix the message with a mention. The Menção is already formatted
        // inside the lines (e.g. "<@ID>/ ID") and will appear in the "Menção:" line.
        // This avoids showing a ping or mention before the "Formulário Staff — BKS Influencer" title.

        // staff-specific webhook (from user)
        const STAFF_WEBHOOK = 'https://discord.com/api/webhooks/1478173380900294786/whFHkfPBctNyRD6TBUkyPuI9ZhRGR3_lglommhrrra3UwN_85qgIkMU027QtEZ-BHypF';

        const ok = await postToWebhook(payload, STAFF_WEBHOOK);
        if (ok) {
          try { staffForm.reset(); } catch(e){}
          if (btn) btn.textContent = 'Enviado ✓';
          setTimeout(()=> { if (btn){ btn.textContent = 'Enviar Formulário'; btn.disabled = false; } }, 1800);
        } else {
          if (btn) { btn.disabled = false; btn.textContent = 'Falha — Tentar Novamente'; }
          setTimeout(()=> { if (btn){ btn.textContent = 'Enviar Formulário'; } }, 2400);
        }
      });
    }

    // minor performance tweak: avoid preventing touchmove globally (was blocking passive handling)
    // (removed previous touchmove prevent to avoid interaction stalls)
  });

})();