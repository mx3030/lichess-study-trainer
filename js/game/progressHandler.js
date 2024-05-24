export class ProgressHandler{
    constructor(){
        this.initUIElements();
    }

    initUIElements(){
        this.scoreValue = document.getElementById('scoreValue');
        this.scoreMax = document.getElementById('scoreMax');
        this.history = document.getElementById('history');
    }

    init(gameLength){
        this.scoreValue.textContent = 0;
        this.scoreMax.textContent = '/' + gameLength;
        this.history.setButtons(gameLength);
    }
}
