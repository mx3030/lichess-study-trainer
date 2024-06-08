import { PGNHandler } from './pgnHandler.js'
import { Training } from '../../app/training.js';

export class FolderHandler {
    constructor(training, chessboard, pgnHandler){
        this.training = training;
        this.chessboard = chessboard;
        this.pgnHandler = pgnHandler;
        this.fileReader = new FileReader();
        this.initUIElements();
        this.setupEventListeners();
    }

    initUIElements(){
        this.loadButton = document.getElementById('loadButton'); 
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
            this.training = new Training(trainingData, this.chessboard);
            this.loadButton.click();
        })
    }
}
