import { LoadHandler } from './load/loadHandler.js';
import { SettingsHandler } from './settingsHandler.js';

export function switchConnectedButtonsInArray(buttonArray, parentContainer, selectedButton ){
    buttonArray.forEach((button, index) => {
            button.addEventListener('click', () => {
                // handle special config button switch
                if(selectedButton != null && index != selectedButton){
                    buttonArray[selectedButton].state = 0;
                }
                selectedButton = index;
                // handle new container overlay according to cycle button state data entry
                const containerId = button.data;
                const container = document.getElementById(containerId);
                const children = parentContainer.children;
                for (let i = 0; i < children.length; i++) {
                    children[i].classList.add('hide');
                }
                container.classList.remove('hide');
            });
        });
}

export class ConfigHandler {
    constructor(chessboard) {  
        const configButtons = Array.from(document.getElementById('configButtons').children);
        const middleContainer = document.getElementById('middleContainer');
        switchConnectedButtonsInArray(configButtons, middleContainer);
        const loadHandler = new LoadHandler(chessboard);
        const settingsHandler = new SettingsHandler(chessboard);
        //const infoHandler = new InfoHandler();
        //const helpHandler = new HelpHandler();
    }
}
