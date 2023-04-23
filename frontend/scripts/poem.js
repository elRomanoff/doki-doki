import { cargarSonido } from "/scripts/cargarSonido.js"
import { config } from "/scripts/config.js"

const hoverSound = cargarSonido("/api/sound/sfx/hover-sound");
const selectSound = cargarSonido("/api/sound/sfx/select");
const music = cargarSonido("/api/sound/music/dreams.mp3");
const enableMusic = config.getMusic()
const prevScore = config.getScore();

console.log(prevScore)

const screen = document.querySelector(".screen")
const poemAlert = document.createElement("div")
poemAlert.classList.add("alert-btn")
poemAlert.innerHTML = `<p>Time to write a poem!</p> Pick words you think your favorite club member will like. Something good might happen with whoever likes your poem the most! <p class="ok ho">OK</p>`
screen.appendChild(poemAlert)
const ok = document.querySelector(".ok")

ok.addEventListener("mouseover",()=>{
    hoverSound.play();
})

ok.addEventListener("click", () => {
    selectSound.play();
    if(enableMusic || enableMusic === null) {
        music.play()
    }
    screen.removeChild(poemAlert)
})





const columna1 = document.querySelector(".c1")
const columna2 = document.querySelector(".c2")
const count = document.getElementById("count")

let index = 0;

class Character{
    constructor(charName,time,img2){
        this.char = document.getElementById(`${charName}`);
        this.char.style.left = "0%";
        this.char.style.top = "0%";
        this.left = 0;
        this.top = 0;
        this.direction = "right";
        this.time = time;
        this.src = this.char.src;
        this.img2 = img2;
        this.randomJump = null;
        this.score = 0;
    }
    jumpRight(){
        if (this.direction !== "right") {
            this.direction = "right";
            this.char.classList.toggle("look-left")
        }
        let goUp = setInterval(()=>{
            if(this.top !== -13){
                this.char.style.top = this.top + "%";
                this.char.style.left = this.left + "%";
                this.top--;
                this.left = this.left - 0.5;
            }
            else{
                clearInterval(goUp)
                this.fallRight()
            }
        },10)
    }
    fallRight(){
        let goDown = setInterval(()=>{
            if(this.top != 0){
                this.char.style.top = this.top + "%";
                this.char.style.left = this.left + "%";
                this.top++;
                this.left = this.left - 0.5;
            }else{
                clearInterval(goDown);
            }
        },10)
    }

    jumpLeft(){
        if(this.direction !== "left"){
            this.direction = "left";
            this.char.classList.toggle("look-left")
        }
        let goUp = setInterval(() => {
            if (this.top !== -13) {
                this.char.style.top = this.top + "%";
                this.char.style.left = this.left + "%";
                this.top--;
                this.left = this.left + 0.5;
            }
            else {
                clearInterval(goUp)
                this.fallLeft()
            }
        }, 10)
    }
    fallLeft() {
        let goDown = setInterval(() => {
            if (this.top != 0) {
                this.char.style.top = this.top + "%";
                this.char.style.left = this.left + "%";
                this.top++;
                this.left = this.left + 0.5;
            } else {
                clearInterval(goDown);
            }
        }, 10)
    }

    jump(){
        this.goUp = setInterval(() => {
            if (this.top !== -13) {
                this.char.style.top = this.top + "%";
                this.top--;
            }
            else {
                clearInterval(this.goUp)
                this.fall()
            }
        }, 10)
    }
    fall() {
        let goDown = setInterval(() => {
            if (this.top != 0) {
                this.char.style.top = this.top + "%";
                this.top++;
            } else {
                clearInterval(goDown);
                
            }
        }, 10)
    }

    createJumpInterval(){
        this.randomJump = setInterval(() => {
            let num = Math.round(Math.random() * 4)
            if (num === 0) this.jump();
            else if (num === 1) this.jumpLeft();
            else if (num === 2) this.jumpRight();
        }, this.time)
    }
    removeJumpInterval(){
        clearInterval(this.randomJump)
    }

    jumpHappy(){
        this.removeJumpInterval();
        this.char.classList.add("jumping");
        this.char.src = this.img2;
        setTimeout(() =>{
            this.createJumpInterval();
            this.char.classList.remove("jumping");
            this.char.src = this.src
        },750)
    }
    resetAll(){
        this.removeJumpInterval();
        this.top = 0;
        this.left = 0;
        this.char.style.left = "0%";
        this.char.style.top = "0%";
    }
}

let sayori = new Character("sayori",9000,"imagenes/sayori-sticker2.png");
let natsuki = new Character("natsuki", 9000,"imagenes/natsuki-sticker2.png");
let yuri = new Character("yuri",8000,"imagenes/yuri-sticker2.png");


setTimeout(() => sayori.createJumpInterval(), 7000)
natsuki.createJumpInterval();
setTimeout(() =>{
yuri.createJumpInterval()
},4000)


fetch("/poem-words")
    .then(res => res.json())
    .then(x => {
        let tenWords = []
        function createArrWords(){
            tenWords = []
            for (let i = 0; i < 10; i++) {
                let wordString = x.obj[Math.floor(Math.random() * (x.obj.length))]
                tenWords.push(wordString.split(","))
            }
        }

        function printWords() {
            index++
            count.innerHTML = `${index}/20`
            createArrWords();
            columna1.innerHTML = "";
            columna2.innerHTML = "";
            
            for (let i = 0; i < 5; i++) {
                columna1.innerHTML += `<p id="${i}">${tenWords[i][0]}</p>`;
            }
            for(let i = 5; i < 10; i++){
                columna2.innerHTML += `<p id="${i}"> ${ tenWords[i][0] }</p>`
            }
        }
        printWords()

        columna1.addEventListener("click", (e) => clickWord(e))
        columna2.addEventListener("click",(e)=> clickWord(e))
            


        function clickWord(e){
            if(index > 19){
                columna2.removeEventListener("click", clickWord)
                columna1.removeEventListener("click", clickWord);

                if(sayori.score > yuri.score && sayori.score > natsuki.score) openNext("sayori")
                else if (natsuki.score > yuri.score && natsuki.score > sayori.score) openNext("natsuki")
                else if (yuri.score > natsuki.score && yuri.score > sayori.score) openNext("yuri")

                return;
            }


            if (!e.target.id) return
            selectSound.play();

            sayori.score += parseInt(tenWords[e.target.id][1]);
            natsuki.score += parseInt(tenWords[e.target.id][2]);
            yuri.score += parseInt(tenWords[e.target.id][3]);
            
            console.log("Sayori: " + sayori.score+ ". Natsuki: " + natsuki.score + ". Yuri: " + yuri.score)

            if (tenWords[e.target.id][1] == 3) {
                sayori.jumpHappy();
            }
            else if (tenWords[e.target.id][2] == 3) {
                natsuki.jumpHappy();
            }
            else if (tenWords[e.target.id][3] == 3) {
                yuri.jumpHappy();
            }

            printWords()
        }

        
        


    })

const resize = () => {
    if (screen.height < 720) {
        mainScreen.style.height = screen.height + "px";
        let auxWidth = (screen.height * 1280) / 720
        mainScreen.style.width = auxWidth + "px";
        mainScreen.style.fontSize = (auxWidth * 26 / 1280) + "px"
    }
}

function openNext(character){
    config.setPrevScore(prevScore?.sayScore, prevScore?.natScore, prevScore?.yuScore)
    config.setRoute(character);
    config.setScore(sayori.score, natsuki.score, yuri.score)
    config.setAditionalRoute([]),
    config.setScreenCharacters([])
    window.open("/Game", "_self")
}

window.addEventListener('resize', resize);

resize();


