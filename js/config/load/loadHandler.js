import { LichessApiHandler } from './lichessApiHandler.js';
import { puzzleDataTemplate, trainingDataTemplate } from '../../app/trainingDataHandler.js';
import { Training } from '../../app/training.js';
import { switchConnectedButtonsInArray } from '../configHandler.js'

/**
* The load handler manages the initialization of new training sessions from lichess studies.
*/

export class LoadHandler {
    constructor(chessboard) {
        this.chessboard = chessboard;
        this.lichessApiHandler = new LichessApiHandler();
        this.initUIElements();
        this.setupEventListeners();
        const trainingData = this.getTrainingDataFromLocalStorage();
        this.training = trainingData ? new Training(trainingData, this.chessboard) : null;
    }

    initUIElements() {
        this.loadButton = document.getElementById('loadButton'); 
        const loadContainerButtons = Array.from(document.getElementById('loadContainerButtons').children);
        const loadOptions = document.getElementById('loadOptions');
        switchConnectedButtonsInArray(loadContainerButtons, loadOptions, 0);
        // lichessContainer
        this.generateApiKey = document.getElementById('generateApiKey');
        this.apiKeyInput = document.getElementById('apiKeyInput');
        const apiKey = this.getApiKeyFromLocalStorage();
        this.apiKeyInput.value = apiKey ? apiKey : "";
        this.studyLinkInput = document.getElementById('studyLinkInput');
        this.studyDownloadButton = document.getElementById('studyDownloadButton');
        this.studyDownloadButton.listen = false;
        // folderContainer
        // historyContainer
        // favoriteContainer
    }

    setupEventListeners() {
        this.studyDownloadButton.addEventListener('click', async () => {
            let apiKey = this.apiKeyInput.value; 
            let url = this.studyLinkInput.value;
            if (url !== '') {
                try {
                    // set api key for lichessHandler
                    this.lichessApiHandler.apiKey = apiKey; 
                    let pgnString = await this.lichessApiHandler.getStudy(url);
                    // create trainingData
                    let pgnArray = this.splitPGN(pgnString);
                    let puzzles = [];
                    pgnArray.forEach((pgn, index) => {
                        const puzzleData = { ...puzzleDataTemplate }; // Clone template object
                        puzzleData["pgn"] = pgn;
                        puzzles.push(puzzleData);
                    });
                    let trainingData = { ...trainingDataTemplate }; // Clone template object
                    trainingData["puzzles"] = puzzles;
                    // TODO: extract lichess study url for each pgn
                    // start new training
                    this.training = new Training(trainingData, this.chessboard);
                    localStorage.setItem('lichessStudyTrainerTrainingData', JSON.stringify(trainingData));
                    // only store api key in localStorage, after download of study succeded
                    localStorage.setItem('lichessStudyTrainerApiKey', apiKey);
                    // close load dialog
                    this.loadButton.click();
                } catch (error) {
                    console.error('Failed to load study:', error);
                }
            }
        });
    }

    getTrainingDataFromLocalStorage() {
        return JSON.parse(localStorage.getItem('lichessStudyTrainerTrainingData'));
    }

    getApiKeyFromLocalStorage(){
        return localStorage.getItem('lichessStudyTrainerApiKey');
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
