// Handles game filtering by category and platform
export class FilterManager {
    constructor(gameHub) {
        this.gameHub = gameHub;
    }

    normalizeString(str = '') {
        return str
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/gi, '')
            .toLowerCase();
    }

    filterByCategory(category) {
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobileMenu');
        mobileMenu.classList.remove('active');

        // Close dropdown
        const dropdown = document.querySelector('.mobile-menu-item.dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }

        // Use GameHub's filter but ensure category normalized synonyms
        this.gameHub.filterGames(category);

        // Scroll to games
        document.querySelector('.games-grid').scrollIntoView({ behavior: 'smooth' });
    }

    filterByPlatform(platform) {
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) mobileMenu.classList.remove('active');

        // Close dropdown
        const dropdown = document.querySelectorAll('.mobile-menu-item.dropdown');
        dropdown.forEach(d => d.classList.remove('active'));

        // Normalize platform param and compare normalized game.platform
        const target = this.normalizeString(platform);

        this.gameHub.currentFilter = platform;
        this.gameHub.filteredGames = this.gameHub.games.filter(game => {
            const gp = this.normalizeString(game.platform || '');
            return gp === target;
        });
        this.gameHub.renderGames();

        // Scroll to games
        document.querySelector('.games-grid').scrollIntoView({ behavior: 'smooth' });
    }
}