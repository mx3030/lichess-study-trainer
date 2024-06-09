export function switchConnectedCycleButtonsInArray(buttonArray, parentContainer){
    let selectedIndex = null;  
    buttonArray.forEach((button, index) => {
        button.clickCallback = (state) => {
            // switch state of unselected buttons in array
            if(index !== selectedIndex){
                if(selectedIndex !== null) {
                    buttonArray[selectedIndex].state = 0;
                }
                selectedIndex = index;
            }
            showConnectedContainer(parentContainer, button.data); 
        } 
    });
}

function showConnectedContainer(parentContainer, containerId){
    const container = document.getElementById(containerId);
    const children = parentContainer.children;
    for (let i = 0; i < children.length; i++) {
        children[i].classList.add('hide');
    }
    container.classList.remove('hide');
}
