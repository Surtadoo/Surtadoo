// Main entry point - imports and initializes the application
import { GameHub } from './modules/GameHub.js';

// Initialize the game hub when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.gameHub = new GameHub();
});