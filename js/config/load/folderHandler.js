export class FolderHandler {
    constructor(pgnHandler){
        this.pgnHandler = pgnHandler;
        this._callback = null;
        this.fileReader = new FileReader();
        this.initUIElements();
        this.setupEventListeners();
    }
    
    set callback(func){
        this._callback = func;
    }

    initUIElements(){
        this.fileBrowserButton = document.getElementById('fileBrowserButton');
        this.fileBrowserButton.listen = false;
        this.fileLoadButton = document.getElementById('fileLoadButton');
        this.fileLoadButton.listen = false;
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
}
