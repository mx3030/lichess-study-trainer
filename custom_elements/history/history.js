const historyTemplate = document.createElement('template');
historyTemplate.innerHTML = ` 
`;

class History extends HTMLElement {
    constructor() {
        super();    
    }

    connectedCallback(){
        const temp = document.importNode(historyTemplate.content, true);
        this.appendChild(temp);
        this.addEventListener('click', event => {
            if (this._selectionAllowed) {
                const buttonElement = event.target.closest('button');
                if (buttonElement) {
                    console.log(buttonElement.classList)
                }
            }
        });
    }
     
    createHistoryElements(array){
        array.forEach((el, index) => {
            const historyElement = document.createElement('history-element');
            historyElement.url = el["url"];
            this.appendChild(historyElement);
        })
    }     
}

customElements.define('history', History);
