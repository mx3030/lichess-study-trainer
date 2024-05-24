import { ModeHandler } from './modeHandler.js'
import { ProgressHandler } from './progressHandler.js'
import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1.0.0-beta.8/+esm'

export class GameHandler{
    constructor(chessboardHandler){
        this.modeHandler = new ModeHandler();
        this.progressHandler = new ProgressHandler();
        this.chessboardHandler = chessboardHandler;
        
        this.initUIElements();
        this.setupEventListeners();
       
        this.puzzles = this.getPuzzlesFromLocalStorage();
        this.gameLength = 0;
        
        this.gameStarted = false;
        this.gameRunning = false;
        this.puzzleIndex = -1;
        
        this.puzzle = new Chess(); 
        this.solution = [];
        this.puzzleLength = 0;
        this.moveIndex = 0;
        
        if(this.puzzles){
            this.handlePageReload();
        }
        
        this.connectChessboard();
    }

    initUIElements(){
        this.playButton = document.getElementById('playButton');
        this.pauseButton = document.getElementById('pauseButton');
        this.gameModeButtons = document.getElementById('gameModeButtons');
    }

   setupEventListeners() {
        this.playButton.addEventListener('click', () => { this.handlePlayButton() });
        this.pauseButton.addEventListener('click', () => { this.handlePauseButton() });
    }

    connectChessboard(){
        this.chessboardHandler.chessboard.set({
            events: {
                move: (from, to) => this.onMove(from, to),
            }
        });
    }
       
    handlePlayButton() {
        this.togglePlayPauseButtons();
        this.gameRunning = true;
        if (!this.gameStarted) {
            this.start();
        }
        this.modeHandler.disableButtons();
        this.modeHandler.createModeArray();
        this.modeHandler.selectHistoryButton(this.modeHandler.currentIndex);
        // TODO: this.modeHandler.disableSelction1();
    }

    handlePauseButton() {
        this.togglePlayPauseButtons();
        this.gameRunning = false;
        this.modeHandler.enableButtons();
        // TODO: save game position to return when pressing start again
        // TODO: this.modeHandler.enableSelection1();
    }
    
    togglePlayPauseButtons() {
        this.playButton.classList.toggle('hide');
        this.pauseButton.classList.toggle('hide');
    }
    
    getPuzzlesFromLocalStorage(){
        return JSON.parse(localStorage.getItem('lichess-study-trainer-pgn'));
    }

    handlePageReload(){
        this.playButton.classList.remove('hide');
        this.pauseButton.classList.add('hide');
        this.gameModeButtons.classList.remove('hide');
        this.gameLength = this.puzzles.length;
        this.progressHandler.init(this.gameLength);
    }

    start(){ 
        this.gameStarted = true;
        this.puzzles = this.getPuzzlesFromLocalStorage(); 
        this.gameLength = this.puzzles.length;
        this.modeHandler.init(this.gameLength);
        this.modeHandler.createModeArray();
        this.progressHandler.init(this.gameLength);
        this.loadNextPuzzle(null);
    }

    loadNextPuzzle(feedback){
        this.puzzleIndex = this.modeHandler.getNextIndex(feedback);
        console.log(this.puzzleIndex);
        if (this.puzzleIndex < this.gameLength){
            // get puzzle solution
            const pgn = this.puzzles[this.puzzleIndex];
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
            console.log("game ended");
            return
        }
    }

    onMove(from, to){
        console.log(from, to)
        if(this.gameRunning){
            // check if move is correct
            if(this.tryMove(from,to)){
                this.makeMove(); 
                if(this.moveIndex < this.puzzleLength){
                    this.makeOpponentMove();
                } else {
                    this.loadNextPuzzle(true)
                    // TODO: inform progressHandler and modeHandler
                    console.log("correct solution");
                }
            } else {
                console.log("wrong solution");
                this.loadNextPuzzle(false);
                // TODO: inform progressHandler and modeHandler
            }
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

}
