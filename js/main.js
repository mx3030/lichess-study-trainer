import { ConfigHandler } from './config/configHandler.js'
import { ChessboardHandler } from './chessboard/chessboardHandler.js'

class Main { 
    constructor(){
        const boardEl = document.getElementById('chessboard');
        this.chessboardHandler = new ChessboardHandler(boardEl);
        this.configHandler = new ConfigHandler(this.chessboardHandler);
    }  
}

window.onload = function() {
    new Main();
};

