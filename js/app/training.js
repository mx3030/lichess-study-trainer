import { Game } from './game.js'
import { ViewHandler } from '../view/viewHandler.js'
import { TrainingDataHandler } from './trainingDataHandler.js'

/**
* The Training gets initialized with the trainingData of a lichess study and a ChessboardHandler from a LoadHandler.
* It can start and stop a Game, with different settings.
*/

export class Training{
    constructor(trainingData, chessboardHandler){ 
        this.trainingDataHandler = new TrainingDataHandler(trainingData);
        this.chessboardHandler = chessboardHandler; 
        this.viewHandler = new ViewHandler(this.trainingDataHandler, this.chessboardHandler);
        this.viewHandler.startTrainingView();
        this.startStopButton = document.getElementById('startStopButton');
        this.startStopButton.addEventListener('click', () => { 
            if(this.startStopButton.name == 'start') {
                this.start();
            } else {
                this.stop();
            }
        });
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
        this.game.stop();
    }

}
