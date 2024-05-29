import { TrainingDataHandler } from '../app/trainingDataHandler.js'
import { ChessboardView } from './chessboardView.js'
import { ProgressView } from './progressView.js'

/**
 * During a game, the ViewHandler is the connection between the Game class and the buttonGrid. 
 * Also it connects the filterButton to the buttonGrid. 
 * The ViewHandler is also a extendend ButtonGridHandler and is connected to the buttonGrid.
 * With the callback methods the buttonGrid can also change the trainingData with the help of the trainingDataHandler.
 */

export class ViewHandler{
    constructor(trainingDataHandler, chessboardHandler){
        this.trainingDataHandler = trainingDataHandler;
        this.chessboardView = new ChessboardView(chessboardHandler);
        this.progressView = new ProgressView(); 
        this.initUIElements();
        this.setupEventListeners();
    }
    
    initUIElements(){
        this.goalButton = document.getElementById('goalButton');
        this.shuffleButton = document.getElementById('shuffleButton');
        this.filterButton = document.getElementById('filterButton');
        this.buttonGrid = document.getElementById('buttonGrid');
        this.buttonGrid.connectCallbackHandler(this);
        this.buttonGrid.init(this.trainingDataHandler.getArrayWithPuzzleIndices());
    }
    
    setupEventListeners(){
        this.filterButton.addEventListener('click', ()=>{
            const filter = this.filterButton.name;
            this.onFilterChanged(filter)
        })
    }

    onFilterChanged(filter){
        if(filter=="no-filter"){
            this.buttonGrid.displayButtons(this.trainingDataHandler.getArrayWithPuzzleIndices());
        } else if (filter=="marked"){
            this.buttonGrid.displayButtons(this.trainingDataHandler.getArrayWithMarkedPuzzleIndices());
        } else if (filter=="wrong-only"){
            this.buttonGrid.displayButtons(this.trainingDataHandler.getArrayWithWrongPuzzleIndices())
        }
    }

    get mode(){
        return {
            "goal": this.goalButton.name,
            "shuffle": this.shuffleButton.name,
            "filter": this.filterButton.name
        }
    }

    onGridButtonSelected(index, value){
        // TODO: write seperate set function in trainingDataHandler, to manipulate trainingData
        this.trainingDataHandler.trainingData["puzzles"][index]["isSelected"] = value; 
    }

    onGridButtonColored(index, color){
        this.trainingDataHandler.trainingData["puzzles"][index]["color"] = color;
    }

    onGridButtonFilled(index, value){
        this.trainingDataHandler.trainingData["puzzles"][index]["isMarked"] = value;
    }

    handlePuzzleResult(index, result){
        if(result){
            this.buttonGrid.colorButton(index, "green");
        } else {
            this.buttonGrid.colorButton(index, "red");
        }
    }

}
