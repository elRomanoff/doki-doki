import { mainScreen } from "/scripts/dialogos.js"

export default function managePoem(poemObj) {
    const poem = document.createElement("div")
    poem.classList.add("poem-bg")

    mainScreen.appendChild(poem)
}
