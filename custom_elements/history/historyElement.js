const historyElementTemplate = document.createElement('template');
historyElementTemplate.innerHTML = ` 
    <div class="history-element-data"></div>
    <button class="history-element-load" data-name="load">
        <span class="material-symbols-outlined">download</span>
    </button>
    <button class="history-element-delete" data-name="delete">
        <span class="material-symbols-outlined">delete</span>
    </button>
    <button class="history-element-favorite" data-name="favorite">
        <span class="material-symbols-outlined">star</span>
    </button>
`;

class HistoryElement extends HTMLElement {
    constructor() {
        super();  
    }

    connectedCallback(){
        const temp = document.importNode(historyElementTemplate.content, true);
        this.appendChild(temp);
        this.$dataElement = this.querySelector('.history-element-data');
        this.$loadElement = this.querySelector('.history-element-load');
        this.$deleteElement = this.querySelector('.history-element-delete');
        this.$favoriteElement = this.querySelector('.history-element-favorite');
    }
 
    set url(name){
        this.$dataElement.innerHTML = url;
        this.$loadButton.setAttribute('data-name', url);
        this.$deleteButton.setAttribute('data-name', url);
        this.$favoriteButton.setAttribute('data-name', url);
    } 
}

customElements.define('history-element', HistoryElement);
