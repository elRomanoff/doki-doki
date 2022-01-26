const config = {

    //music
    music: localStorage.getItem('doki_music'),
    setMusic: function(music){
        this.music = music
        localStorage.setItem("doki_music", music)
    },
    getMusic: function(){
        return localStorage.getItem("doki_music")
    },

    //textSpeed
    textSpeed: localStorage.getItem('doki_textSpeed'),
    setTextSpeed :function(speed){
        this.textSpeed = speed;
        localStorage.setItem("doki_textSpeed", speed)
    },
    getTextSpeed : function (){
        if(!this.textSpeed) this.textSpeed = 20
        return this.textSpeed;
    },

    //chapter 
    currentChapter: localStorage.getItem("doki_currentChapter"),
    setChapter: function(chapter) {
        this.currentChapter = chapter;
        localStorage.setItem("doki_currentChapter", chapter)
    },
    getChapter: function(){
        if(!this.currentChapter) this.currentChapter = "/start"
        return this.currentChapter;
    },


    //name 
    name: localStorage.getItem("doki_name"),
    setName: function (name){
        localStorage.setItem("doki_name", name)
    },
    getName: function(){
        let you = ""
        if (this.name) you = this.name;
        else {
            you = prompt("Insert your name");
            this.setName(you)
        }
        return you;
    },

    //Chapters 
    order: ["/Start","/Poem","/second-day/"],
}




export {config as config} 