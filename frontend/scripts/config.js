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
        if(!this.textSpeed) this.textSpeed = 22
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
        if(!this.inScreenCharacters || this.inScreenCharacters === "undefined") this.inScreenCharacters = '["char"]'
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
    //choices

    choices: localStorage.getItem("choices"),
    getChoices: function(){
        if(!this.choices || !this.choices.length || this.choices === "undefined") return []
        else return JSON.parse(this.choices)
    },
    setChoices: function(choices){localStorage.setItem("choices", JSON.stringify(choices))},

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

    setPrevScore: function (say, nat, yu) {
        localStorage.setItem("doki_prevSayoriScore", say)
        localStorage.setItem("doki_prevNatsukiScore", nat)
        localStorage.setItem("doki_prevYuriScore", yu)
    },
    getPrevScore: function () {
        return {
            prevSScore: localStorage.getItem("doki_prevSayoriScore"),
            prevNScore: localStorage.getItem("doki_prevNatsukiScore"),
            prevYScore: localStorage.getItem("doki_prevYuriScore")
        }
    },


    //newGame
    setNewGame: function(){
        this.setRoute("")
        this.setGameIndex(0)
        this.setChapter("")
        this.setScreenCharacters(["char"]);
        this.setAditionalRoute([])
        this.setExtra({}),
        this.setChoices([])
    },
    //loadGame
    setLoadGame: function(obj){
        this.setRoute(obj?.route)
        this.setGameIndex(obj?.doki_currentGame)
        this.setChapter(obj?.chapter)
        this.setAditionalRoute(obj?.aditionalRoute)
        this.setScreenCharacters(obj?.inScreenCharacters)
        this.setExtra(obj.song, obj.img, obj.background)
        if (Array.isArray(obj.score))this.setScore(obj?.score[0], obj?.score[1], obj?.score[2])
        else(this.setScore(0,0,0))

        if (Array.isArray(obj.prevScore)) this.setPrevScore(obj?.prevScore[0], obj?.prevScore[1], obj?.prevScore[2])
        else (this.setPrevScore(0,0,0))

        this.setChoices(obj?.choices)
    }

}




export {config as config} 