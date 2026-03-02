/*
  script.js
  - Builds the animated "BKS Influencer" name by splitting letters into spans
  - Adds a randomized stagger so the animation feels lively
  - Adds a topbar hamburger that toggles a slide-down menu with items
  - Hooks click feedback for menu and main buttons
*/

const BRAND = "BKS Influencer";
const brandEl = document.getElementById('brand');

// create animated spans
function createAnimatedName(text){
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

    const delay = (Math.random()*600 - 300);
    span.style.animationDelay = `${delay}ms`;

    const scale = 0.98 + Math.random()*0.08;
    span.style.transform = `scale(${scale})`;

    frag.appendChild(span);
  }

  brandEl.appendChild(frag);
}

createAnimatedName(BRAND);

// menu toggle
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

function setMenu(open){
  if (!menu || !hamburger) return;
  menu.classList.toggle('open', open);
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(Boolean(open)));
  menu.setAttribute('aria-hidden', String(!open));
}

hamburger && hamburger.addEventListener('click', ()=>{
  const open = !menu.classList.contains('open');
  setMenu(open);
});

// Button feedback (visual)
function pulse(btn){
  if (!btn) return;
  try {
    btn.animate([
      { transform: 'scale(1)', boxShadow: '0 6px 18px rgba(0,0,0,0.6)' },
      { transform: 'scale(0.98)', boxShadow: '0 12px 30px rgba(140,0,197,0.18)' },
      { transform: 'scale(1)', boxShadow: '0 6px 18px rgba(0,0,0,0.6)' }
    ], { duration:300, easing:'cubic-bezier(.2,.8,.2,1)' });
  } catch(e){}
}

// Query menu items (menu and main duplicates)
const ids = ['contatos','formularios','parcerias','sobre','contatos-main','formularios-main','parcerias-main'];
ids.forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('pointerdown', ()=>pulse(el));
  el.addEventListener('click', ()=> {
    // simple demo behavior: close menu when a menu item clicked
    if (menu && menu.classList.contains('open')) setMenu(false);
  });
  el.addEventListener('focus', ()=>el.classList.add('focused'));
  el.addEventListener('blur', ()=>el.classList.remove('focused'));
});

// Close menu when tapping outside on small screens
document.addEventListener('pointerdown', (e)=>{
  if (!menu || !hamburger) return;
  if (!menu.classList.contains('open')) return;
  if (e.target === hamburger || hamburger.contains(e.target) || menu.contains(e.target)) return;
  setMenu(false);
});

// Prevent page scrolling to keep single-screen layout on touch devices
document.addEventListener('touchmove', e => { if (e.target === document.body) e.preventDefault(); }, { passive:false });