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
        if(!this.currentChapter || this.currentChapter === "undefined")  this.currentChapter = "/start"
        return this.currentChapter;
    },

    //game index
    currentGame: localStorage.getItem("doki_currentGame"),
    setGameIndex: function(index){
        this.currentGame = index;
        localStorage.setItem("doki_currentGame", index);
    },
    getGameIndex: function(){
        if(!this.currentGame) this.currentGame = 0;
        return this.currentGame
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
    
    //route
    currentRoute: localStorage.getItem("doki_currentRoute"),
    setRoute: function (route) {
        this.currentRoute = route;
        localStorage.setItem("doki_currentRoute", route)
    },
    getRoute: function () {
        if (!this.currentRoute || this.currentRoute === "undefined") this.currentRoute = ""
        return this.currentRoute;
    },

    //newGame
    setNewGame: function(){
        this.setRoute("")
        this.setGameIndex(0)
        this.setChapter("")
    },


    //Chapters 
    order: ["/Start","/Poem","/second-day/"],
}




export {config as config} 