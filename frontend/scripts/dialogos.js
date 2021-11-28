let you = "" 
if(localStorage.getItem("name")) you = localStorage.getItem("name")
else {
    you = prompt("Insert your name");
    localStorage.setItem("name", you)
}

let next =  "/poem" 

import { createSaveScreen } from "/scripts/saveGame.js"
import { cargarSonido } from "/scripts/cargarSonido.js"
import { Character } from "/scripts/characters.js"
import {config} from "/scripts/config.js"

let mainScreen = document.querySelector(".mainScreen");
mainScreen.style.backgroundImage = `url("/api/img/background/barrio.png/")`

let music;
let enableMusic = config.music
let pngChar = document.getElementById("char");
let skipInterval
let charName = document.getElementById("char-name");
let textBox = document.getElementById("text-box");
let i = localStorage.getItem("currentGame");

if(!i) i = 0;



let textSpeed = config.textSpeed

let arrDialog = []

let saveObj = {}


let sayori = new Character("sayori", "/api/img/sayori/")
let yuri = new Character("yuri", "/api/img/yuri/")
let natsuki = new Character("natsuki", "/api/img/natsuki/")
let monika = new Character("monika", "/api/img/monika/")

//



fetch("/start")
    .then (res => res.json())
    .then (x =>{
            length = x.length
            x.forEach(element => {
            arrDialog.push(element)
         });
        mainScreen.addEventListener("click",runDialog)
    })


function runDialog() {
    mainScreen.removeEventListener("click", runDialog)

    if (arrDialog[i]) manageProperties(arrDialog[i]);
    else window.open(next, "_self")
    i++;
    if(enableMusic === "true"){
        try{music.play();}catch(err){console.log("Tranquilos, yo le pregunté")}
    }
    // try{charName.classList.remove("toggler")}catch(err){console.log("Tranquilos, ya esta sacado")}
}

function manageProperties(objDialog){
    if(objDialog.newCharacter){
        if (objDialog.newCharacter == "erase") {
            try{mainScreen.removeChild(sayori.png)}catch{}
            try{mainScreen.removeChild(yuri.png)}catch{}
            try{mainScreen.removeChild(monika.png)}catch{} 
            try{mainScreen.removeChild(natsuki.png)}catch{}    
        }
        else objDialog.newCharacter.forEach(obj =>manageNewCharacter(obj))
    }
    if(objDialog.newBackground){
        manageBackground(objDialog.newBackground);
    }
    if(objDialog.animation){
        objDialog.animation.forEach(animation => manageAnimation(animation))
    }
    if(objDialog.music) {
        try{music.pause()} catch{console.log("ahora mismo no hay musica sonando")}
        music = cargarSonido("/api/sound/music/" + objDialog.music);
    }
    if(objDialog.usesVar) {
        objDialog.content = objDialog.content.replace("#var", you)
    }
    if(objDialog.char) {
        if(charName.classList.contains("toggler")) charName.classList.remove("toggler");
        if (objDialog.char === "nobody") charName.classList.add("toggler")
        else if (objDialog.char === "you") charName.innerHTML = you; 
        else charName.innerHTML = objDialog.char;
    }
    if (objDialog.charImg) manageImage(objDialog.char, objDialog.charImg);
    if (objDialog.insertImg) manageImage(objDialog.insertImg, objDialog.charImg);
    
    if (!objDialog.content){
        i++;
        runDialog();
    }
    else addAnimatedText(objDialog.content);
}

function addAnimatedText(text) {
    textBox.innerHTML = ""
    let j = 0;
    mainScreen.addEventListener("click", printFullText)
    function printFullText() {
        mainScreen.removeEventListener("click", printFullText);
        textBox.innerHTML = text;
        j = text.length;
    }
    if (!text) return;
    
    if (skipInterval) {
        let arrText = text.split(" ");
        let interval = setInterval(function() {
            if(arrText[j] !== undefined) {
                textBox.innerHTML += arrText[j] + " ";
                j++
            }
            else{
                clearInterval(interval);
                mainScreen.addEventListener("click", runDialog)
            }
        },4)
    }else{
        let interval = setInterval(function () {
            if (text[j] !== undefined) {
                textBox.innerHTML += text[j]
                j++;
            }
            else {
                clearInterval(interval);
                mainScreen.addEventListener("click", runDialog)
            }
        }, textSpeed);     
    }

}

function manageBackground(background){
    pngChar.src="";
    textBox.innerHTML = "";

    let overScreen = document.createElement("div")
    overScreen.classList.add("crosser");
    mainScreen.appendChild(overScreen);

    setTimeout(() =>{
        mainScreen.style.backgroundImage = `url("/api/img/background/${background}/")`
        setTimeout(() => mainScreen.removeChild(overScreen),500)
    },500)  
    

}

function manageImage(char, img){
    if(!img) pngChar.src = "";
    else{
        if(char === "Sayori"){
            pngChar.src = "/api/img/sayori/" +img;
        }else 
        if (char === "Yuri"){
            pngChar.src = "/api/img/yuri/" + img;
        }else
        if(char === "Natsuki"){
            pngChar.src = "/api/img/natsuki/" + img;
        }else
        if(char === "Monika"){
            pngChar.src = "/api/img/monika/" + img;
        }
    }
}

//add new character to the Screen
function manageNewCharacter(obj){
    if (obj.char === "Sayori") {
        if (obj.new) {
            if (obj.left) {
                sayori.append(true)
            }
            else (sayori.append())
        }
        if (obj.charImg) {
            sayori.defineImg(obj.charImg)
        }
        if (obj.hide) {
            if(obj.hide == "hide") sayori.hide()
            else sayori.unhide()
        }
    };
    if (obj.char === "Yuri") {
        if (obj.new) {
            if (obj.left) {
                yuri.append(true)
            }
            else (yuri.append())
        }
        if (obj.charImg) {
            yuri.defineImg(obj.charImg)
        }
        if (obj.hide) {
            if(obj.hide == "hide")yuri.hide()
            else yuri.unhide()
            
        }
    }
    if (obj.char === "Natsuki") {
        if (obj.new) {
            if (obj.left) {
                natsuki.append(true)
            }
            else (natsuki.append())
        }
        if (obj.charImg) {
            natsuki.defineImg(obj.charImg)
        }
        if (obj.hide) {
            if (obj.hide == "hide") natsuki.hide()
            else natsuki.unhide()
        }
    }
    if (obj.char === "Monika") {
        if (obj.new) {
            if (obj.left) {
                monika.append(true)
            }
            else (monika.append())
        }
        if (obj.charImg) {
            monika.defineImg(obj.charImg)
        }
        if (obj.hide) {
            if(obj.hide == "hide") monika.hide();
            else monika.unhide()
        }
    }
    
}
    
//animations
function manageAnimation(objAnimation){
    if(!objAnimation.char){
        if (objAnimation.direction === "height") {
            char.style.height = objAnimation.value;
        }
        else if (objAnimation.direction === "top"){
            char.style.top = objAnimation.value;
        }
        else if(objAnimation.direction === "left"){
            char.style.left = objAnimation.value;
        }
        else if(objAnimation.direction === "jump"){
            if(char.classList.contains("jump-animation")) char.classList.remove("jump-animation")
            char.classList.add("jump-animation")
            setTimeout(function () {
                char.classList.remove("jump-animation");
            },600)
        }
    }
    else if(objAnimation.char === "Yuri"){
        yuri.animation(objAnimation.direction, objAnimation.value)
    }
    else if(objAnimation.char === "Natsuki"){
        natsuki.animation(objAnimation.direction, objAnimation.value)
    }
    else if(objAnimation.char === "Monika"){
        monika.animation(objAnimation.direction, objAnimation.value)
    }
    else if(objAnimation.char === "Sayori"){
        sayori.animation(objAnimation.direction, objAnimation.value)
    }
}


//options
function saveGame(option) {
    const objectToSave = {index: i, background: mainScreen.style.backgroundImage}
    const saveScreen = createSaveScreen(option, objectToSave)
    mainScreen.appendChild(saveScreen)
    document.getElementById("return").addEventListener("click", () =>{mainScreen.removeChild(mainScreen.lastElementChild)})
}

function showStory() {
    let index = i;
    if (index >= 15) index = index - 15;
    else index = 0;
    let history = "";
    for (index; index < i; index++) {
        if (arrDialog[index].char && arrDialog[index].char != "nobody") history += arrDialog[index].char + ": ";
        history += arrDialog[index].content + "\n";
    }
    alert(history)
}
function skip() {
    if (!skipInterval) {
        skipInterval = setInterval(() => { runDialog() }, 300)
    }
    else {
        clearInterval(skipInterval)
        skipInterval = null;
    }
}
const openMenu = () => {
    window.open("/", "_self")
}

let options = document.getElementById("options")
options.addEventListener("click", function(e){
    e.stopPropagation();
    if(e.target.id === "history") showStory()
    else if (e.target.id ==="skip") skip()
    else if (e.target.id ==="load") saveGame("Load")
    else if (e.target.id === "save") saveGame("Save")
    else if (e.target.id ==="menu") openMenu()
}) 


//resice mainScreen
const resize = () => {
    if (screen.height < 720){
        mainScreen.style.height = screen.height+"px";
        let auxWidth = (screen.height * 1280) / 720
        mainScreen.style.width = auxWidth + "px";
        mainScreen.style.fontSize = (auxWidth * 26 / 1280) + "px" 
    }
}

window.addEventListener('resize', resize);

resize();

export {mainScreen as mainScreen}