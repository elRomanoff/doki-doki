import { mainScreen } from "/scripts/dialogos.js"


class Poem {
    constructor() {
        this.domPoem = document.createElement("div")
        this.domPoem.classList.add("poem-bg")
    }
}

let poem = new Poem()

export function managePoem(poemObj){
    if(poemObj !== "quit"){
        poem.domPoem.innerHTML = `${poemObj.title}</br></br>${poemObj.content}`;
        poem.domPoem.classList.add("poem-" + poemObj.char)
        mainScreen.appendChild(poem.domPoem)
    }
    else {
        poem.domPoem.classList.remove(poem.domPoem.classList[1])
        mainScreen.removeChild(poem.domPoem)
    }
}