const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: flex;
            justify-content: center;
            padding: 0;
            margin: 0;
            overflow: hidden;
        }

        .container {
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: start;
            align-content: flex-start;
            overflow: auto;
        }

        .container::-webkit-scrollbar {
            display: none;
        }

        .container {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        button {
            background-color: var(--color-bg);
            color: var(--color-grey);
            border: solid var(--color-grey) 1px;
            border-radius: 0;
            padding: 0;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0.5;
        }
         
        button.selected1 {
            border-width: 2px;
            font-weight: bold;
            opacity: 1;
        }

        button.selected2 {
            background-color: var(--color-grey);
            color: var(--color-bg);
            border-width: 2px;
            opacity: 1;
        }

        button.green {
            background-color: var(--color-bg);
            color: var(--color-green);
            border: solid var(--color-green) 1px;
            opacity: 1;
        }

        button.red {
            background-color: var(--color-bg);
            color: var(--color-red);
            border: solid var(--color-red) 1px;
            opacity: 1;
        }

        button.green.selected2 {
            background-color: var(--color-green);
            color: var(--color-bg);
            border-width: 2px;
            opacity: 1;
        }

        button.red.selected2 {
            background-color: var(--color-red);
            color: var(--color-bg);
            border-width: 2px;
            opacity: 1;
        }

    </style>

    <div class="container"></div>
`;

class History extends HTMLElement {
    static get observedAttributes() {
        return ['button-size', 'gap'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
        this.$container = this.shadowRoot.querySelector('.container');
        this.buttons = []; // keeps information about buttons in container
        this.arrayWithSelectedButtonsIndices = []
        this.selected1_index = null;
        this.display_only_selected = false;
        this.$container.addEventListener('click', event => {
            const targetElement = event.target.closest('button');
            this.handleSelection1(targetElement);
            this.dispatchEvent(new CustomEvent('historyClick', { detail: { index } }));
        });
        this.$container.addEventListener('auxclick', event => {
            const targetElement = event.target.closest('button');
            this.handleSelection2(targetElement);
        });
    }

    onCallback() {
        this.updateContainer();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // Handle attribute changes if necessary
    }

    setButtons(number) {
        this.buttons = new Array(number).fill().map(() => ({
            'display': true,
            'selected1': false, // selected from single click
            'selected2': false, // selected from double click
            'solution': null, // solution feedback
            'element': null, // reference to html button element
        }));
        this.renderButtons();
    }

    updateButton(index, data) {
        // Merge the new data with the existing button data
        Object.assign(this.buttons[index], data);
        this.renderButton(index);
    }

    get buttonSize() {
        return parseInt(this.getAttribute('button-size')) || 50;
    }

    get gap() {
        return parseInt(this.getAttribute('gap')) || 10;
    }

    updateContainer() {
        const hostWidth = this.offsetWidth;
        const buttonSize = this.buttonSize;
        const gap = this.gap;
        const numButtonsPerRow = Math.floor(hostWidth / (buttonSize + gap));
        const containerWidth = numButtonsPerRow * buttonSize + (numButtonsPerRow - 1) * gap;
        this.$container.style.width = containerWidth + 'px';
        this.$container.style.gap = gap + 'px';
    }
    
    renderButtons() {
        this.updateContainer();
        this.$container.innerHTML = '';
        this.buttons.forEach((button, index) => {
            const buttonElement = document.createElement('button');
            button['element'] = buttonElement;
            buttonElement.style.width = this.buttonSize + 'px';
            buttonElement.style.height = this.buttonSize + 'px';
            const fontSize = Math.floor(0.5 * this.buttonSize) + 'px';
            buttonElement.style.fontSize = fontSize;
            buttonElement.textContent = index + 1;
            buttonElement.dataset.index = index;
            this.$container.appendChild(buttonElement); 
            this.renderButton(index);
        });
    }

    renderButton(index) {
        // apply dynamic styles for single button element
        const button = this.buttons[index];
        const buttonElement = button['element'];
        if (buttonElement) {
            if (!button['display']) {
                buttonElement.style.display = 'none';
                return;
            }
            if (button['selected1']){
                buttonElement.classList.add('selected1');
            } else {
                buttonElement.classList.remove('selected1');
            }
            if (button['selected2']){
                buttonElement.classList.add('selected2');
            } else {
                buttonElement.classList.remove('selected2');
            }
            if(button['solution'] == true) {
                buttonElement.classList.add('green');
                buttonElement.classList.remove('red');
            } else if (button['solution'] == false) {
                buttonElement.classList.add('red');
                buttonElement.classList.remove('green');
            }
        }
    }
 
    handleSelection1(buttonElement){ 
        const index = buttonElement.dataset.index;
        // check if button already selected
        if (index === this.selected1_index){
            return;
        }
        // remove old selection
        if (this.selected1_index !== null) {
            const old_button = this.buttons[this.selected1_index];
            old_button['selected1'] = false;
            this.renderButton(this.selected1_index);
        }
        const new_button = this.buttons[index];
        new_button['selected1'] = true;
        this.renderButton(index);
        // keep track of selection
        this.selected1_index = index;
    }
    
    handleSelection2(buttonElement) { 
        const index = buttonElement.dataset.index;
        // toggle selected2
        const button = this.buttons[index];
        const old_state = button['selected2'];
        button['selected2'] = !old_state;
        if (old_state && this.display_only_selected) {
            buttonElement.style.display = 'none';
        }
        this.renderButton(index);
    }

    getSelections(){

    }

    displaySelections() {
        this.display_only_selected = true;
        let has_selection1 = false; // Check if one of the selected2 buttons is also selected1
        let first_selected2_button = null; // Variable to keep reference to selected2 button with the lowest index
        for (const button of this.buttons) {
            const selected1 = button['selected1'];
            const selected2 = button['selected2'];
            if (selected2) {
                if (!first_selected2_button) {
                    first_selected2_button = button;
                }
                if (selected1 && !has_selection1) {
                    has_selection1 = true;
                }
            } else {
                button['element'].style.display = 'none';
            }
        }
        if (!has_selection1 && first_selected2_button) {
            // if non of the selected2 buttons was also selected1, use the button with the lowest index and make it selected1
            first_selected2_button['selected1'] = true;
            first_selected2_button['element'].classList.add('selected1');
        }
    }

    displayAll(){
        this.display_only_selected = false;
        for (const button of this.buttons){
            button['element'].style.display = 'flex';
        }
    }

    removeAllSelections(){
        for (const button of this.buttons) {
            button['selected2'] = false;
            button['element'].classList.remove('selected2');
            if(this.display_only_selected){
                button['element'].style.display='none';
            }
        }
    } 

}

customElements.define('history-element', History);
