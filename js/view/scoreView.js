/**
 * A ScoreView defines multiple methods to implement different scoreViews in the progressContainer. 
 */

export class ScoreView{
    constructor(){
        this.initUIElements();
    }

    initUIElements(){
        this.scoreValue = document.getElementById('scoreValue');
        this.scoreMax = document.getElementById('scoreMax');
    }

    update(value, max){
        this.scoreValue.innerHTML = value;
        this.scoreMax.innerHTML = '/' + max;
    }

}
