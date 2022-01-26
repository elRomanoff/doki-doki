"use strict"
let next =  "/poem" 

import { createSaveScreen } from "/scripts/saveGame.js"
import { cargarSonido } from "/scripts/cargarSonido.js"
import { Character } from "/scripts/characters.js"
import {config} from "/scripts/config.js"
import {dictionary} from "/scripts/dictionary.js"

//config stuff
const you = config.getName();
const textSpeed = config.getTextSpeed()
const chapter = config.getChapter()
let i = localStorage.getItem("doki_currentGame");
if (!i) i = 0;    

let enableMusic = config.getMusic();



//GLOBALS
const mainScreen = document.querySelector(".mainScreen");
let music;
const pngChar = document.getElementById("char");
let skipInterval
const charName = document.getElementById("char-name");
const textBox = document.getElementById("text-box");
let arrDialog = []




let sayori = new Character("sayori", "/api/img/sayori/")
let yuri = new Character("yuri", "/api/img/yuri/")
let natsuki = new Character("natsuki", "/api/img/natsuki/")
let monika = new Character("monika", "/api/img/monika/")


fetch(chapter)
    .then (res => res.json())
    .then (x =>{
        //todo este quilombo es para arrancar el juego cuando cargas la partida y hay muchos personajes en pantalla
            let breakPoint = []
            length = x.length
            x.forEach((element, index) => {

                if(index < i && element.newBackground){
                    mainScreen.style.backgroundImage = `url("${dictionary[element.newBackground]}")`
                }
                if(index < i && element.newCharacter){
                    breakPoint.push(element.newCharacter)
                    if(element.newCharacter == "erase") breakPoint.length = 0;
                }
                if(index < i && element.music){
                    music = element.music
                }            
                arrDialog.push(element)
            });
         breakPoint.forEach(x => {
             x.forEach(y => manageNewCharacter(y))
         })

        
        
        mainScreen.addEventListener("click",runDialog)
    })


function runDialog() {
    mainScreen.removeEventListener("click", runDialog)

    if (arrDialog[i]) manageProperties(arrDialog[i]);
    else window.open(next, "_self")
    i++;
    if(enableMusic !== "false"){
        console.log(enableMusic)
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
    if (objDialog.charImg) manageImage(objDialog.charImg);
    if (objDialog.insertImg) manageImage(objDialog.charImg);
    
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
    else pngChar.src = dictionary[img]
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
    const arrDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    const arrMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let dateToSave = new Date()
    let fullDate = `${arrDays[dateToSave.getDay()]}, ${arrMonths[dateToSave.getMonth()]} ${dateToSave.getDate()} ${dateToSave.getFullYear()}, ${dateToSave.getHours()}:${dateToSave.getMinutes()}`

    const objectToSave = {doki_currentGame: i, background: mainScreen.style.backgroundImage, date: fullDate, chapter: chapter}
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

window.addEventListener('resize', resize);

resize();

export {mainScreen as mainScreen}