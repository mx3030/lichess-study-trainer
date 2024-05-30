/**
* A TrainingDataHandler
* - has methods to calculate advanced stats from trainingData.
* - has methods to apply filters for the creation of gameArrays in a Game class or the show filters in buttonGrid
* - methods get mainly called from a View class, to rearrange buttonGrid or improve ProgressView.
*/

export class TrainingDataHandler{
    constructor(trainingData){
        this._trainingData = trainingData;
    }

    get trainingData(){
        return this._trainingData;
    } 
    
    getArrayWithPuzzleIndices(){
        const array = [];
        this._trainingData["puzzles"].forEach((puzzle, index) => {
            array.push(index);
        })
        return array;
    }

    getArrayWithWrongPuzzleIndices(){
        const array = [];
        this._trainingData["puzzles"].forEach((puzzle, index) => {
            if(puzzle["isCorrect"]==false){
                array.push(index);
            }
        })
        return array;
    }

    getArrayWithMarkedPuzzleIndices(){
        const array = [];
        this._trainingData["puzzles"].forEach((puzzle, index) => {
            if(puzzle["isMarked"]){
                array.push(index);
            }
        })
        return array;
    }

    getPuzzlePGN(index){
        return this._trainingData["puzzles"][index]["pgn"]
    }

    handlePuzzleResult(index, result){
        this._trainingData["puzzles"][index]["isCorrect"] = result;
    }
}

/**
 * Template for trainingData creation. 
 */

export const puzzleDataTemplate = {
    "pgn": "",                              // contains the pgn of the puzzle
    "lichessURL": "",                       // chapter url to the lichess study
    "isCorrect": null,                      // state of the latest solution of the puzzle
    "isSelected": null,                     // is the puzzle selected 
    "isMarked": null,                       // is the puzzle marked
    "color": null,                          // with what color is the puzzle marked
    "stats": {
        "trainingAttempts": 0,              // how many times was the puzzle played in the training session
        "trainingFails": 0,                 // how many times was the puzzle failed in the training session
        "gameAttempts": 0,                  // how many times was the puzzle played in the latest game
        "gameFails": 0,                     // how many times was the puzzle failed in the latest game
        "failedGameMove": -1  ,             // which move index failed in the lastest attempt
        "arrayOfFailedGameMoves": [],       // array where the index stands for the move number and the value for the number of fails at this move number during game
        "arrayOfFailedTrainingMoves": [],   // array where the index stands for the move number and the value for the number of fails at this move number during training session
    }
}

export const gameDataTemplate = {
    "gameArray": [],
}

export const trainingDataTemplate = {
    "puzzles": [],                          // array of puzzleData entries
    "game": gameDataTemplate,
    "stats": {
        "allGameAttempts": 0,               // how many puzzles were played in the latest game
        "allGameFails": 0,                  // how many fails occured in the latest game
        "arrayOfFailedGamePuzzles": [],     // array where the index stands for the puzzle number and the value for the number of fails for this puzzle during the latest game
        "allTrainingAttempts": 0,           // how many puzzles were played in the training session
        "allTrainingFails": 0,              // how many puzzles were failed in the training session
        "arrayOfFailedTrainingPuzzles": [], // array, where the index stands for the puzzle number and the value for the number of fails for this puzzle during the training session
    }
}


