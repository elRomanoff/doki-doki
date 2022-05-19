const config = {

    //music
    music: localStorage.getItem('doki_music'),
    setMusic: function(music){
        this.music = music
        localStorage.setItem("doki_music", music)
    },
    getMusic: function(){
        return localStorage.getItem("doki_music")
        console.log(music)
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
        if(!this.currentChapter || this.currentChapter === "undefined")  this.currentChapter = "start"
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
    //in screen characters
    inScreenCharacters: localStorage.getItem("doki_inScreenCharacters"),
    setScreenCharacters: function(characters) {
        localStorage.setItem("doki_inScreenCharacters", JSON.stringify(characters))
    },
    getScreenCharacters: function(){
        if(!this.inScreenCharacters) this.inScreenCharacters = '["char"]'
        return JSON.parse(this.inScreenCharacters);
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
    //aditional routes
    aditionalRoutes: localStorage.getItem("doki_aditionalRoutes"),
    setAditionalRoute: function (add) {
        this.aditionalRoutes = add
        localStorage.setItem("doki_aditionalRoutes", JSON.stringify(add))
    },
    getAditionalRoute: function(){
        if(!this.aditionalRoute) this.aditionalRoute = [];
        return this.aditionalRoute;
    },
    //extra
    setExtra: function(song, img, background){
        localStorage.setItem("currentSong", song)
        localStorage.setItem("charImg", img)
        localStorage.setItem("background", background)
    },
    getExtra: function(){
        return{
            song: localStorage.getItem("currentSong"),
            currentImg: localStorage.getItem("charImg"),
            currentBackground: localStorage.getItem("background")
        }
    },
    //poem scores
    setScore: function(say, nat, yu){
        localStorage.setItem("doki_currentSayoriScore", say)
        localStorage.setItem("doki_currentNatsukiScore", nat)
        localStorage.setItem("doki_currentYuriScore", yu)
    },
    getScore: function(){
        return {
            sayScore: localStorage.getItem("doki_currentSayoriScore"),
            natScore: localStorage.getItem("doki_currentNatsukiScore"),
            yuScore: localStorage.getItem("doki_currentYuriScore")
        }
    },
    //newGame
    setNewGame: function(){
        this.setRoute("")
        this.setGameIndex(0)
        this.setChapter("")
        this.setScreenCharacters(["char"]);
        this.setAditionalRoute([])
        this.setExtra({})
    },
    //loadGame
    setLoadGame: function(obj){
        this.setRoute(obj?.route)
        this.setGameIndex(obj?.doki_currentGame)
        this.setChapter(obj?.chapter)
        this.setAditionalRoute(obj?.aditionalRoute)
        this.setScreenCharacters(obj?.inScreenCharacters)
        this.setExtra(obj.song, obj.img, obj.currentBackground)
    }

}




export {config as config} 