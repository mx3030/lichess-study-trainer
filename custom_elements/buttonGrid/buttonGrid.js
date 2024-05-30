import { ButtonGridHandler } from './buttonGridHandler.js';

const buttonGridTemplate = document.createElement('template');
buttonGridTemplate.innerHTML = `
    <div class="button-grid-container"></div>
`;

class ButtonGrid extends HTMLElement {
    constructor() {
        super();
        this._buttonNames = [];          // array with buttonNames
        this._buttons = [];              // array with button elements
        this._selectionAllowed = true;   // is selection of a button allowed
        this._selectedIndex = 0;         // index of selected button at the moment
        // those arrays are only used inside the component
        this._coloredButtons = [];       // array with color on index of colored button
        this._filledButtons = [];        // array with color on index of filled button
        this._availableButtonColors = [
            'default',
            'light',
            'green',
            'red',
            'yellow',
            'blue'
        ];
    }

    connectedCallback() {
        const temp = document.importNode(buttonGridTemplate.content, true);
        this.appendChild(temp);
        this.updateContainer();
        this.connectCallbackHandler();
        this.setupEventListeners();
    }

    init(buttonNames) {
        this._buttonNames = buttonNames;
        this.createButtonsArray();
        this.displayAllButtons();
    }

    connectCallbackHandler(callbackHandler) {
        if (callbackHandler) {
            this.callbackHandler = callbackHandler;
        } else {
            const buttonGridHandler = new ButtonGridHandler();
            this.callbackHandler = buttonGridHandler;
        }
    }

    setupEventListeners() {
        this.addEventListener('click', event => {
            if (this._selectionAllowed) {
                const buttonElement = event.target.closest('button');
                if (buttonElement) {
                    const index = buttonElement.dataset.index;
                    this.selectButton(index);
                }
            }
        });
        this.addEventListener('auxclick', event => {
            const buttonElement = event.target.closest('button');
            if (buttonElement) {
                const index = buttonElement.dataset.index;
                this.fillButton(index);
            }
        });
    }

    get buttonSize() {
        return parseInt(this.getAttribute('button-size')) || 50;
    }

    get gap() {
        return parseInt(this.getAttribute('gap')) || 10;
    }

    get selectedIndex() {
        return this._selectedIndex;
    }

    set selectionAllowed(value) {
        this._selectionAllowed = value;
    }

    updateContainer() {
        const hostWidth = this.offsetWidth;
        const buttonSize = this.buttonSize;
        const gap = this.gap;
        const numButtonsPerRow = Math.floor(hostWidth / (buttonSize + gap));
        const containerWidth = numButtonsPerRow * buttonSize + (numButtonsPerRow - 1) * gap;
        this.style.width = containerWidth + 'px';
        this.style.gap = gap + 'px';
    }

    createButtonsArray() { 
        this._buttons = [];
        this._coloredButtons = [];
        this._filledButtons = [];
        this._buttonNames.forEach((name, index) => {
            const buttonElement = document.createElement('button');
            buttonElement.classList.add('button-grid-button');
            buttonElement.classList.add('default');
            buttonElement.style.width = this.buttonSize + 'px';
            buttonElement.style.height = this.buttonSize + 'px';
            const fontSize = Math.floor(0.5 * this.buttonSize) + 'px';
            buttonElement.style.fontSize = fontSize;
            buttonElement.textContent = name;
            buttonElement.dataset.index = index;
            this._buttons.push(buttonElement);
            this._coloredButtons.push('default');
            this._filledButtons.push(false);
        });
    }

    displayAllButtons() {
        this.updateContainer();
        this.innerHTML = '';
        this._buttons.forEach((buttonElement) => {
            this.appendChild(buttonElement);
        });
    }

    displayButtons(displayArray) {
        // displayArray contains indexes of buttons, that should be displayed in container
        this.updateContainer();
        this.innerHTML = '';
        displayArray.forEach((displayIndex) => {
            const buttonElement = this._buttons[displayIndex];
            this.appendChild(buttonElement);
        });
    }

    selectButton(index) {
        // select the button with index
        // check if index already selected
        this._buttons[this._selectedIndex].classList.remove('selected');
        this.callbackHandler.onGridButtonSelected(this._selectedIndex, false);
        this._buttons[index].classList.add('selected');
        this._selectedIndex = index;
        this.callbackHandler.onGridButtonSelected(this._selectedIndex, true);
    }

    colorButton(index, color) {
        // color the button with index and color
        // check if color is available
        if (!this._availableButtonColors.includes(color)) {
            return;
        }
        const buttonElement = this._buttons[index];
        const oldColor = this._coloredButtons[index];
        if (oldColor !== color) {
            buttonElement.classList.remove(oldColor);
            buttonElement.classList.add(color);
            this._coloredButtons[index] = color;
        }
        this.callbackHandler.onGridButtonColored(index, color);
    }

    fillButton(index) {
        // fill the button with index
        // check if button already filled, in this case remove filling
        const buttonElement = this._buttons[index];
        if (this._filledButtons[index] === true) {
            buttonElement.classList.remove('filled');
            this._filledButtons[index] = false;
        } else {
            buttonElement.classList.add('filled');
            this._filledButtons[index] = true;
        }
        this.callbackHandler.onGridButtonFilled(index, this._filledButtons[index]);
    }
}

customElements.define('button-grid', ButtonGrid);
