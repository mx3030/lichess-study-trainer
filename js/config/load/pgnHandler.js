import { puzzleDataTemplate, trainingDataTemplate } from '../../app/trainingDataHandler.js';

export class PGNHandler {
    constructor(){

    }

    createTrainingData(pgnString){
        let pgnArray = this.splitPGN(pgnString);
        let puzzles = [];
        pgnArray.forEach((pgn, index) => {
            const puzzleData = { ...puzzleDataTemplate }; // Clone template object
            puzzleData["pgn"] = pgn;
            puzzles.push(puzzleData);
        });
        let trainingData = { ...trainingDataTemplate }; // Clone template object
        trainingData["puzzles"] = puzzles;
        return trainingData;
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
