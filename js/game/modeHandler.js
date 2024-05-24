export class ModeHandler {
    static GOAL_STATES = ['', 'till-done', 'infinity'];
    static FILTER_STATES = ['', 'filter-on', 'filter-on-red'];

    constructor() {
        this.initUIElements();

        this.goal = '';
        this.shuffle = false;
        this.filter = '';
        this.settingsChanged = true;

        this.gameLength = 0;

        this.setupEventListeners();
    }

    initUIElements() {
        this.goalButton = document.getElementById('goalButton');
        this.shuffleButton = document.getElementById('shuffleButton');
        this.filterButton = document.getElementById('filterButton');
        this.buttons = [this.goalButton, this.shuffleButton, this.filterButton];
        this.history = document.getElementById('history');
    }

    init(gameLength) {
        this.gameLength = gameLength;
        this.arrayWithPuzzleIndices = Array.from({ length: gameLength }, (_, i) => i);
        this.arrayWithWrongPuzzleIndices = [];
        this.arrayWithFilteredPuzzleIndices = [];
        this.currentIndex = 0;
    }

    setupEventListeners() {
        this.goalButton.addEventListener('click', () => {
            this.goal = this.toggleButtonMultiple(this.goalButton, ModeHandler.GOAL_STATES);
            this.settingsChanged = true;
        });
        this.shuffleButton.addEventListener('click', () => {
            this.shuffle = this.toggleButton(this.shuffleButton);
            this.settingsChanged = true;
        });
        this.filterButton.addEventListener('click', () => {
            this.filter = this.toggleButtonMultiple(this.filterButton, ModeHandler.FILTER_STATES);
            this.settingsChanged = true;
        });
    }

    toggleButton(button) {
        return button.classList.toggle('active');
    }

    toggleButtonMultiple(button, states) {
        let currentState = button.getAttribute('data-state') || states[0];
        if (currentState) {
            button.classList.remove(currentState);
        }

        const nextStateIndex = (states.indexOf(currentState) + 1) % states.length;
        const nextState = states[nextStateIndex];

        if (nextState) {
            button.classList.add(nextState);
        }
        button.setAttribute('data-state', nextState);
        return nextState;
    }

    disableButtons() {
        this.buttons.forEach(button => {
            button.disabled = true;
            button.classList.add('disabled');
        });
    }

    enableButtons() {
        this.buttons.forEach(button => {
            button.disabled = false;
            button.classList.remove('disabled');
        });
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    filterPuzzles() {
        if (this.filter === '') {
            this.arrayWithFilteredPuzzleIndices = [...this.arrayWithPuzzleIndices];
        } else if (this.filter === 'filter-on') {
            this.arrayWithFilteredPuzzleIndices = this.history.getSelectedButtons();
        } else if (this.filter === 'filter-on-red') {
            this.arrayWithFilteredPuzzleIndices = [...this.arrayWithWrongPuzzleIndices];
        }
        console.log(this.arrayWithPuzzleIndices)
        console.log(this.arrayWithFilteredPuzzleIndices)
    }

    createModeArray() {
        if(!this.settingsChanged){
            return;
        }
        this.filterPuzzles();
        if (this.shuffle) {
            this.arrayWithFilteredPuzzleIndices = this.shuffleArray(this.arrayWithFilteredPuzzleIndices);
        } else {
            this.arrayWithFilteredPuzzleIndices = this.startNumberSort(this.arrayWithFilteredPuzzleIndices, this.currentIndex);
        }
        this.settingsChanged = false;
    }

    startNumberSort(arr, startNumber) {
        const sorted = arr.sort((a, b) => a - b);
        const index = sorted.indexOf(startNumber);
        return [...sorted.slice(index), ...sorted.slice(0, index)];
    }

    getNextIndex(feedback) {
        if(this.arrayWithFilteredPuzzleIndices.length === 0){
            this.createModeArray();
        }

        if(feedback !== null){
            const lastIndex = this.arrayWithFilteredPuzzleIndices[0];
            if (!feedback) {
                this.arrayWithWrongPuzzleIndices.push(lastIndex);
            }
            this.arrayWithFilteredPuzzleIndices.shift();
        }


        if (this.arrayWithFilteredPuzzleIndices.length === 0) {
            if (this.goal === '') {
                return null;
            } else if (this.goal === 'till-done') {
                if (this.arrayWithWrongPuzzleIndices.length === 0) {
                    return null;
                } else {
                    this.createModeArray();
                    this.arrayWithWrongPuzzleIndices = [];
                }
            } else if (this.goal === 'infinity') {
                this.createModeArray();
            }
        }

        this.currentIndex = this.arrayWithFilteredPuzzleIndices[0];
        this.selectHistoryButton(this.currentIndex);
        return this.currentIndex; 
    }

    selectHistoryButton(index){
        const historyButton = this.history.buttons[index]['element'];
        this.history.handleSelection1(historyButton);
    }
}

