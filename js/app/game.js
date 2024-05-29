import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1.0.0-beta.8/+esm'
import { TrainingDataHandler } from './trainingDataHandler.js'

/**
* Class to handle a game during training. 
* This class gets initialized from a trainer class, every time start button is pressed.
*/

export class Game{
    constructor(chessboardHandler, trainingDataHandler, viewHandler){
        this.chessboardHandler = chessboardHandler;
        this.connectChessboard();
        this.trainingDataHandler = trainingDataHandler;
        this.viewHandler = viewHandler;
        this.gameArray = [];
        this.gameLength = 0;
        this.gameIndex = -1; // counts played puzzle 
        this.puzzleIndex = 0; // index of puzzle in trainingData
        this.puzzle = new Chess(); 
        this.puzzleSolution = [];
        this.puzzleLength = 0;
        this.moveIndex = 0;
    }

    connectChessboard(){
        this.chessboardHandler.chessboard.set({
            events: {
                move: (from, to) => this.onMove(from, to),
            }
        });
    }

    start(){
        this.mode = this.viewHandler.mode;
        this.createGameArray(this.mode["filter"]);
        console.log(this.gameArray)
        this.loadNextPuzzle();
    }

    createGameArray(filter) {
        let filteredArray;

        // Handle filter
        if (filter === "marked") {
            filteredArray = this.trainingDataHandler.getArrayWithMarkedPuzzleIndices();
        } else if (filter === "wrong-only") {
            filteredArray = this.trainingDataHandler.getArrayWithWrongPuzzleIndices();
        } else if (filter === "no-filter") {
            filteredArray = this.trainingDataHandler.getArrayWithPuzzleIndices();
        }

        // Handle shuffle
        if (this.mode && this.mode["shuffle"] === true) {
            this.gameArray = this.shuffleArray(filteredArray);
        } else {
            this.gameArray = filteredArray;
        }

        this.gameLength = this.gameArray.length;
        this.gameIndex = -1;
    }


    shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    loadNextPuzzle(){
        this.gameIndex++;
        this.puzzleIndex = this.gameArray[this.gameIndex];
        if(!this.puzzleIndex){
            this.stop();
        }
        if (this.gameIndex < this.gameLength){
            // get puzzle solution
            const pgn = this.trainingDataHandler.getPuzzlePGN(this.puzzleIndex);
            this.puzzle.loadPgn(pgn);
            this.solution = this.puzzle.history({verbose:true});
            this.puzzleLength = this.solution.length;
            // set initial position
            const start_position = this.puzzle.header().FEN;
            this.moveIndex = 0;
            this.puzzle.load(start_position);
            this.updateChessboard();
            this.makeOpponentMove();
        } else {
            if(this.mode["goal"]=="all-correct"){
                this.gameArray = this.createGameArray('wrong-only');
                this.loadNextPuzzle();
            } else if(this.mode["goal"]=="infinity"){
                this.gameIndex = -1; 
                this.loadNextPuzzle();
            } else {
                this.stop();
            }
        }
    }

    onMove(from, to){
        console.log(from, to)
        if(this.tryMove(from,to)){
            this.makeMove(); 
            if(this.moveIndex < this.puzzleLength){
                this.makeOpponentMove();
            } else {
                this.trainingDataHandler.handlePuzzleResult(this.puzzleIndex, true);
                this.viewHandler.handlePuzzleResult(this.puzzleIndex, true);
                this.loadNextPuzzle()
                console.log("correct solution");
            }
        } else {
            this.trainingDataHandler.handlePuzzleResult(this.puzzleIndex, false);
            this.viewHandler.handlePuzzleResult(this.puzzleIndex, false);
            this.loadNextPuzzle();
            console.log("wrong solution");
        }
    }

    tryMove(from, to) {
        const solution = this.solution[this.moveIndex];
        if(from == solution.from && to == solution.to){
            return true;
        } else {
            return false;
        }
    }

    makeMove(){
        const move = this.solution[this.moveIndex];
        this.puzzle.move({
            from: move.from,
            to: move.to
        })
        this.moveIndex += 1;
    }

    updateChessboard(){
        this.chessboardHandler.setStateFromChess(this.puzzle);
    }

    makeOpponentMove(){
        this.makeMove();
        this.updateChessboard();
    }

    stop(){
        console.log("game ended")
    }
}
