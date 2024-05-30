import { LoadHandler } from './loadHandler.js';
import { SettingsHandler } from './settingsHandler.js';

export class ConfigHandler {
    constructor(chessboard) {  
        this.setupEventListeners(); 
        this.loadHandler = new LoadHandler(chessboard);
        this.settingsHandler = new SettingsHandler(chessboard);
        this.selectedButton = null;
    }

    setupEventListeners() { 
        const configButtons = Array.from(document.getElementById('configButtons').children);
        const middleContainer = document.getElementById('middleContainer');
        configButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                // handle special config button switch
                if(this.selectedButton != null && index != this.selectedButton){
                    configButtons[this.selectedButton].state = 0;
                }
                this.selectedButton = index;
                // handle new container overlay according to cycle button state data entry
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

