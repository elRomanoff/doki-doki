

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
            let num = Math.round(Math.random() * 3)
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

let sayori = new Character("sayori",6000,"imagenes/sayori-sticker2.png");
let natsuki = new Character("natsuki", 5669,"imagenes/natsuki-sticker2.png");
let yuri = new Character("yuri",5105,"imagenes/yuri-sticker2.png");


setTimeout(() => sayori.createJumpInterval(), 7000)
natsuki.createJumpInterval();
setTimeout(() =>{
yuri.createJumpInterval()
},4000)

fetch("/poem-words")
    .then(res => res.json())
    .then(x => {console.log(x)})