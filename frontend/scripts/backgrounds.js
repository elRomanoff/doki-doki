import { mainScreen } from "/scripts/dialogos.js"
import { dictionary } from "/scripts/dictionary.js"
//prototype of the characters
class Background {
    constructor() {
        this.domImg = document.createElement("img");
        this.domImg.classList.add("char-bg");
        this.inScreen = false
    }
    defineImg(src) {
        console.log(src)
        this.domImg.src = dictionary[src];
    }
    defineImgWithAnimation(src){
        const prevImg = document.createElement("img")
        prevImg.src = this.domImg.src;
        prevImg.classList.add("char-bg", "char-bg-over")
        mainScreen.appendChild(prevImg);

        this.domImg.src = dictionary[src];
        prevImg.addEventListener("click", ()=> prevImg.classList.add("hidden"))
        setTimeout(() => prevImg.classList.add("hidden"),100)
        setTimeout(() =>{mainScreen.removeChild(prevImg)},1300)

    }
    append() {
        mainScreen.appendChild(this.domImg)
    }
    break(){
        mainScreen.removeChild(this.domImg)
    }
}

export default Background