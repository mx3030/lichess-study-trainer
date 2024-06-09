import { switchConnectedCycleButtonsInArray } from '../misc/utils.js'
import { LoadHandler } from './load/loadHandler.js';
import { SettingsHandler } from './settingsHandler.js';
import { InfoHandler } from '../misc/infoHandler.js';
import { HelpHandler } from '../misc/helpHandler.js';

export class ConfigHandler {
    constructor(chessboard) {  
        this.initUIElements();
        const loadHandler = new LoadHandler(chessboard);
        const settingsHandler = new SettingsHandler(chessboard);
        const infoHandler = new InfoHandler();
        const helpHandler = new HelpHandler();
    }

    initUIElements(){
        const configButtons = Array.from(document.getElementById('configButtons').children);
        const middleContainer = document.getElementById('middleContainer');
        switchConnectedCycleButtonsInArray(configButtons, middleContainer);
    }
}
