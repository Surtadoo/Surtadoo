// Handles search functionality
export class SearchManager {
    constructor(gameHub) {
        this.gameHub = gameHub;
        this.setupSearchListeners();
    }

    setupSearchListeners() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');

        const performSearch = () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (searchTerm === '') {
                this.gameHub.filterGames(this.gameHub.currentFilter);
            } else {
                this.searchGames(searchTerm);
            }
        };

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        searchInput.addEventListener('input', () => {
            if (searchInput.value === '') {
                this.gameHub.filterGames(this.gameHub.currentFilter);
            }
        });
    }

    searchGames(searchTerm) {
        const normalizedTerm = this.gameHub.normalizeString(searchTerm);
        this.gameHub.currentFilter = 'search';
        this.gameHub.filteredGames = this.gameHub.games.filter(game => {
            const title = this.gameHub.normalizeString(game.title || '');
            const desc = this.gameHub.normalizeString(game.description || '');
            const cat = this.gameHub.normalizeString(game.category || '');
            const plat = this.gameHub.normalizeString(game.platform || '');
            return title.includes(normalizedTerm) ||
                   desc.includes(normalizedTerm) ||
                   cat.includes(normalizedTerm) ||
                   plat.includes(normalizedTerm);
        });
        this.gameHub.renderGames();
        
        // Update active nav button
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => btn.classList.remove('active'));
    }
}