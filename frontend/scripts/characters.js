import {mainScreen} from "/scripts/dialogos.js"
import {dictionary} from "/scripts/dictionary.js"
//prototype of the characters
class Character {
    constructor(charName, route) {
        this.route = route
        this.charName = charName;
        this.png = document.createElement("img");
        this.png.classList.add("char", `${charName}`)
    }
    defineImg(img) {
        this.png.src = dictionary[img];
    }
    append(left) {
        if (left) {
            let first = mainScreen.firstChild
            mainScreen.insertBefore(this.png, first)
        }
        else mainScreen.appendChild(this.png)
    }
    hide() {
        this.png.classList.add("hidden")
    }
    unhide(){
        this.png.classList.remove("hidden")
    }
    animation(direction, value) {
        if (direction === "height") {
            this.png.style.height = value;
        }
        else if (direction === "jump") {
            this.png.classList.add("jump-animation");
            setTimeout(() => {
                this.png.classList.remove("jump-animation")
            }, 600)
        }
        else if (direction === "top") {
            this.png.style.top = value;
        }
        else if (direction === "left") {
            this.png.style.left = value
        }
    }
}

export {Character as Character}