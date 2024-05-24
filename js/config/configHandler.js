import { LoadHandler } from './loadHandler.js';
import { SettingsHandler } from './settingsHandler.js'

export class ConfigHandler {
    constructor(chessboard){  
        this.initUIElements(); 
        this.setupEventListeners();
        
        this.loadHandler = new LoadHandler();
        this.settingsHandler = new SettingsHandler(chessboard);
        this.activeButton = null;
    }

    initUIElements(){
        this.boardContainer = document.getElementById('boardContainer');   
        this.loadButton = document.getElementById('loadButton'); 
        this.settingsButton = document.getElementById('settingsButton');
        this.infoButton = document.getElementById('infoButton');
        this.helpButton = document.getElementById('helpButton');
    }

    setupEventListeners() { 
        const buttons = [this.loadButton, this.settingsButton, this.infoButton, this.helpButton];
        buttons.forEach((button, index) => {
            button.addEventListener('click', ()=>{
                this.toggleButton(button);
            })
        })   
    }
     
    toggleButton(button) {
        const container = document.getElementById(button.dataset.container);
        button.classList.toggle('active');
        container.classList.toggle('active');
        if (this.activeButton == null){
            this.boardContainer.classList.toggle('active');
            this.activeButton = button;
        } else if (button == this.activeButton){
            this.boardContainer.classList.toggle('active');
            this.activeButton = null;
        } else {
            const oldContainer = document.getElementById(this.activeButton.dataset.container);
            oldContainer.classList.toggle('active'); 
            this.activeButton.classList.toggle('active');
            this.activeButton = button;
        }  
    }

}
