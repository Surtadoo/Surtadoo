const produtos = {
  1: {
    nome: 'VIP Bronze',
    preco: 9.90,
    desc: 'Benefícios básicos por 30 dias',
    tag: 'Vips',
    imagem: 'https://cdn.discordapp.com/attachments/1393346324010635355/1478168219679461396/1717649707243-1.jpg?ex=69a76aee&is=69a6196e&hm=cc2f6e2bcb9d18838a133254aee4726265685110c05b47e2efbeb28c79a35ceb&'
  },
  2: {
    nome: 'VIP Prata',
    preco: 19.90,
    desc: 'Benefícios intermediários por 30 dias',
    tag: 'Vips',
    imagem: 'https://cdn.discordapp.com/attachments/1393346324010635355/1478168219679461396/1717649707243-1.jpg?ex=69a76aee&is=69a6196e&hm=cc2f6e2bcb9d18838a133254aee4726265685110c05b47e2efbeb28c79a35ceb&'
  },
  3: {
    nome: 'VIP Ouro',
    preco: 29.90,
    desc: 'Benefícios avançados por 30 dias',
    tag: 'Vips',
    imagem: 'https://cdn.discordapp.com/attachments/1393346324010635355/1478168219679461396/1717649707243-1.jpg?ex=69a76aee&is=69a6196e&hm=cc2f6e2bcb9d18838a133254aee4726265685110c05b47e2efbeb28c79a35ceb&'
  },
  4: {
    nome: 'VIP Platina',
    preco: 49.90,
    desc: 'Benefícios premium por 30 dias',
    tag: 'Vips',
    imagem: 'https://cdn.discordapp.com/attachments/1393346324010635355/1478168219679461396/1717649707243-1.jpg?ex=69a76aee&is=69a6196e&hm=cc2f6e2bcb9d18838a133254aee4726265685110c05b47e2efbeb28c79a35ceb&'
  },
  5: {
    nome: 'VIP Diamante',
    preco: 99.90,
    desc: 'Benefícios completos por 30 dias',
    tag: 'Vips',
    imagem: 'foto1.png'
  },
  6: {
    nome: 'VIP Masters',
    preco: 149.90,
    desc: 'Benefícios ilimitados por 30 dias',
    tag: 'Vips',
    imagem: 'foto1.png'
  },
  7: {
    nome: 'Pacote Dinheiro',
    preco: 19.90,
    desc: 'Dinheiro virtual para sua conta',
    tag: 'Dinheiro',
    imagem: 'foto1.png'
  },
  8: {
    nome: 'Kit Armas',
    preco: 29.90,
    desc: 'Conjunto de armas básicas',
    tag: 'Armas',
    imagem: 'foto1.png'
  },
  9: {
    nome: 'Pacote Veículos',
    preco: 59.90,
    desc: 'Veículos exclusivos',
    tag: 'Veículos',
    imagem: 'foto1.png'
  },
  10: {
    nome: 'Punição Reversão',
    preco: 9.90,
    desc: 'Serviço de reversão de punição (exemplo)',
    tag: 'Punições',
    imagem: 'foto1.png'
  }
};

let pendingItem = null;

function renderProdutos() {
  const grid = document.getElementById('produtos-grid');
  grid.innerHTML = '';
  Object.entries(produtos).forEach(([id, prod]) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.prod = id;
    card.dataset.tag = prod.tag; // save tag on card element
    card.innerHTML = `
      <img src="${prod.imagem}" alt="${prod.nome}" class="card-img" />
      <h3 class="card-title">${prod.nome}</h3>
      <p class="card-price">R$ ${prod.preco.toFixed(2).replace('.', ',')}</p>
      <span class="card-tag">${prod.tag}</span>
      <div class="card-actions">
        <button class="btn-buy">Comprar</button>
        <button class="btn-info">ℹ️</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

renderProdutos();

const couponDrawer = document.getElementById('coupon-drawer');
const couponInput = document.getElementById('coupon-input');
const couponClose = document.getElementById('coupon-close');
const couponCancel = document.getElementById('coupon-cancel');
const couponApply = document.getElementById('coupon-apply');
const couponAdd = document.getElementById('coupon-add');

// Ensure pending item always has an id when possible
function resolveItemId(item) {
  // if already has id, return as-is
  if (item && item.id) return { ...item };
  // try to match by name to find id in produtos
  if (item && item.nome) {
    for (const [key, val] of Object.entries(produtos)) {
      if (val.nome === item.nome) {
        return { ...item, id: key };
      }
    }
  }
  // fallback: return item unchanged
  return { ...item };
}

function openCouponDrawerForItem(item) {
  pendingItem = resolveItemId(item);
  if (couponDrawer) {
    couponDrawer.classList.add('show');
    if (couponInput) {
      couponInput.value = '';
      couponInput.focus();
    }
  }
}

// expose for other scripts (script.js) to call if needed
try {
  window.openCouponDrawerForItem = openCouponDrawerForItem;
} catch (err) {
  // noop
}

function closeCouponDrawer() {
  if (couponDrawer) couponDrawer.classList.remove('show');
  if (couponInput) couponInput.value = '';
  pendingItem = null;
}

if (couponClose) {
  couponClose.addEventListener('click', closeCouponDrawer);
}
if (couponCancel) {
  couponCancel.addEventListener('click', closeCouponDrawer);
}
if (couponApply) {
  couponApply.addEventListener('click', () => {
    if (!couponInput) return;
    couponInput.classList.add('coupon-applied');
    setTimeout(() => couponInput.classList.remove('coupon-applied'), 800);
  });
}
if (couponAdd) {
  couponAdd.addEventListener('click', () => {
    if (!pendingItem || typeof addToCart !== 'function') {
      closeCouponDrawer();
      return;
    }
    const code = couponInput ? couponInput.value.trim() : '';
    const itemToAdd = { ...pendingItem };
    if (code) itemToAdd.cupom = code;
    addToCart(itemToAdd);
    closeCouponDrawer();
  });
}

document.querySelectorAll('.btn-buy').forEach(btn => {
  btn.addEventListener('click', e => {
    // Prevent event from bubbling to the document-level delegated handler
    // which would otherwise also handle .btn-buy clicks and could add the
    // product directly to the cart. We want only the coupon/add flow.
    e.preventDefault();
    e.stopPropagation();

    const card = e.target.closest('.card');
    const id = card.dataset.prod;
    const img = card.querySelector('.card-img').src;
    const nome = card.querySelector('.card-title').textContent;
    const preco = parseFloat(card.querySelector('.card-price').textContent.replace('R$ ', '').replace(',', '.'));

    // pass the id so addToCart knows which product was clicked
    openCouponDrawerForItem({ id, img, nome, preco });

    // Open the cart drawer immediately after adding the product
    // const cartDrawer = document.getElementById('cart-drawer');
    // if (cartDrawer) cartDrawer.classList.add('show');
  });
});

document.querySelectorAll('.btn-info').forEach(btn => {
  btn.addEventListener('click', e => {
    const card = e.target.closest('.card');
    const id = card.dataset.prod;
    const img = card.querySelector('.card-img').src;
    const prod = produtos[id];

    document.getElementById('modal-img').src = img;
    document.getElementById('modal-title').textContent = prod.nome;
    document.getElementById('modal-price').textContent = `R$ ${prod.preco.toFixed(2).replace('.', ',')}`;
    document.getElementById('modal-desc').textContent = prod.desc;
    document.getElementById('prod-modal').classList.add('show');
  });
});

document.querySelector('.modal-close').addEventListener('click', () => {
  document.getElementById('prod-modal').classList.remove('show');
});

document.getElementById('modal-buy').addEventListener('click', () => {
  const img = document.getElementById('modal-img').src;
  const nome = document.getElementById('modal-title').textContent;
  const preco = parseFloat(document.getElementById('modal-price').textContent.replace('R$ ', '').replace(',', '.'));

  // attempt to resolve id from produtos before opening coupon drawer
  openCouponDrawerForItem({ img, nome, preco });

  document.getElementById('prod-modal').classList.remove('show');
});