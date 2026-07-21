// Handles all UI-related functionality and DOM manipulation
export class UIManager {
    constructor(gameHub) {
        this.gameHub = gameHub;
    }

    setupEventListeners() {
        // Modal event listeners
        const modal = document.getElementById('gameModal');
        const closeModal = document.getElementById('closeModal');
        
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Mobile menu event listeners
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const menuClose = document.getElementById('menuClose');

        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });

        menuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });

        // Close mobile menu when clicking outside
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('active');
            }
        });

        // Smooth scroll for dropdown items
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const dropdownMenu = item.closest('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.scrollTop = item.offsetTop - 20;
                }
            });
        });
    }

    renderGames(games) {
        const grid = document.getElementById('gamesGrid');
        const loading = document.getElementById('loading');
        const noGames = document.getElementById('noGames');

        loading.classList.add('hidden');
        
        if (games.length === 0) {
            grid.innerHTML = '';
            noGames.classList.remove('hidden');
            return;
        }

        noGames.classList.add('hidden');
        
        grid.innerHTML = games.map(game => `
            <div class="game-card" data-game-id="${game.id}" data-game="${encodeURIComponent(JSON.stringify(game))}">
                <img src="${game.image}" alt="${game.title}" class="game-image" loading="lazy" onerror="this.src='https://via.placeholder.com/400x200/1a1a1a/ff6b35?text=Game+Hub'; this.onerror=null;">
                <div class="game-content">
                    <h3 class="game-title">${game.title}</h3>
                    <p class="game-description">${game.description}</p>
                    <div class="game-meta">
                        <span class="game-category">${game.category}</span>
                        <span class="game-platform">${game.platform}</span>
                        <button class="play-btn" onclick="event.stopPropagation(); event.preventDefault(); window.open('${game.url}', '_blank');">Download</button>
                    </div>
                </div>
            </div>
        `).join('');

        this.setupSmoothScroll();
    }

    setupSmoothScroll() {
        // Rolagem suave para os cards de jogos
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Se não for um clique no botão de download, rola suavemente
                if (!e.target.classList.contains('play-btn')) {
                    e.preventDefault();
                    // Read encoded JSON stored in data-game attribute (guarded)
                    try {
                        const raw = card.dataset.game;
                        if (!raw) return;
                        const gameData = JSON.parse(decodeURIComponent(raw));
                        this.gameHub.showGameModal(gameData);
                    } catch (err) {
                        console.error('Erro ao abrir modal do jogo:', err);
                    }
                }
            });
        });

        // Rolagem suave para o modal quando abrir
        const modalObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('active')) {
                    const modal = document.getElementById('gameModal');
                    modal.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            });
        });

        const modal = document.getElementById('gameModal');
        modalObserver.observe(modal, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    goToHome() {
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobileMenu');
        mobileMenu.classList.remove('active');
        
        // Reset to show all games
        this.gameHub.filterGames('all');
        
        // Scroll to top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update active nav button
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-filter="all"]').classList.add('active');
    }
}