const cycleButtonTemplate = document.createElement('template');
cycleButtonTemplate.innerHTML = ` 
    <button></button>
`;

class CycleButton extends HTMLElement {
    constructor() {
        super(); 
        this._listen = true;
    }

    connectedCallback(){
        const temp = document.importNode(cycleButtonTemplate.content, true);
        this.appendChild(temp);
        this.$button = this.querySelector('button');
        const state = this.getAttribute('state');
        this.currentStateIndex = state ? parseInt(state) : 0;
        this.states = JSON.parse(this.getAttribute('states')) || [];
        this.updateButton();
        this.addEventListener('click', () => {
            if(this._listen){
                this.nextState();
            }
        });
    }
 
    updateButton() {
        if (this.states) {
            const currentState = this.states[this.currentStateIndex];
            this.$button.innerHTML = '';
            if(currentState["googleIcon"]){
                this.$button.innerHTML = `<span class="material-symbols-outlined">${currentState["googleIcon"]}</span>`;
            } else if(currentState["svg"]){
                this.$button.innerHTML = currentState["svg"];
            }
            this.$button.className = '';
            currentState.classes.forEach(cls => this.$button.classList.add(cls));
        }
    }

    nextState() {
        if (this.states.length > 0) {
            this.currentStateIndex = (this.currentStateIndex + 1) % this.states.length;
            this.updateButton();
        }
    } 

    get data() {
        return this.states[this.currentStateIndex]["data"]
    }

    get name() {
        return this.states[this.currentStateIndex]["name"]
    }

    set state(index){
        this.currentStateIndex = index % this.states.length;
        this.updateButton();
    }

    set listen(value){
        this._listen = value; 
    }

}

customElements.define('cycle-button', CycleButton);

// for working with svg
// echo '"<svg-string>"' | sed 's/"/\\"/g'
