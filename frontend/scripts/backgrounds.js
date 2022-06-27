import { mainScreen } from "/scripts/dialogos.js"
import { dictionary } from "/scripts/dictionary.js"
//prototype of the characters
class Background {
    constructor() {
        this.blackBg = document.createElement("div")
        this.domImg = document.createElement("img");
        this.blackBg.classList.add("char-bg", "black");
        this.blackBg.style.backgroundColor = "rgba(0,0,0)"
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
        try{mainScreen.removeChild(this.domImg)}catch(e){}
        try{mainScreen.removeChild(this.blackBg)}catch(e){}
    }
    black(){
        mainScreen.appendChild(this.blackBg)
    }
}

export default Background