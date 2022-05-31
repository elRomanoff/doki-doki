import { mainScreen } from "/scripts/dialogos.js"
import {cargarSonido} from "/scripts/cargarSonido.js"

class Poem {
    constructor() {
        this.domPoem = document.createElement("div")
        this.domPoem.classList.add("poem-bg")
    }
}
const paperSound = cargarSonido("https://firebasestorage.googleapis.com/v0/b/segundobucket-ddlc.appspot.com/o/sound%2Fpageflip.ogg?alt=media&token=08a30919-db89-4d1c-ac16-532a09b87199")

let poem = new Poem()

export function managePoem(poemObj){
    if(poemObj !== "quit"){
        
        poem.domPoem.innerHTML = `${poemObj.title}</br></br>${poemObj.content}`;
        poem.domPoem.classList.add("poem-" + poemObj.char)
        mainScreen.appendChild(poem.domPoem)
        paperSound.play()
    }
    else {
        poem.domPoem.classList.remove(poem.domPoem.classList[1])
        mainScreen.removeChild(poem.domPoem)
    }
}