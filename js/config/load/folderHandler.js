import { Training } from '../../app/training.js';
import { PGNHandler } from './pgnHandler.js'

export class FolderHandler {
    constructor(training, chessboard, pgnHandler){
        this.training = training;
        this.chessboard = chessboard;
        this.pgnHandler = new PGNHandler();
        this.fileReader = new FileReader();
        this.initUIElements();
        this.setupEventListeners();
        this._callback = null;
    }

    initUIElements(){
        this.fileBrowserButton = document.getElementById('fileBrowserButton');
        this.fileLoadButton = document.getElementById('fileLoadButton');
        this.fileInput = document.getElementById('fileInput');
        this.fileName = document.getElementById('fileName');
    }

    setupEventListeners(){
        this.fileBrowserButton.addEventListener('click', () => {
            this.fileInput.click();
        })
        this.fileInput.addEventListener('change', () => {
            let name = this.fileInput.files[0].name;
            this.fileName.innerHTML = name;
        })
        this.fileLoadButton.addEventListener('click', () => {
            let file = this.fileInput.files[0];
            this.fileReader.readAsText(file);
        })
        this.fileReader.addEventListener('load', () => {
            let pgnString = this.fileReader.result; 
            let trainingData = this.pgnHandler.createTrainingData(pgnString);
            if(this._callback){
                this._callback(trainingData);
            }
        })
    }

    set callback(func){
        this._callback = func;
    }
}
