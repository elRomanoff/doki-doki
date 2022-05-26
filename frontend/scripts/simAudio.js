export default class SimAudio{
    constructor(){
        this.ctx = new (AudioContext)
        this.audioBuffer = null
        this.source = null
        this.gainNode = null

        //i dont know why i need to put the methods in the constructor. if i put them inside the class but outside the constructor, they just dissapear
        
        this.mute = function(){
            this.gainNode.gain.value = "0";
        }
        this.unMute = function(){
            this.gainNode.gain.value = 1
        }
    }

}