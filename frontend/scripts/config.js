const config = {
    music: localStorage.getItem('music'),
    textSpeed: localStorage.getItem('textSpeed'),
    setMusic: function(music){
        config.music = music
        localStorage.setItem("music", music)
    },
    setTextSpeed: function(speed){
        config.textSpeed = speed;
        localStorage.setItem("textSpeed", speed)
    }
}



export {config as config} 