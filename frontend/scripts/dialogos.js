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
const addRoute = config.getAditionalRoute();
let i = config.getGameIndex();
const inScreenCharacters = config.getScreenCharacters();
const {sayScore,natScore,yuScore} = config.getScore()

console.log(sayScore, natScore, yuScore)

let enableMusic = config.getMusic();

//GLOBALS

const hoverSound = cargarSonido("https://firebasestorage.googleapis.com/v0/b/vamosaprobarpitos.appspot.com/o/musica%2Fhover.ogg?alt=media&token=69a7fd4d-f846-4215-87e7-96dc46e0149c");
const selectSound = cargarSonido("https://firebasestorage.googleapis.com/v0/b/vamosaprobarpitos.appspot.com/o/musica%2Fselect.ogg?alt=media&token=02f9acb0-aa26-41f4-97c8-68eac0a0a5e7");

const mainScreen = document.querySelector(".mainScreen");
const pngChar = document.getElementById("char");
const charName = document.getElementById("char-name");
const textBox = document.getElementById("text-box");
let skipInterval;
let music;
let arrDialog = [];
let auxDialogArray = [];
let selectionMenu = [];
let selectionOptions = {};
let next = "";

//variables to save game
let {song, currentBackground, currentImg} = config.getExtra()
manageImage(currentImg)
manageBackground(currentBackground)
music = cargarSonido("/api/sound/music/" + song)

//instance of characters and background
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

//init
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
            if (element.charImg) {encodeImg (dictionary[element.charImg]);
            }
            if (element.newCharacter) encodeImg (dictionary[element.newCharacter.charImg])

            //
            arrDialog.push(element)
            //
        });
    
        mainScreen.addEventListener("click",runDialog)
    })


function runDialog(skipInterval) {


    if (arrDialog[i]?.selectMenu && skipInterval === "skipping") return "stop"

    mainScreen.removeEventListener("click", runDialog)

    if (arrDialog[i]) manageProperties(arrDialog[i]);
    else {
        config.setRoute("")
        config.setAditionalRoute([])
        config.setChapter(next);
        config.setGameIndex(0);
        window.location.reload()
    } 
    i++;
    if(enableMusic){
        try{music.play();}catch(err){console.error(err.message)}
    }
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
        song = objDialog.music
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

    if(objDialog.selectMenu){
        document.removeEventListener("keydown", keyDownPress)

        if(objDialog.selectMenu === "continue"){
            createSelectionMenu ()
        }
        else createSelectionMenu(objDialog.selectMenu, objDialog, true)
    }
    if(objDialog.optionalText) manageOptions(objDialog)
}

function manageOptions(optionObj){
    if(selectionMenu.filter(filtered => filtered.char === optionObj.optionCharacter)[0]) addAnimatedText(optionObj.optionalText[1])
    else if(optionObj.optionalText[0]){
        addAnimatedText(optionObj.optionalText[0])
    }
    else {i++; runDialog()}
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

    currentBackground = background;
    let overScreen = document.createElement("div")
    overScreen.classList.add("crosser");
    mainScreen.appendChild(overScreen);
    if(background === "transition"){
        setTimeout(() => mainScreen.removeChild(overScreen), 500)
    }
    else{
        setTimeout(() => {
            mainScreen.style.backgroundImage = "url('" + dictionary[background] + "')"
            setTimeout(() => mainScreen.removeChild(overScreen), 500)
        }, 500)
        pngChar.src = "";
        textBox.innerHTML = "";
    }
}

function manageImage(img){
    if(!img) pngChar.src = "";

    else if (typeof img === "object"){
        if (!img.background) mainScreen.removeChild(charBg.domImg)
        else if(charBg.domImg.src){
           charBg.defineImgWithAnimation(img.background)
        }
        else{
            charBg.defineImg(img.background)
            charBg.append();
        }
    }

    else{
         pngChar.src = dictionary[img]
        currentImg = img
    }
}
function encodeImg(imgSrc) {
    const imgToInsert = document.createElement("img");
    imgToInsert.src = imgSrc
    mainScreen.appendChild(imgToInsert);
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

//selectionMenu
function createSelectionMenu(arrChar, objDialog, isNew) {

    if(arrChar) selectionMenu = arrChar.map(objChar => {return objChar})


    if(isNew && objDialog.dependsOnRoute) {
        if (sayScore < 30) selectionOptions.Sayori = objDialog.Sayori.dislike
        else if( sayScore >= 30 && sayScore < 45 ) selectionOptions.Sayori = objDialog.Sayori.like
        else selectionOptions.Sayori = objDialog.Sayori.love

       if(yuScore < 30) selectionOptions.Yuri = objDialog.Yuri.dislike;
       else if (yuScore >= 30 && yuScore < 45) selectionOptions.Yuri = objDialog.Yuri.like;
       else selectionOptions.Yuri = objDialog.Yuri.love

        if (natScore < 30) selectionOptions.Natsuki = objDialog.Natsuki.dislike;
        else if (natScore >= 30 && natScore < 45) selectionOptions.Natsuki = objDialog.Natsuki.like;
        else selectionOptions.Natsuki = objDialog.Natsuki.love;

        selectionOptions.Monika = objDialog.Monika;
        
        selectionOptions.Sayori = [...selectionOptions.Sayori, ...objDialog.Sayori.end]
        selectionOptions.Yuri = [...selectionOptions.Yuri, ...objDialog.Yuri.end]
        selectionOptions.Natsuki = [...selectionOptions.Natsuki, ...objDialog.Natsuki.end]


        console.log(selectionOptions.Sayori)
    }
    //if ! depends on route
    else if(isNew){
        selectionOptions.Sayori = objDialog.Sayori;
        selectionOptions.Yuri = objDialog.Yuri;
        selectionOptions.Natsuki = objDialog.Natsuki;
        selectionOptions.Monika = objDialog.Monika
    }
    if(!selectionMenu.length){
        textBox.innerHTML=""
        document.addEventListener("keydown", keyDownPress)
        return
    }

    const selectionContainer = document.createDocumentFragment();
    const selectContainer = document.createElement("div")
    selectContainer.classList.add("selection-container")
    selectContainer.addEventListener("click",(e) =>{e.stopPropagation()})

    selectionMenu.forEach( x => {
        const charSelect = document.createElement("div");
        charSelect.classList.add("selection-btn", x.char)
        charSelect.innerHTML = x.content;
        charSelect.addEventListener("mouseover",()=> hoverSound.play())
        charSelect.addEventListener("click",(e)=>{ 
            selectSound.play();
            mainScreen.removeChild(selectContainer)
            document.addEventListener("keydown", keyDownPress)
            arrDialog.splice(i,0,...selectionOptions[e.target.classList[1]])

            if (selectionMenu.length >= 4) arrDialog.splice(i, 0, ...selectionMenu.find(y => { return y.char === e.target.innerHTML }).message)

            //fake click
            const event = new MouseEvent("click", {})
            mainScreen.dispatchEvent(event)
            //
            selectionMenu = selectionMenu.filter(filtered => filtered.char !== e.target.classList[1])
        })
        selectContainer.appendChild(charSelect) 
    })
    selectionContainer.appendChild(selectContainer)
    mainScreen.appendChild(selectionContainer)    
}

//options
function saveGame(option) {
    const inScreenCharacters = document.querySelectorAll(".char")
    const arrDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    const arrMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let dateToSave = new Date()
    let fullDate = `${arrDays[dateToSave.getDay()]}, ${arrMonths[dateToSave.getMonth()]} ${dateToSave.getDate()} ${dateToSave.getFullYear()}, ${dateToSave.getHours()}:${dateToSave.getMinutes()}`
    const objectToSave = {inScreenCharacters:[], doki_currentGame: i, background: mainScreen.style.backgroundImage, date: fullDate, chapter: chapter, route:route, addRoute: addRoute, song:song, img:currentImg, currentBackground:currentBackground}
    
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
    document.getElementById("menu-btn").addEventListener("click", () => {window.open("/", "_self") })

    
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
        skipInterval = setInterval(() => {
            const skipping = runDialog("skipping");
            if (skipping) {
                clearInterval(skipInterval);
                skipInterval = null;
            }
        }, 300)
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
        mainScreen.style.height = (screen.height - 50) +"px";
        let auxWidth = ((screen.height - 50) * 1280) / 720
        mainScreen.style.width = auxWidth + "px";
        mainScreen.style.fontSize = (auxWidth * 26 / 1280) + "px" 
    }
}

//key pressing

function keyDownPress(e) {
    if (e.key === " ") {
        const event = new MouseEvent("click", {

        })
        mainScreen.dispatchEvent(event)
    }
}
document.addEventListener("keydown", keyDownPress)

window.addEventListener('resize', resize);
resize();

export {mainScreen as mainScreen}