import { LichessApiHandler } from './lichessApiHandler.js';
import { TrainingDataHandler } from '../../app/trainingDataHandler.js'
import { Training } from '../../app/training.js';
import { PGNHandler } from './pgnHandler.js'

export class LichessHandler {
    constructor(training, chessboard, pgnHandler) {
        this.training = training;
        this.chessboard = chessboard;
        this.pgnHandler = new PGNHandler();
        this.lichessApiHandler = new LichessApiHandler();
        this.initUIElements();
        this.setupEventListeners();
        this._callback = null;
    }

    initUIElements() {  
        this.generateApiKey = document.getElementById('generateApiKey');
        this.apiKeyInput = document.getElementById('apiKeyInput');
        const apiKey = this.getApiKeyFromLocalStorage();
        this.apiKeyInput.value = apiKey ? apiKey : "";
        this.studyLinkInput = document.getElementById('studyLinkInput');
        const url = this.getURLFromLocalStorage();
        this.studyLinkInput.value = url ? url : "";
        this.studyDownloadButton = document.getElementById('studyDownloadButton');
        this.studyDownloadButton.listen = false;
    }

    setupEventListeners() {
        this.studyDownloadButton.addEventListener('click', async () => {
            let apiKey = this.apiKeyInput.value; 
            let url = this.studyLinkInput.value;
            if (url !== '') {
                try {
                    this.lichessApiHandler.apiKey = apiKey; 
                    let pgnString = await this.lichessApiHandler.getStudy(url);
                    let trainingData = this.pgnHandler.createTrainingData(pgnString);
                    if(this._callback){
                        this._callback(trainingData);
                    }
                    localStorage.setItem('lichessStudyTrainerTrainingData', JSON.stringify(trainingData));
                    localStorage.setItem('lichessStudyTrainerApiKey', apiKey);
                    localStorage.setItem('lichessStudyTrainerURL', url);
                } catch (error) {
                    console.error('Failed to load study:', error);
                }
            }
        });
        this.generateApiKey.addEventListener('click', ()=>{
            let url = 'https://lichess.org/account/oauth/token/create?';
            window.open(url, '_blank').focus(); 
        })
    }

    getApiKeyFromLocalStorage(){
        return localStorage.getItem('lichessStudyTrainerApiKey');
    }

    getURLFromLocalStorage(){
        return localStorage.getItem('lichessStudyTrainerURL');
    }

    set callback(func){
        this._callback = func;
    }
}
