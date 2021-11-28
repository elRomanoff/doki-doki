let arrSave = [
    findSave(0),
    findSave(1),
    findSave(2),
    findSave(3),
    findSave(4),
    findSave(5)
]
function findSave(n){
    let saveStat = localStorage.getItem("save"+n)
    let saveStatJSON = JSON.parse(saveStat)
    if (saveStat){
        return saveStatJSON;
    }
    else return {date: ""}
}

function createSaveScreen(option, objectToSave){
    let fragment = document.createDocumentFragment();
    const saveScreen = document.createElement("div");
    saveScreen.classList.add("save-screen")
    saveScreen.addEventListener("click", (e) => e.stopPropagation());
    saveScreen.innerHTML = `<aside class="left"></aside>
        <aside class="menu__aside" id="aside-menu">
            <p class="ok corner-text">${option}</p>
            <div class="botones options-btns" id="menu-btns">
                <p class="ok ho" id="story">History</p>
                <p class="ok ho" id="menu">Main Menu</p>
                <p class="ok ho" id="save">Save Game</p>
                <p class="ok ho" id="load">Load Game</p>
                <p></p>
                <p class="ok ho" id="return">Return</p>
            </div>
        </aside>`;

    function changeSaveScreen() {

        const savingFragment = document.createDocumentFragment();
        const lfx = document.createElement("div");
        lfx.classList.add("lfx", "load-flex-container")
        
        for (let i = 0; i < arrSave.length; i = i + 2) {
            const loadHolder = document.createElement("div");
            loadHolder.classList.add("load-holder");
            for(let j = 0; j<2; j++){
                const loadDiv = document.createElement("div");
                loadDiv.classList.add("load-div");
                const spanding = document.createElement("span");
                if(arrSave[i + j].date) {
                    spanding.innerHTML = `${arrSave[i + j].date}`;
                    loadDiv.style.backgroundImage = `url("${arrSave[i+j].background}")`
                    console.log(arrSave[i + j].background)
                }
                else spanding.innerHTML = "Empty Slot"
                loadDiv.appendChild(spanding)
                loadHolder.appendChild(loadDiv)
            }
            lfx.appendChild(loadHolder)
        }
        savingFragment.appendChild(lfx)
        saveScreen.appendChild(savingFragment)
    }

    changeSaveScreen();
    fragment.appendChild(saveScreen)
    return fragment;
}


        
export {createSaveScreen as createSaveScreen}
export {findSave as findSave}