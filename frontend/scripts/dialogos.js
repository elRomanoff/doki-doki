"use strict"

import { createSaveScreen } from "/scripts/saveGame.js"
import { cargarSonido } from "/scripts/cargarSonido.js"
import { Character } from "/scripts/characters.js"
import {config} from "/scripts/config.js"
import {dictionary} from "/scripts/dictionary.js"
import Background from "/scripts/backgrounds.js"
import {managePoem} from "/scripts/managePoem.js"
import remove from "/scripts/gameStart.js"

//config stuff
let changeSaveError = false
const you = config.getName();
let enableMusic = config.getMusic();
let textSpeed = config.getTextSpeed();
const chapter = config.getChapter();
const route = config.getRoute();
const addRoute = config.getAditionalRoute();
let i = config.getGameIndex();
const inScreenCharacters = config.getScreenCharacters();
const {sayScore,natScore,yuScore} = config.getScore();
const {prevSScore, prevNScore, prevYScore} = config.getPrevScore();

const choices = config.getChoices();
let currentChoice = 0;

console.log(config.getScore(), config.getPrevScore())


//GLOBALS

const hoverSound = cargarSonido("/api/sound/sfx/hover-sound");
const selectSound = cargarSonido("/api/sound/sfx/select");
const slap = cargarSonido("https://firebasestorage.googleapis.com/v0/b/segundobucket-ddlc.appspot.com/o/sound%2Fslap.ogg?alt=media&token=f0248221-f60e-41b2-a757-ed0cce40331f")

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

let audioN
let audioS 
let audioM 
let audioY 
let audioNeutral 
let myFeelings


//variables to save game
let {song, currentBackground, currentImg} = config.getExtra() 

manageImage(currentImg)
manageBackground(currentBackground)

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


//checkIfEnded

if(chapter === "the-end" || localStorage.getItem("the-end")){
    if(chapter === "the-end") localStorage.setItem("the-end", true)
    window.open("/Happy", "_self")
}

//init
fetch(chapter)
    .then (res => res.json())
    .then (async x => {
        // acá arranca el programa. antes de que se empiece a ejecutar la función que recorre el array al que se le hizo fetch,
        // el programa observa el primer elemento en busca de configuraciones globales
        next = x[0]?.next;
        if( x[0].usesRoute) {
            console.log(route)
            if(!route) window.open("/Poem", "_self")
            else{
                let fetchCall = ""

                if(x[0].usesPrevScore){
                    if ((route === "sayori" && prevSScore > prevNScore && prevSScore > prevYScore) || (route === "yuri" && prevYScore > prevSScore && prevYScore > prevNScore) || (route === "natsuki" && prevNScore > prevSScore && prevNScore > prevYScore)){
                        fetchCall = chapter + "/" + route
                    }
                    else fetchCall = `day${parseInt(chapter[chapter.length - 1]) - 1}/${route}`;
                }
                else{
                    fetchCall = chapter + "/" + route
                }

                const res = await fetch(fetchCall)
                const resJson = await res.json();
                resJson.forEach(y => auxDialogArray.push(y))
            }
        }
    
        let sumIndex = 0;

        x.forEach((element, index) => {
            
            if (index + sumIndex <= i && element.newCharacter && element.newCharacter !=="erase") {
                //todo este quilombo es para arrancar el juego cuando cargas la partida y hay muchos personajes en pantalla
                element.newCharacter.forEach(y => {
                    if (y.charImg) manageNewCharacter({ "char": y.char, "charImg": y.charImg })
                })
            }
            if (element.newRoute) {
                arrDialog.push(...auxDialogArray);
                sumIndex = auxDialogArray.length
            }
            if (element.nextRoute) console.log("HOLA?")//next = next + element.nextRoute
            if (element.charImg) {
                if(element.charImg.background) encodeImg(dictionary[element.charImg.background])
                encodeImg (dictionary[element.charImg]);
                if (index + sumIndex <= i) manageImage(element.charImg)
            }
            if (element.newCharacter) encodeImg (dictionary[element.newCharacter.charImg])

            if (index + sumIndex <= i && element.musicGroup && (enableMusic !== "false" || !enableMusic)) {
                manageMusicGroup(element.musicGroup)
            }

            if (index + sumIndex <= i && element.selectMenu){

                selectionMenu = element.selectMenu.map(objChar => { return objChar })

                if (element.dependsOnRoute) {
                    selectionOptions.Monika = element.Monika.concat(element.Monika[0][route]);
                    
                    if (sayScore < 30) selectionOptions.Sayori = element.Sayori.dislike
                    else if (sayScore >= 30 && sayScore < 45) selectionOptions.Sayori = element.Sayori.like
                    else selectionOptions.Sayori = element.Sayori.love
                    if (yuScore < 30) selectionOptions.Yuri = element.Yuri.dislike;
                    else if (yuScore >= 30 && yuScore < 45) selectionOptions.Yuri = element.Yuri.like;
                    else selectionOptions.Yuri = element.Yuri.love

                    if (natScore < 30) selectionOptions.Natsuki = element.Natsuki.dislike;
                    else if (natScore >= 30 && natScore < 45) selectionOptions.Natsuki = element.Natsuki.like;
                    else selectionOptions.Natsuki = element.Natsuki.love;

                    selectionOptions.Sayori = [...selectionOptions.Sayori, ...element.Sayori.end]
                    selectionOptions.Yuri = [...selectionOptions.Yuri, ...element.Yuri.end]
                    selectionOptions.Natsuki = [...selectionOptions.Natsuki, ...element.Natsuki.end]
                    selectionOptions.Monika = [...selectionOptions.Monika, ...element.Monika[0].end]
                }
                else{
                    selectionOptions.Sayori = element.Sayori;
                    selectionOptions.Yuri = element.Yuri;
                    selectionOptions.Natsuki = element.Natsuki;
                    selectionOptions.Monika = element.Monika
                }

                for(currentChoice; currentChoice < choices.length; currentChoice++){
                    if (selectionMenu.length >= 4) {
                        try{arrDialog.splice(index + sumIndex, 0, ...selectionMenu.find(y => { return y.char === choices[currentChoice] }).message)}catch(e){}
                        if(chapter === "day2") sumIndex = sumIndex + 2
                    }
                    let finded = selectionMenu.find(x => x.char === choices[currentChoice]);
                    let indexFinded = selectionMenu.indexOf(finded)
                    selectionMenu.splice(indexFinded, 1)

                    if (selectionOptions[choices[currentChoice]]){
                        arrDialog.splice(index + sumIndex, 0, ...selectionOptions[choices[currentChoice]])

                        sumIndex = sumIndex + selectionOptions[choices[currentChoice]].length
                    }
                    element = {}

                    if(selectionMenu.length < 1) break;
                }

            }
            if (index + sumIndex <= i && element.option) manageOptions(element)
            //
            arrDialog.push(element)
            //
        });
        try{
            let auxNextRoute = arrDialog.find(element => element.nextRoute).nextRoute
            if((chapter === "finaln" || chapter==="finaly") && auxNextRoute) next = next + auxNextRoute
        }
        catch(e){}
        mainScreen.addEventListener("click",runDialog)
    })

if (song) music = cargarSonido("/api/sound/music/" + song)


if (music && i > 0 && (enableMusic !== "false" || !enableMusic)) music.play();

function runDialog(skipInterval) {

    if ((arrDialog[i]?.selectMenu || arrDialog[i]?.poem) && skipInterval === "skipping") return "stop"

    mainScreen.removeEventListener("click", runDialog)

    if (arrDialog[i]) manageProperties(arrDialog[i]);
    else {
        config.setRoute("")
        config.setAditionalRoute([])
        config.setChapter(next);
        config.setGameIndex(0);
        config.setChoices([])
        window.location.reload()
    } 
    i++;
}

function manageProperties(objDialog){
    if (objDialog.nextRoute) next = next + objDialog.nextRoute
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
        if (objDialog.animation === "return") manageAnimation("return")
        else objDialog.animation.forEach(animation => manageAnimation(animation))
    }
    if(objDialog.music) manageMusic(objDialog.music)
    if(objDialog.musicGroup && (enableMusic !== "false" || !enableMusic) )  manageMusicGroup(objDialog.musicGroup)
    if(objDialog.usesVar) {
        objDialog.content = objDialog.content.replace("#var", you)
        if(route !== "sayori") objDialog.content = objDialog.content.replace("#route", route)
        else objDialog.content = objDialog.content.replace("#route", "Yuri")
        objDialog.content = objDialog.content.replace("#choice", choices[choices.length -1])
    }
    if(objDialog.char) {
        if(charName.classList.contains("toggler")) charName.classList.remove("toggler");
        if(objDialog.char !== "nobody"){
            if (objDialog.char === "you") charName.innerHTML = you; 
            else charName.innerHTML = objDialog.char;
        }

        else charName.classList.add("toggler")

    }
    if (objDialog.charImg) manageImage(objDialog.charImg);

    if(objDialog.selectMenu){
        if(objDialog.dependsOnRoute) changeSaveError = i - 5;
        document.removeEventListener("keydown", keyDownPress)

        if(objDialog.selectMenu === "continue"){
            createSelectionMenu ()
        }
        else createSelectionMenu(objDialog.selectMenu, objDialog, true)
    }
    if(objDialog.poem)managePoem(objDialog.poem)
    if(objDialog.options) manageOptions(objDialog)
    if(objDialog.sound) manageSound(objDialog.sound)


    if (!objDialog.content) {
        i++;
        runDialog();
    }
    else{
        // if(objDialog?.char !== "nobody") objDialog.content = `"${objDialog.content}"` 
        addAnimatedText(objDialog.content);
    }
    return
}

function manageSound(sound){
    if(sound === "slap"){
        slap.play();
        const whiteScreen = document.createElement("div");
        whiteScreen.classList.add("white-screen");
        mainScreen.appendChild(whiteScreen);
        setTimeout(()=>{mainScreen.removeChild(whiteScreen);},250)
    }
}

function manageOptions(optionObj){

    //si la opcion es "ya entregaste el poema a"
    if(optionObj.shownCharacter){
        //primer if: ver si le entregaste el poema
        //segundo if: si es por opciones o no
        if (selectionMenu.filter(filtered => filtered.char === optionObj.shownCharacter)[0]) {
            if(optionObj.optionalText) addAnimatedText(optionObj.optionalText[1])
            else arrDialog.splice(i + 1, 0, ...optionObj.option1)
        }

        else if (optionObj.optionalText) {
            addAnimatedText(optionObj.optionalText[0])
        }
        else if (optionObj.option2) arrDialog.splice(i + 1, 0, ...optionObj.option2)
        else { i++; runDialog() }
    }

    else if(optionObj.route && optionObj.prevRoute){
        if(optionObj.prevRoute === "y") {
            if (prevYScore >= prevSScore && prevYScore >= prevNScore && optionObj.route == route) arrDialog.splice(i + 1, 0, ...optionObj.option1)
            else arrDialog.splice(i + 1, 0, ...optionObj.option2)
        }
        else if (optionObj.prevRoute === "n") {
            if (prevNScore >= prevSScore && prevNScore >= prevYScore && optionObj.route == route) arrDialog.splice(i + 1, 0, ...optionObj.option1)
            else arrDialog.splice(i + 1, 0, ...optionObj.option2)
        }
        //WTF????
        else if (optionObj.prevRoute === "s") {
            if (prevSScore >= prevYScore && prevSScore >= prevNScore && optionObj.route == route) arrDialog.splice(i + 1, 0, ...optionObj.option1)
            else arrDialog.splice(i + 1, 0, ...optionObj.option2)
        }
    }

    //la opcion aca es "si estas siguiendo la ruta de tal", independientemente de si le gusto o amó el poema
    else if (optionObj.route){
        if(optionObj.route == route) arrDialog.splice(i + 1, 0, ...optionObj.option1)
        else arrDialog.splice(i + 1, 0, ...optionObj.option2)
    }
    
    //option "previous route"

    else if(optionObj.prevRoute){
        if(optionObj.prevRoute === "s"){
            if(prevSScore >= 43) arrDialog.splice(i+1,0, ...optionObj.option1)
            else if (prevSScore >= 30) arrDialog.splice(i + 1, 0, ...optionObj.option2)
            else arrDialog.splice(i + 1, 0, ...optionObj.option3)
        }
        else if (optionObj.prevRoute === "n") {
            if (prevNScore >= 43) arrDialog.splice(i + 1, 0, ...optionObj.option1)
            else if (prevNScore >= 30) arrDialog.splice(i + 1, 0, ...optionObj.option2)
            else arrDialog.splice(i + 1, 0, ...optionObj.option3)
        }
        else if (optionObj.prevRoute === "y") {
            if (prevYScore >= 43) arrDialog.splice(i + 1, 0, ...optionObj.option1)
            else if (prevYScore >= 30) arrDialog.splice(i + 1, 0, ...optionObj.option2)
            else arrDialog.splice(i + 1, 0, ...optionObj.option3)
        }
    }
    else if (optionObj.options === "setEnd") localStorage.setItem("doki_currentChapter","the-end")


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
                mainScreen.addEventListener("click", runDialog);
                printFullText()
            }
        }, textSpeed);     
    }


}

function manageBackground(background){

    let overScreen = document.createElement("div")
    overScreen.classList.add("crosser");
    if(background === "transition"){
        mainScreen.appendChild(overScreen);
        setTimeout(() => mainScreen.removeChild(overScreen), 500)
    }
    else if (background?.noTransition){
        mainScreen.style.backgroundImage = "url('" + dictionary[background.src] + "')"
        currentBackground = mainScreen.style.backgroundImage;
    }
    else{
        mainScreen.appendChild(overScreen);
        setTimeout(() => {
            if (background[background.length - 1] === ")") mainScreen.style.backgroundImage = background
            else mainScreen.style.backgroundImage = "url('" + dictionary[background] + "')"
            setTimeout(() => mainScreen.removeChild(overScreen), 500)
        }, 500)

        if(dictionary[background]) currentBackground = "url('" + dictionary[background] + "')"
        else currentBackground = background
        pngChar.src = "";
    }
}

function manageImage(img){

    if(!img) pngChar.src = "";
    else if (typeof img === "object"){
        if (!img.background) try { mainScreen.removeChild(charBg.domImg); charBg.inScreen = false}catch(e){console.log("aaaaaaa " + e)}
        else if (img.background === "break") charBg.break();
        else if (img.background === "black") charBg.black();
        else if (img.background === "remove") remove()
        else{ 
            if(charBg.inScreen){
                charBg.defineImgWithAnimation(img.background)
            }
            else{
                charBg.inScreen = true
                charBg.defineImg(img.background)
                charBg.append();
            }
        currentBackground = "url(" + dictionary[img.background] + ")"
        }
    }

    else{
        if (img[img.length - 1] != "g"){ pngChar.src = ""}
        else {
            pngChar.src = dictionary[img]
            currentImg = img;
        }
    }
}
function encodeImg(imgSrc) {
    const imgToInsert = document.createElement("img");
    imgToInsert.src = imgSrc
    document.body.appendChild(imgToInsert);
    imgToInsert.style.display = "none"
}

function manageMusic(musicSrc) {
    try {
        music.pause()
        document.body.removeChild(music)
    } catch { }
    if(musicSrc !=="stop"){
        music = cargarSonido("/api/sound/music/" + musicSrc, true);
        song = musicSrc
        if (enableMusic !== "false" || !enableMusic) music.play()
    }
}

function manageMusicGroup(group){

    if (group.new){

        try {
            music.pause()
        } catch(e){}

        audioN = cargarSonido("/api/sound/music/" + group.nat, true)
        audioM = cargarSonido("/api/sound/music/" + group.mon, true)
        audioS = cargarSonido("/api/sound/music/" + group.say, true)
        audioY = cargarSonido("/api/sound/music/" + group.yu, true)
        audioNeutral = cargarSonido("/api/sound/music/" + group.neutral, true)
        myFeelings = cargarSonido("api/sound/music/my-feelings.mp3")

        audioNeutral.play()
    }
    else if(group === "n"){
        audioN.currentTime = audioNeutral.currentTime
        audioN.play();
        audioNeutral.muted = true;
        myFeelings.muted = true
    }
    else if (group === "s") {
        audioS.currentTime = audioNeutral.currentTime
        audioS.play();
        audioNeutral.muted = true;
        myFeelings.muted = true
    }
    else if (group === "y") {
        audioY.currentTime = audioNeutral.currentTime
        audioY.play();
        audioNeutral.muted = true;
        myFeelings.muted = true
    }
    else if (group === "m") {
        audioM.currentTime = audioNeutral.currentTime
        audioM.play();
        audioNeutral.muted = true;
        myFeelings.muted = true
    }
    else if (group === "neutral"){
        audioNeutral.muted = false;
        audioM.pause();
        audioY.pause();
        audioN.pause();
        audioS.pause();
    }
    else if (group ==="end"){
        music.play();
        try{
            document.body.removeChild(audioM)
            document.body.removeChild(audioN)
            document.body.removeChild(audioS)
            document.body.removeChild(audioY)
            document.body.removeChild(audioNeutral)
        }
        catch(e){}
    }
    else if (group === "my-feelings.mp3"){

        audioNeutral.muted = true;
        myFeelings.play()

    }
    else if (group === "my-feelings-end"){
        audioNeutral.muted = false
        myFeelings.pause()
        myFeelings.currentTime = 0
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
    if(objAnimation === "return"){
        char.style.left = "0%"
        char.style.top = "0%"
        char.style.height = "100%"  
        yuri.animation("height", "100%")
        yuri.animation("top", "0%")
        yuri.animation("left", "0%")

        natsuki.animation("height", "100%")
        natsuki.animation("top", "0%")
        natsuki.animation("left", "0%")

        monika.animation("height", "100%")
        monika.animation("top", "0%")
        monika.animation("left", "0%")

        sayori.animation("height", "100%")
        sayori.animation("top", "0%")
        sayori.animation("left", "0%")
    }
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
        else if (objAnimation.direction === "return"){
            char.style.left = "0%"
            char.style.top="0%"
            char.style.height ="100%"
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

        selectionOptions.Monika = objDialog.Monika.concat(objDialog.Monika[0][route]);

        if (sayScore < 30) selectionOptions.Sayori = objDialog.Sayori.dislike
        else if( sayScore >= 30 && sayScore < 45 ) selectionOptions.Sayori = objDialog.Sayori.like
        else selectionOptions.Sayori = objDialog.Sayori.love

       if(yuScore < 30) selectionOptions.Yuri = objDialog.Yuri.dislike;
       else if (yuScore >= 30 && yuScore < 45) selectionOptions.Yuri = objDialog.Yuri.like;
       else selectionOptions.Yuri = objDialog.Yuri.love

        if (natScore < 30) selectionOptions.Natsuki = objDialog.Natsuki.dislike;
        else if (natScore >= 30 && natScore < 45) selectionOptions.Natsuki = objDialog.Natsuki.like;
        else selectionOptions.Natsuki = objDialog.Natsuki.love;

        selectionOptions.Sayori = [...selectionOptions.Sayori, ...objDialog.Sayori.end]
        selectionOptions.Yuri = [...selectionOptions.Yuri, ...objDialog.Yuri.end]
        selectionOptions.Natsuki = [...selectionOptions.Natsuki, ...objDialog.Natsuki.end]
        selectionOptions.Monika = [...selectionOptions.Monika, ...objDialog.Monika[0].end]
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

        if(route === "natsuki") x.content = x.content.replace("#route", "Natsuki")
        else x.content = x.content.replace("#route", "Yuri")

        const charSelect = document.createElement("div");
        charSelect.classList.add("selection-btn", x.char)
        charSelect.innerHTML = x.content
        charSelect.addEventListener("mouseover",()=> hoverSound.play())
        charSelect.addEventListener("click",(e)=>{ 
            selectSound.play();
            mainScreen.removeChild(selectContainer)
            document.addEventListener("keydown", keyDownPress)
            arrDialog.splice(i,0,...selectionOptions[e.target.classList[1]])

            try {if (selectionMenu.length >= 4) arrDialog.splice(i, 0, ...selectionMenu.find(y => { return y.char === e.target.innerHTML }).message)} catch(e){}

            //fake click
            const event = new MouseEvent("click", {})
            mainScreen.dispatchEvent(event)
            //
            selectionMenu = selectionMenu.filter(filtered => filtered.char !== e.target.classList[1])
            choices.push(e.target.classList[1])
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

    let gameIndex = i;
    if ((chapter[3] == "4" || chapter[3] == "3") && changeSaveError) gameIndex = changeSaveError; 

    const objectToSave = {
        inScreenCharacters:[], 
        doki_currentGame: gameIndex,
        date: fullDate,
        chapter: chapter,
        choices:choices,
        route:route,
        addRoute: addRoute, 
        song:song, 
        img:currentImg, 
        background:currentBackground,
        score:[sayScore, natScore, yuScore],
        prevScore:[prevSScore, prevNScore, prevYScore]
    }
    
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
        }, 150)
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