// Core GameHub class that orchestrates the application
import { games } from '../games-data.js';
import { UIManager } from './UIManager.js';
import { ModalManager } from './ModalManager.js';
import { FilterManager } from './FilterManager.js';
import { SearchManager } from './SearchManager.js';

export class GameHub {
    constructor() {
        this.games = games;
        this.filteredGames = [...games];
        this.currentFilter = 'all';
        
        // Initialize managers
        this.uiManager = new UIManager(this);
        this.modalManager = new ModalManager(this);
        this.filterManager = new FilterManager(this);
        this.searchManager = new SearchManager(this);
        
        this.init();
    }

    // add normalization helper
    normalizeString(str = '') {
        return str
            .toString()
            .normalize('NFD')               // decompose accents
            .replace(/[\u0300-\u036f]/g, '')// remove accents
            .replace(/[^a-z0-9]/gi, '')     // remove non-alphanumeric
            .toLowerCase();
    }

    init() {
        this.uiManager.setupEventListeners();
        this.renderGames();
    }

    filterGames(category) {
        this.currentFilter = category;
        if (!category || category === 'all') {
            this.filteredGames = [...this.games];
        } else {
            const normalizedCategory = this.normalizeString(category);

            // map some common synonyms
            const mapping = {
                'action': 'acao',
                'acao': 'acao',
                'adventure': 'aventura',
                'aventura': 'aventura',
                'horror': 'terror',
                'terror': 'terror',
                'racing': 'corrida',
                'corrida': 'corrida',
                'arcade': 'arcade',
                'aplicativos': 'aplicativos',
                'application': 'aplicativos',
                'console': 'console',
                'fighting': 'luta',
                'luta': 'luta',
                'survival': 'sobrevivencia',
                'sobrevivencia': 'sobrevivencia',
                'simulation': 'simulacao',
                'simulacao': 'simulacao',
                'rpg': 'rpg',
                'futebol': 'futebol',
                'football': 'futebol',
                'strategy': 'estrategia',
                'estrategia': 'estrategia'
            };

            const target = mapping[normalizedCategory] || normalizedCategory;

            this.filteredGames = this.games.filter(game => {
                const gameCat = this.normalizeString(game.category || '');
                return gameCat === target;
            });
        }
        this.renderGames();
    }

    filterByCategory(category) {
        this.filterManager.filterByCategory(category);
    }

    filterByPlatform(platform) {
        this.filterManager.filterByPlatform(platform);
    }

    searchGames(searchTerm) {
        this.searchManager.searchGames(searchTerm);
    }

    showParcerias() {
        this.modalManager.showParcerias();
    }

    showDoacoes() {
        this.modalManager.showDoacoes();
    }

    copiarChave(texto) {
        this.modalManager.copiarChave(texto);
    }

    renderGames() {
        this.uiManager.renderGames(this.filteredGames);
    }

    goToHome() {
        this.uiManager.goToHome();
    }

    playGame(gameId) {
        const game = this.games.find(g => g.id === gameId);
        if (game) {
            window.open(game.url, '_blank');
        }
    }

    showGameModal(game) {
        this.modalManager.showGameModal(game);
    }
}