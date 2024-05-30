import { LichessHandler } from '../misc/lichessHandler.js';
import { puzzleDataTemplate, trainingDataTemplate } from '../app/trainingDataHandler.js';
import { Training } from '../app/training.js';
import spinJs from 'https://cdn.jsdelivr.net/npm/spin.js@4.1.1/+esm';

/**
 * The load handler manages the initialization of new training sessions from lichess studies.
 */
export class LoadHandler {
    constructor(chessboard) {
        this.chessboard = chessboard;
        this.lichessHandler = new LichessHandler();
        this.initUIElements();
        this.setupEventListeners();
        const trainingData = this.getTrainingDataFromLocalStorage();
        this.training = trainingData ? new Training(trainingData, this.chessboard) : null;
    }

    initUIElements() {
        this.loadButton = document.getElementById('loadButton');
        this.apiKeyInput = document.getElementById('apiKeyInput');
        const apiKey = this.getApiKeyFromLocalStorage();
        this.apiKeyInput.value = apiKey ? apiKey : "";
        this.studyLinkInput = document.getElementById('studyLinkInput');
        this.studyDownloadButton = document.getElementById('studyDownloadButton');
    }

    setupEventListeners() {
        this.studyDownloadButton.addEventListener('click', async () => {
            let apiKey = this.apiKeyInput.value; 
            let url = this.studyLinkInput.value;
            if (url !== '') {
                try {
                    // set api key for lichessHandler
                    this.lichessHandler.apiKey = this.apiKey; 
                    let pgnString = await this.lichessHandler.getStudy(url);
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
