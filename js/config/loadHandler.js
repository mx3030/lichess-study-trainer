import { LICHESS_API_KEY } from '/config.js';
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
        this.lichessHandler = new LichessHandler(LICHESS_API_KEY);
        this.initUIElements();
        this.setupEventListeners();
        const trainingData = this.getTrainingDataFromLocalStorage();
        this.training = trainingData ? new Training(trainingData, this.chessboard) : null;
    }

    initUIElements() {
        this.loadButton = document.getElementById('loadButton');
        this.loadContainerButton = document.getElementById('loadContainerButton');
        this.loadContainerInput = document.getElementById('loadContainerInput');
    }

    setupEventListeners() {
        this.loadContainerButton.addEventListener('click', async () => {
            let url = this.loadContainerInput.value;
            if (url !== '') {
                try {
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
                    // close load dialog
                    this.loadButton.click();
                } catch (error) {
                    console.error('Failed to load study:', error);
                }
            }
        });
    }

    getTrainingDataFromLocalStorage() {
        return JSON.parse(localStorage.getItem('lichessStudyTrainingData'));
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
