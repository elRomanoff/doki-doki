const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs')

// game and directory routes
router.get("/Game", (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/juego.html'));
});
router.get("/poem", (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/poem.html'))
})
router.get("/happy", (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/happy.html'))
})
//poem words
router.get("/poem-words", async (req, res) =>{
    const textWords = fs.readFileSync(path.join(__dirname, "../database/poem-words.txt"), "utf-8");
    const arrWords = textWords.split(/\r?\n/)
    res.send({obj: arrWords})
})
//help file
router.get("/help", function(req, res){
    res.sendFile(path.join(__dirname, "../../frontend/help.html"))
})

//chapters
router.get("/start", (req, res) => {
    res.sendFile(path.join(__dirname, '../database/first-day.json'))
})
router.get("/day2", (req, res) => {
    res.sendFile(path.join(__dirname, '../database/day2.json'))
})
router.get("/day3", (req, res) => {
    res.sendFile(path.join(__dirname, '../database/day3.json'))
})
router.get("/day4",(req,res) => {
    res.sendFile(path.join(__dirname, '../database/day4.json'))
})
router.get("/finaln", (req, res) => {
    res.sendFile(path.join(__dirname, '../database/finaln.json'))
})
router.get("/finaly", (req, res) => {
    res.sendFile(path.join(__dirname, '../database/finaly.json'))
})

router.get("/final-daym", (req, res) => {
    res.sendFile(path.join(__dirname, '../database/final-daym.json'))
})
router.get("/final-days", (req, res) => {
    res.sendFile(path.join(__dirname, '../database/final-days.json'))
})

router.get("/day3/:char", (req, res) => {
    if (req.params.char === "sayori") {
        res.sendFile(path.join(__dirname, '../database/day3sayori.json'))
    }
    else if (req.params.char === "yuri") {
        res.sendFile(path.join(__dirname, '../database/day3yuri.json'))
    }
    else if (req.params.char === "natsuki") {
        res.sendFile(path.join(__dirname, '../database/day3natsuki.json'))
    }
})


router.get("/day2/:char", (req,res) =>{
    if(req.params.char === "sayori"){
        res.sendFile(path.join(__dirname, '../database/day2sayori.json'))
    }
    else if (req.params.char === "yuri"){
        res.sendFile(path.join(__dirname, '../database/day2yuri.json'))
    }
    else if (req.params.char === "natsuki") {
        res.sendFile(path.join(__dirname, '../database/day2natsuki.json'))
    }
})

router.get("/day4/:char", (req, res) => {
    if (req.params.char === "sayori") {
        res.sendFile(path.join(__dirname, '../database/day4sayori.json'))
    }
    else if (req.params.char === "yuri") {
        res.sendFile(path.join(__dirname, '../database/day4yuri.json'))
    }
    else if (req.params.char === "natsuki") {
        res.sendFile(path.join(__dirname, '../database/day4natsuki.json'))
    }
})



//media routes
        //sound routes
router.get("/api/sound/music/:file", (req, res) => {
    const { file } = req.params;
    res.sendFile(path.join(__dirname, '../musica/'+file))
})

        //hover and select routes
router.get("/api/sound/sfx/hover-sound", (req, res) => {
    res.sendFile(path.join(__dirname, '../musica/sfx/hover.ogg'))
})
router.get("/api/sound/sfx/select", (req,res) =>{
    res.sendFile(path.join(__dirname, '../musica/sfx/select.ogg'))
})


//img routes

router.get("/api/img/:img", (req, res) => {
    const { img } = req.params;
    res.sendFile(path.join(__dirname, '../img/' + img))
})
router.get("/api/img/bg/:img", (req, res) => {
    const { img } = req.params;
    res.sendFile(path.join(__dirname, '../img/bg/' + img))
})



//your name post
router.post('/tengoTuNombre', (req,res) => {
    console.log(req.body)
})

module.exports = router;