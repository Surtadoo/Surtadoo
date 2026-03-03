const parcerias = [
  {
    id: 1,
    nome: 'Portifolio do Surtado',
    descricao: 'Portifolio do Surtado com serviços tops e baratos',
    imagem: 'foto1.png',
    link: 'https://portifolio011.netlify.app'
  },
  {
    id: 2,
    nome: '🤯⃟⃤BKS INFLUENCER',
    descricao: 'Bem-vindo ao BKS INFLUENCER! 🎬 O ponto de encontro oficial para criadores de conteúdo e streamers. Aqui, conectamos talentos, divulgamos vídeos novos e notificamos suas lives em tempo real. Explore nossa área de benefícios exclusivos, participe das calls de influencers e cresça com a gente! Seja você do cenário de RP ou Mobile, seu lugar é aqui. Junte-se à elite e transforme sua paixão em influência! ✨',
    imagem: 'bks.png',
    link: 'https://discord.gg/DGcMCmVVB'
  },
  {
    id: 3,
    nome: 'Reverse store',
    descricao: 'Rede de servidores de roleplay com diversas modalidades',
    imagem: 'foto1.png',
    link: 'https://discord.gg/26kuKRVxjv'
  },
  {
    id: 4,
    nome: 'Daniloqz',
    descricao: 'Cidade virtual com economia realista e sistemas únicos',
    imagem: 'foto1.png',
    link: 'https://discord.gg/8tVYp7Y96B'
  },
  {
    id: 5,
    nome: 'Royal sistema',
    descricao: 'Cidade virtual com economia realista e sistemas únicos',
    imagem: 'foto1.png',
    link: 'https://discord.gg/5t3X35KXV'
  },
  {
    id: 6,
    nome: 'Atlas',
    descricao: 'Cidade virtual com economia realista e sistemas únicos',
    imagem: 'foto1.png',
    link: 'https://discord.gg/3JkGv5JYDh'
  }
];

function renderParcerias() {
  const grid = document.getElementById('partnerships-grid');
  grid.innerHTML = '';

  parcerias.forEach(parceria => {
    const card = document.createElement('div');
    card.className = 'partnership-card';
    card.innerHTML = `
      <img src="${parceria.imagem}" alt="${parceria.nome}" class="partnership-img" />
      <h3 class="partnership-title">${parceria.nome}</h3>
      <p class="partnership-desc">${parceria.descricao}</p>
      <a href="${parceria.link}" target="_blank" class="btn primary partnership-btn">Entrar</a>
    `;
    grid.appendChild(card);
  });
}

renderParcerias();