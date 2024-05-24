import { LICHESS_API_KEY } from '/config.js';
import { LichessHandler } from '../misc/lichessHandler.js'
import spinJs from 'https://cdn.jsdelivr.net/npm/spin.js@4.1.1/+esm'

export class LoadHandler{
    constructor(){ 
        this.lichessHandler = new LichessHandler(LICHESS_API_KEY);
        this.initUIElements();
        this.setupEventListeners();
    }

    initUIElements(){
        this.loadButton = document.getElementById('loadButton'); 
        this.loadContainerButton = document.getElementById('loadContainerButton');
        this.loadContainerInput = document.getElementById('loadContainerInput');
        this.playButton = document.getElementById('playButton');
        this.pauseButton = document.getElementById('pauseButton');
        this.gameModeButtons = document.getElementById('gameModeButtons');
    }

    setupEventListeners(){
        this.loadContainerButton.addEventListener('click', async () => {
            let url = this.loadContainerInput.value;
            if (url !== '') {
                try {
                    let pgnString = await this.lichessHandler.getStudy(url);                    
                    let pgnArray = this.splitPGN(pgnString);
                    let pgnJSON = JSON.stringify(pgnArray);
                    localStorage.setItem('lichess-study-trainer-pgn', pgnJSON);
                    this.loadButton.click();
                    this.playButton.classList.remove('hide');
                    this.pauseButton.classList.add('hide');
                    this.gameModeButtons.classList.remove('hide');
                } catch (error) {
                    console.error('Failed to load study:', error);
                }
            }
        });
    }

    splitPGN(pgn) {
        let games = pgn.split('[Event');
        let cleanGames = [];
        for (let game of games) {
            let trimmedGame = game.trim();
            if (trimmedGame.length > 0) {
                cleanGames.push('[Event' + trimmedGame);
            }
        }
        return cleanGames;
    }

}
