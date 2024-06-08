import { TrainingDataHandler } from '../app/trainingDataHandler.js'
import { ChessboardView } from './chessboardView.js'
import { ScoreView } from './scoreView.js'

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
        this.scoreView = new ScoreView();
        this.initUIElements();
        this.setupEventListeners();
        this.view = 'training';
    }
    
    initUIElements(){
        this.modeButtons = document.getElementById('modeButtons');
        this.startStopButton = document.getElementById('startStopButton');
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
    
    startTrainingView(){
        this.view = 'training';
        this.modeButtons.classList.remove('hide');
        this.startStopButton.state = 0;
        this.goalButton.listen = true;
        this.goalButton.classList.remove('disabled');
        this.shuffleButton.listen = true;
        this.shuffleButton.classList.remove('disabled');
        this.filterButton.listen = true;
        this.filterButton.classList.remove('disabled');
        this.buttonGrid.selectionAllowed = true;
    }

    startGameView(){
        this.view = 'game';
        this.startStopButton.state = 1;
        this.goalButton.listen = false;
        this.goalButton.classList.add('disabled');
        this.shuffleButton.listen = false;
        this.shuffleButton.classList.add('disabled');
        this.filterButton.listen = false;
        this.filterButton.classList.add('disabled');
        this.buttonGrid.selectionAllowed = false;
        this.scoreView.update(0,0);
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

    selectPuzzle(index){
        this.buttonGrid.selectButton(index);
    }

    handlePuzzleResult(index, result, gameScore, gameIndex){
        if(result){
            this.buttonGrid.colorButton(index, "green");
        } else {
            this.buttonGrid.colorButton(index, "red");
        }
        this.scoreView.update(gameScore, gameIndex);
    }

}
