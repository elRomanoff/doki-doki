let pngChar = document.getElementById("char");
pngChar.src = "/api/img/yuri/YScared.png"

let screen = document.querySelector(".screen")

class Character {
    constructor(charName, route) {
        this.route = route
        this.charName = charName;
        this.png = document.createElement("img");
        this.png.classList.add("char", `${charName}`)
    }
    defineImg(img){
        this.png.src = this.route + img
    }
    append(left){
        if (left) {
            let first = screen.firstChild
            screen.insertBefore(this.png, first)
        }
        else screen.appendChild(this.png)
    }
    hide(){
        this.png.classList.toggle("hidden")
    } 
}
let sayori = new Character("sayori", "/api/img/sayori/")
let yuri = new Character("yuri", "/api/img/yuri/")
let natsuki = new Character("natsuki", "/api/img/natsuki/")
let monika = new Character("monika", "/api/img/monika/")

let obj = {
    new: "true",
    char: "Sayori",
    charImg:"Ori4.png",
    left:"true",
    hide:"true"
}

if (obj.char === "Sayori"){
    if(obj.new){
        if(obj.left){
            sayori.append(true)
        }
        else(sayori.append())
    }
    if (obj.charImg){
        sayori.defineImg(obj.charImg)
    }
    if(obj.hide){
        sayori.hide()
    }
}