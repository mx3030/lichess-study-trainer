import { Game } from './game.js'
import { ViewHandler } from '../view/viewHandler.js'

/**
* The Training gets initialized with the trainingData of a lichess study and a ChessboardHandler from a LoadHandler.
* It can start and stop a Game, with different settings.
*/

export class Training{
    constructor(trainingDataHandler, chessboardHandler){ 
        this.trainingDataHandler = trainingDataHandler;
        this.chessboardHandler = chessboardHandler; 
        this.viewHandler = new ViewHandler(this.trainingDataHandler, this.chessboardHandler);
        this.viewHandler.startTrainingView();
        this.startStopButton = document.getElementById('startStopButton');
        this.startStopButton.clickCallback = (state) => this.handleStartStop(state);
    }

    handleStartStop(state){
        if(state==1) {
            this.start();
        } else {
            this.stop();
        }
    }

    start(){ 
        this.game = new Game(
            this.chessboardHandler,
            this.trainingDataHandler,
            this.viewHandler
        );
        this.game.start(); 
    }

    stop(){
        if(this.game){
            this.game.stop();
        }
    }

}
