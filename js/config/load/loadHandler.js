import { switchConnectedButtonsInArray } from '../configHandler.js'
import { TrainingDataHandler } from '../../app/trainingDataHandler.js'
import { Training } from '../../app/training.js';
import { LichessHandler } from './lichessHandler.js';
import { FolderHandler } from './folderHandler.js';

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
        switchConnectedButtonsInArray(loadContainerButtons, loadOptions, 0);  
    }

    initLoaders(chessboard){
        this.loadButton.click();
        const trainingData = this.getTrainingDataFromLocalStorage();
        this.createTraining(trainingData);
        this.lichessHandler = new LichessHandler();
        this.lichessHandler.callback = (data) => this.createTraining(data);
        this.folderHandler = new FolderHandler();
        this.folderHandler.callback = (data) => this.createTraining(data);
        //const historyHandler = new HistoryHandler(this.training, this.chessboard);
        //const favoriteHandler = new FavoriteHandler(this.training, this.chessboard);
    }
 
    getTrainingDataFromLocalStorage() {
        return JSON.parse(localStorage.getItem('lichessStudyTrainerTrainingData'));
    }

    createTraining(trainingData){
        if(trainingData){
            this.trainingDataHandler = new TrainingDataHandler(trainingData);
            this.training = new Training(this.trainingDataHandler, this.chessboard);
            this.loadButton.click();
        }  
    }
  
}
