"use strict"

import { createSaveScreen } from "/scripts/saveGame.js"
import { cargarSonido } from "/scripts/cargarSonido.js"
import { Character } from "/scripts/characters.js"
import {config} from "/scripts/config.js"
import {dictionary} from "/scripts/dictionary.js"
import Background from "/scripts/backgrounds.js"

//config stuff
const you = config.getName();
const textSpeed = config.getTextSpeed();
const chapter = config.getChapter();
const route = config.getRoute();
const addRoute = [];
let i = config.getGameIndex();
const inScreenCharacters = config.getScreenCharacters();

let enableMusic = config.getMusic();

//GLOBALS
const mainScreen = document.querySelector(".mainScreen");
const pngChar = document.getElementById("char");
const charName = document.getElementById("char-name");
const textBox = document.getElementById("text-box");
let skipInterval;
let music;
let arrDialog = [];
let auxDialogArray = [];
let next = "";

let sayori = new Character("sayori")
let yuri = new Character("yuri")
let natsuki = new Character("natsuki")
let monika = new Character("monika")
let charBg = new Background()

function takeCharactersToScreen () {
    let left = true
    inScreenCharacters.map(x=>{
        if(x !== "char"){
            x.left = left;
            x.new = true;
            x.char = x.charName.charAt(0).toUpperCase() + x.charName.slice(1)
            manageNewCharacter(x);
        }
        else left = false;
    })
    

};
takeCharactersToScreen()


fetch(chapter)
    .then (res => res.json())
    .then (async x => {
        // acá arranca el programa. antes de que se empiece a ejecutar la función que recorre el array al que se le hizo fetch,
        // el programa observa el primer elemento en busca de configuraciones globales
        next = x[0]?.next;
        if( x[0].usesRoute) {
            if(!route) window.open("/Poem", "_self")
            else{
                const res = await fetch(chapter + "/" + route)
                const resJson = await res.json();
                resJson.forEach(y => auxDialogArray.push(y))
            }
        }
    
        x.forEach((element, index) => {
            
            if (index <= i && element.newCharacter && element.newCharacter !=="erase") {
                //todo este quilombo es para arrancar el juego cuando cargas la partida y hay muchos personajes en pantalla
                element.newCharacter.forEach(y => {
                    if (y.charImg) manageNewCharacter({ "char": y.char, "charImg": y.charImg })
                })
            }

            if (element.newRoute) {
                arrDialog.push(...auxDialogArray)
            }
            if(index < i && element.newBackground){ 
                mainScreen.style.backgroundImage = `url("${dictionary[element.newBackground]}")`
            }
            if (element.charImg) {encodeImg (dictionary[element.charImg]);
            }
            if (element.newCharacter) encodeImg (dictionary[element.newCharacter.charImg])

            if(index < i && element.music){
                music = cargarSonido("/api/sound/music/" + element.music);
            }
            //
            arrDialog.push(element)
            //
        });
    
        mainScreen.addEventListener("click",runDialog)
    })


function runDialog() {
    mainScreen.removeEventListener("click", runDialog)

    if (arrDialog[i]) manageProperties(arrDialog[i]);
    else {
        config.setChapter(next);
        config.setGameIndex(0);
        window.location.reload()
    } 
    i++;
    if(enableMusic){
        try{music.play();}catch(err){console.error(err.message)}
    }
    // try{charName.classList.remove("toggler")}catch(err){console.log("Tranquilos, ya esta sacado")}
}

function manageProperties(objDialog){
    if(objDialog.newRoute) console.log("new route! " + route)
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
    if (objDialog.charImg) manageImage(objDialog.charImg);
    
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
    let overScreen = document.createElement("div")
    overScreen.classList.add("crosser");
    mainScreen.appendChild(overScreen);
    setTimeout(() =>{
        mainScreen.style.backgroundImage = "url('" + dictionary[background] + "')"
        setTimeout(() => mainScreen.removeChild(overScreen),500)
    },500)  
    pngChar.src = "";
    textBox.innerHTML = "";
}


function manageImage(img){
    if(!img) pngChar.src = "";

    else if (typeof img === "object"){
        if (!img.background) mainScreen.removeChild(charBg.domImg)
        else if(charBg.domImg.src){
           charBg.defineImgWithAnimation(img.backgound)
        }
        else{
            charBg.defineImg(img.background)
            charBg.append()
        }
    }

    else pngChar.src = dictionary[img]
}
function encodeImg(imgSrc) {
    const imgToInsert = document.createElement("img");
    imgToInsert.src = imgSrc
    textBox.appendChild(imgToInsert);
    imgToInsert.style.display = "none"
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
    const inScreenCharacters = document.querySelectorAll(".char")
    const arrDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    const arrMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let dateToSave = new Date()
    let fullDate = `${arrDays[dateToSave.getDay()]}, ${arrMonths[dateToSave.getMonth()]} ${dateToSave.getDate()} ${dateToSave.getFullYear()}, ${dateToSave.getHours()}:${dateToSave.getMinutes()}`
    const objectToSave = {inScreenCharacters:[], doki_currentGame: i, background: mainScreen.style.backgroundImage, date: fullDate, chapter: chapter, route:route, addRoute: addRoute}
    
    for (let index = 0; index < inScreenCharacters.length; index++) {
        if(inScreenCharacters[index].id) objectToSave.inScreenCharacters.push("char")
        else if (inScreenCharacters[index].classList.contains("hidden")) objectToSave.inScreenCharacters.push({ charName: inScreenCharacters[index].classList[1], hide:"hide"})
        else objectToSave.inScreenCharacters.push({charName: inScreenCharacters[index].classList[1]})
    }
    
    const saveScreen = createSaveScreen(option, objectToSave)
    mainScreen.appendChild(saveScreen)
    document.getElementById("return").addEventListener("click", () =>{mainScreen.removeChild(mainScreen.lastElementChild)})
    document.getElementById("save-btn").addEventListener("click", () => { mainScreen.removeChild(mainScreen.lastElementChild); saveGame("Save")})
    document.getElementById("load-btn").addEventListener("click", () => { mainScreen.removeChild(mainScreen.lastElementChild); saveGame("Load")})
    document.getElementById("delete-btn").addEventListener("click", () => { mainScreen.removeChild(mainScreen.lastElementChild); saveGame("Delete")})
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

//key pressing


document.addEventListener("keydown", (e) => {
    if (e.key === " "){
        const event = new MouseEvent("click",{
            
        })
        mainScreen.dispatchEvent(event)
    }
})

window.addEventListener('resize', resize);
resize();

export {mainScreen as mainScreen}