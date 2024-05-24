import { ConfigHandler } from './config/configHandler.js'
import { ChessboardHandler } from './chessboard/chessboardHandler.js'
import { GameHandler } from './game/gameHandler.js'

class Main { 
    constructor(){
        const boardEl = document.getElementById('chessboard');
        this.chessboardHandler = new ChessboardHandler(boardEl);
        this.configHandler = new ConfigHandler(this.chessboardHandler);
        this.gameHandler = new GameHandler(this.chessboardHandler);
    }  
}

window.onload = function() {
    new Main();
};

