import { config } from "/scripts/config.js";
import { dictionary } from "/scripts/dictionary.js"

let arrSave = [
    findSave(0),
    findSave(1),
    findSave(2),
    findSave(3),
    findSave(4),
    findSave(5)
]
function findSave(n){
    let saveStat = localStorage.getItem("doki_save"+n)
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
                <p class="ok ho" id="delete-btn">Delete</p>
                <p class="ok ho" id="menu-btn">Main Menu</p>
                <p class="ok ho" id="save-btn">Save Game</p>
                <p class="ok ho" id="load-btn">Load Game</p>
                <p></p>
                <p class="ok ho" id="return">Return</p>
            </div>
        </aside>`;


        const savingFragment = document.createDocumentFragment();
        const lfx = document.createElement("div");
        lfx.classList.add("lfx", "load-flex-container")
        
        for (let i = 0; i < arrSave.length; i = i + 2) {
            const loadHolder = document.createElement("div");
            loadHolder.classList.add("load-holder");
            for(let j = 0; j<2; j++){
                const loadDiv = document.createElement("div");
                loadDiv.classList.add("load-div", i + j);
                const spanding = document.createElement("span");
                if(arrSave[i + j].date) {
                    spanding.innerHTML = `${arrSave[i + j].date}`;
                    loadDiv.style.backgroundImage = arrSave[i+j].background
                }
                else {
                    spanding.innerHTML = "Empty Slot"
                }

                loadDiv.classList.add("load-hover")
                loadDiv.appendChild(spanding)
                loadHolder.appendChild(loadDiv)

                if(option === "Load"){
                    loadDiv.addEventListener("click", (e) => {
                        if (e.target.style.backgroundImage) {
                            config.setLoadGame(arrSave[e.target.classList[1]])
                            window.open("/Game", "_self")
                        }
                    })
                }
                else if (option === "Save") {
                    loadDiv.addEventListener("click", (e)=>{
                        let saveNum = e.target.classList[1]
                        localStorage.setItem(`doki_save${saveNum}`, JSON.stringify(objectToSave))
                        console.log(localStorage.getItem(`doki_save${saveNum}`))
                        arrSave[saveNum] = findSave(saveNum) 
                        e.target.style.backgroundImage = objectToSave.background
                        e.target.firstChild.innerHTML = objectToSave.date
                    })
                }
                else if (option === "Delete"){
                    loadDiv.addEventListener("click",(e)=>{
                        let saveNum = e.target.classList[1]
                        localStorage.removeItem(`doki_save${saveNum}`)
                        arrSave[saveNum] = findSave(saveNum)
                        e.target.style.backgroundImage = ""
                        e.target.firstChild.innerHTML = "Empty Slot"
                    })
                }
            }
            lfx.appendChild(loadHolder)
        }
        
        savingFragment.appendChild(lfx)
        saveScreen.appendChild(savingFragment)


    fragment.appendChild(saveScreen)

    return fragment;
}


        
export {createSaveScreen as createSaveScreen}
export {findSave as findSave}