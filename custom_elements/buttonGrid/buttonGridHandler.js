export class ButtonGridHandler{
    constructor(){

    }

    onGridButtonSelected(index, value){
        console.log(`Button ${index} selection is ${value}.`);
    }

    onGridButtonColored(index, color){
        console.log(`Button ${index} is colored in ${color}.`)
    }

    onGridButtonFilled(index, value){
        console.log(`Button ${index} filling is ${value}.`);
    }
}
