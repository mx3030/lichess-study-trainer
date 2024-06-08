import { switchConnectedButtonsInArray } from '../configHandler.js'
import { Training } from '../../app/training.js';
import { PGNHandler } from './pgnHandler.js'
import { LichessHandler } from './lichessHandler.js';
import { FolderHandler } from './folderHandler.js';

/**
* The load handler manages the initialization of new training sessions from lichess studies.
*/

export class LoadHandler {
    constructor(chessboard) {
        this.pgnHandler = new PGNHandler();
        this.initUIElements();
        this.initTraining(chessboard);   
    }

    initUIElements() {
        const loadContainerButtons = Array.from(document.getElementById('loadContainerButtons').children);
        const loadOptions = document.getElementById('loadOptions');
        switchConnectedButtonsInArray(loadContainerButtons, loadOptions, 0);  
    }

    initTraining(chessboard){
        const trainingData = this.getTrainingDataFromLocalStorage();
        this.training = trainingData ? new Training(trainingData, chessboard) : null;
        const lichessHandler = new LichessHandler(this.training, chessboard, this.pgnHandler);
        const folderHandler = new FolderHandler(this.training, chessboard, this.pgnHandler);
        //const historyHandler = new HistoryHandler(this.training, this.chessboard);
        //const favoriteHandler = new FavoriteHandler(this.training, this.chessboard);
    }
 
    getTrainingDataFromLocalStorage() {
        return JSON.parse(localStorage.getItem('lichessStudyTrainerTrainingData'));
    }
  
}
