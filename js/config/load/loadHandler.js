import { switchConnectedCycleButtonsInArray } from '../../misc/utils.js'
import { TrainingDataHandler } from '../../app/trainingDataHandler.js'
import { Training } from '../../app/training.js'
import { PGNHandler } from './pgnHandler.js'
import { LichessHandler } from './lichessHandler.js'
import { FolderHandler } from './folderHandler.js'
import { HistoryHandler } from './historyHandler.js'
import { FavoriteHandler } from './favoriteHandler.js'

/**
* The load handler manages the initialization of new training sessions from lichess studies.
*/

export class LoadHandler {
    constructor(chessboard) {
        this.chessboard = chessboard;
        this.training = null;
        this.initUIElements();
        this.initLoaders();
    }

    initUIElements() {
        this.loadButton = document.getElementById('loadButton');
        const loadContainerButtons = Array.from(document.getElementById('loadContainerButtons').children);
        const loadOptions = document.getElementById('loadOptions');
        switchConnectedCycleButtonsInArray(loadContainerButtons, loadOptions);
        const lichessButton = document.getElementById('lichessButton');
        lichessButton.handleClick();
    }

    initLoaders(chessboard){
        this.loadButton.handleClick();
        const trainingData = this.getTrainingDataFromLocalStorage();
        this.createTraining(trainingData);
        const pgnHandler = new PGNHandler();
        const lichessHandler = new LichessHandler(pgnHandler);
        lichessHandler.callback = (data) => this.createTraining(data);
        const folderHandler = new FolderHandler(pgnHandler);
        folderHandler.callback = (data) => this.createTraining(data);
        const historyHandler = new HistoryHandler(this.training, this.chessboard);
        const favoriteHandler = new FavoriteHandler(this.training, this.chessboard);
    }
 
    getTrainingDataFromLocalStorage() {
        return JSON.parse(localStorage.getItem('lichessStudyTrainerTrainingData'));
    }

    createTraining(trainingData){
        if(trainingData){
            this.trainingDataHandler = new TrainingDataHandler(trainingData);
            this.training = new Training(this.trainingDataHandler, this.chessboard);
            this.loadButton.handleClick();
        }  
    }
  
}
