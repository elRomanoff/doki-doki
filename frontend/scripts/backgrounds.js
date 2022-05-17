import { mainScreen } from "/scripts/dialogos.js"
import { dictionary } from "/scripts/dictionary.js"
//prototype of the characters
class Background {
    constructor() {
        this.domImg = document.createElement("img");
        this.domImg.classList.add("char-bg")   
    }
    defineImg(src) {
        console.log(src)
        this.domImg.src = dictionary[src];
    }
    defineImgWithAnimation(src){
        this.domImg.src = dictionary[src];
    }
    append() {
        mainScreen.appendChild(this.domImg)
    }
}

export default Background