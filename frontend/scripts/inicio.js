import { config } from "/scripts/config.js";
import { cargarSonido } from "/scripts/cargarSonido.js"
import {findSave} from "/scripts/saveGame.js"


const music = cargarSonido("/api/sound/music/main-theme.mp3");

const optionsMenu = document.createElement("div");
optionsMenu.classList.add("options-menu")
const loadMenu = document.createElement("div");
loadMenu.classList.add("load-menu")

// alert("Welcome to Doki Doki Literatuhiddenb Browser Edition! - Developed by elRomanoff")

//cargar las canciones
const hoverSound = cargarSonido("/api/sound/sfx/hover-sound");
const selectSound = cargarSonido("/api/sound/sfx/select");

//  aca hago las animaciones de los personajes y el logo. tambien declaro variables globales
let n = document.querySelector('.n');
let s = document.querySelector('.s');
let y = document.querySelector('.y');
let m = document.querySelector('.m');
let logo = document.getElementById("logo")
let mainScreen = document.getElementById('pantalla');
let menuBtns = document.getElementById('menu-btns');


const menuAside = document.querySelector(".menu__aside")
const cornerText = document.createElement("p");
const logoContainer = document.querySelector(".logo")
cornerText.classList.add("corner-text", "hidden", "ok")
menuAside.insertBefore(cornerText, logoContainer)



//funcion que pone la musica y ejecuta las animaciones
//pongo esa ultima funcion ahi por el tema de javascript, que no reproduce musica
//hasta que alguien toca el dom

mainScreen.addEventListener('click', run);
function run() {
    menuBtns.addEventListener("mouseover", (e) => {
        if (e.target.classList.contains("ok")) hoverSound.play();
    })

    menuBtns.classList.remove("hidden")
    n.style.left = "51%";
    n.style.top = "21%";
    s.style.left = "30%";
    s.style.top = "31%";
    m.style.top = "30%"
    m.style.left = "59%"
    y.style.top = "14%"
    y.style.left = "36%"
    logo.style.top = "-5em"

    if(config.music !== "false")music.play();

    // mainScreen.removeEventListener("click", run)
}

//tocar los botones para nuevo juego, cargar, etc

menuBtns.addEventListener("click", (e) => {
    if (e.target.classList.contains("ok")){
        selectSound.play();
        if (e.target.id === "new-game") {
            localStorage.setItem("currentGame", 0);
            window.open("/newGame", "_self")
        }

        else if (e.target.id === "load-game"){
            let arrSave = [
                findSave(0),
                findSave(1),
                findSave(2),
                findSave(3),
                findSave(4),
                findSave(5)
            ]
            hideAll("Load")
            try{mainScreen.removeChild(optionsMenu)}catch{}

            if(logo.classList.contains("hidden")){
                let fragment = document.createDocumentFragment();
                const ofs = document.createElement("div");
                ofs.classList.add("options-flex-spacer")
                const lfc = document.createElement("div")
                lfc.classList.add("load-flex-container")

                for (let i = 0; i < arrSave.length; i = i + 2) {
                    const loadHolder = document.createElement("div");
                    loadHolder.classList.add("load-holder");
                    for (let j = 0; j < 2; j++) {
                        const loadDiv = document.createElement("div");
                        loadDiv.classList.add("load-div", (i+j));
                        const spanding = document.createElement("span");
                        if (arrSave[i + j].date) {
                            loadDiv.classList.add("load-hover")
                            spanding.innerHTML = `${arrSave[i + j].date}`;
                            loadDiv.style.backgroundImage = arrSave[i + j].background
            
                        }
                        else spanding.innerHTML = "Empty Slot"
                        loadDiv.appendChild(spanding)
                        loadHolder.appendChild(loadDiv)
                    }
                    lfc.appendChild(loadHolder)
                }
                fragment.appendChild(ofs)
                fragment.appendChild(lfc)
                loadMenu.appendChild(fragment)
                loadMenu.addEventListener("click", (e) =>{ e.stopPropagation()})

        mainScreen.appendChild(loadMenu)

        let nodeList = document.querySelectorAll(".load-div")
        for (let i = 0; i < nodeList.length; i++) {
            const element = nodeList[i];

            if (element.style.backgroundImage) {
                    element.addEventListener("click",(e)=> {
                        console.log(arrSave[e.target.classList[1]])
                    localStorage.setItem("currentGame", arrSave[e.target.classList[1]].index)
                    window.open(arrSave[e.target.classList[1]].chapter, "_self");
                })
            }
        }
    }
            else {
                loadMenu.innerHTML = ""
                mainScreen.removeChild(mainScreen.lastElementChild)
            }
        }
        else if (e.target.id === "settings"){
            try { mainScreen.removeChild(loadMenu);loadMenu.innerHTML = ""} catch {}
            hideAll(e.target.innerHTML)
            
            if(logo.classList.contains("hidden")){
                optionsMenu.innerHTML = `<div class="options-flex-spacer"></div>
                <div class="options-flex-container">
                    <p class="ok">Music:</p>
                    <p class="ok">Text speed:</p>
                </div>
                <div class="options-flex-container">
                    <p id="music">
                        <span class="ok ho">On</span> <span class="ok ho">Off</span>
                    </p>
                    <p id="speeds">
                        <span class="ok ho">Slow</span>
                        <span class="ok ho">Normal</span>
                        <span class="ok ho">Fast</span>
                    </p>
                </div>`
                mainScreen.appendChild(optionsMenu)

                const speedOptions = document.getElementById('speeds');
                const musicSwitch = document.getElementById('music');

                speedOptions.addEventListener("click", (e) =>{
                    if(e.target.innerHTML ==="Fast"){
                        config.setTextSpeed(9)
                    }
                    else if(e.target.innerHTML ==="Normal"){
                        config.setTextSpeed(20)
                    }
                    else if (e.target.innerHTML ==="Slow"){
                        config.setTextSpeed(44)
                    }
                });

                musicSwitch.addEventListener("click", (e) =>{
                    if(e.target.innerHTML === "On"){
                        config.setMusic(true)
                        music.volume = 1;
                        try{music.play()}catch{}
                    }
                    else if(e.target.innerHTML === "Off"){
                        config.setMusic(false)
                        music.volume = 0
                        try{music.play()} 
                        catch{"algo salio re mal"}
                    }
                })
            }
            else{
                optionsMenu.innerHTML = ""
            }
        }
        else if(e.target.id = "quit"){
            window.home();
        }
    }
});

const hideAll = (text)=>{
    if (text === cornerText.innerHTML){
        cornerText.classList.add("hidden")
        logo.classList.remove("hidden")
        n.classList.remove("hidden")
        s.classList.remove("hidden")
        m.classList.remove("hidden")
        y.classList.remove("hidden")

        cornerText.innerHTML=""
    }else{
        cornerText.innerHTML = text
        cornerText.classList.remove("hidden")
        logo.classList.add("hidden")
        n.classList.add("hidden")
        s.classList.add("hidden")
        m.classList.add("hidden")
        y.classList.add("hidden")
    }
}