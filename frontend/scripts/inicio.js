alert ("Loading... Please wait...")
document.addEventListener('DOMContentLoaded', function () {
    

    alert("Hace click en aceptar y después en la pantalla")
    import {cargarSonido} from "/scripts/cargarSonido.js"

    //cargar las canciones
    const music = cargarSonido("/api/sound/music/main-theme.mp3");
    const hoverSound = cargarSonido("/api/sound/sfx/hover-sound");
    const selectSound = cargarSonido("/api/sound/sfx/select");

    //  aca hago las animaciones de los personajes y el logo. tambien declaro variables globales
    let n = document.querySelector('.n');
    let s = document.querySelector('.s');
    let y = document.querySelector('.y');
    let m = document.querySelector('.m');
    let logo = document.getElementById("logo")
    let screen = document.getElementById('pantalla');
    let menuBtns = document.getElementById('menu-btns');

    //funcion que pone la musica y ejecuta las animaciones
    screen.addEventListener('click', run);
    function run() {
        menuBtns.addEventListener("mouseover", (e) => {
            if (e.target.classList.contains("ok")) hoverSound.play();
        })
    //pongo esa ultima funcion ahi por el tema de javascript, que no reproduce musica
    //hasta que alguien toca el dom

        n.style.left = "51%";
        n.style.top = "21%";
        s.style.left = "30%";
        s.style.top = "31%";
        m.style.top = "30%"
        m.style.left = "59%"
        y.style.top = "14%"
        y.style.left = "36%"
        logo.style.top = "-5em"

        music.play();
        setTimeout(() => music.play(), 130000)
    }

    //tocar los botones para nuevo juego, cargar, etc
    function alt() {
        alert("Pará, emoción. El juego todavia está en desarrollo")
    }
    menuBtns.addEventListener("click", (e) => {
        if (e.target.classList.contains("ok")){
            selectSound.play();
            if (e.target.innerHTML === "New Game") {
                window.open("/newGame", "_self")
            }
        }
    });


}, false);

