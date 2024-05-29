import { LoadHandler } from './loadHandler.js';
import { SettingsHandler } from './settingsHandler.js';

export class ConfigHandler {
    constructor(chessboard) {  
        this.setupEventListeners(); 
        this.loadHandler = new LoadHandler(chessboard);
        this.settingsHandler = new SettingsHandler(chessboard);
    }

    setupEventListeners() { 
        const configButtons = document.getElementById('configButtons');
        const middleContainer = document.getElementById('middleContainer');
        Array.from(configButtons.children).forEach(button => {
            button.addEventListener('click', () => {
                const containerId = button.data;
                const container = document.getElementById(containerId);
                const children = middleContainer.children;
                for (let i = 0; i < children.length; i++) {
                    children[i].classList.add('hide');
                }
                container.classList.remove('hide');
            });
        });
    }
}

