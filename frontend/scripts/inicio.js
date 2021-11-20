import { config } from "/scripts/config.js";
import { cargarSonido } from "/scripts/cargarSonido.js"

const music = cargarSonido("/api/sound/music/main-theme.mp3");

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
const optionsMenu = document.createElement("div");
optionsMenu.classList.add("options-menu")



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

    console.log(config.music)
    if(config.music === "true")music.play();

    // mainScreen.removeEventListener("click", run)
}

//tocar los botones para nuevo juego, cargar, etc

menuBtns.addEventListener("click", (e) => {
    if (e.target.classList.contains("ok")){
        selectSound.play();
        if (e.target.innerHTML === "New Game") {
            const prevGame = localStorage.getItem("currentGame");
            localStorage.setItem("savedGame", prevGame)
            localStorage.setItem("currentGame", 0);
            window.open("/newGame", "_self")
        }
        else if (e.target.innerHTML === "Load Game"){
            if (localStorage.getItem("currentGame")) window.open("/newGame", "_self")
        }
        else if (e.target.innerHTML === "Settings"){
            // e.target.classList.toggle("mar ked")
            logo.classList.toggle("hidden")
            n.classList.toggle("hidden")
            s.classList.toggle("hidden")
            m.classList.toggle("hidden")
            y.classList.toggle("hidden")

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
    }
});

