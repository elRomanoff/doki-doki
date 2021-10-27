const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs')

// game and directory routes
router.get("/newGame", (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/juego.html'));
});
router.get("/poem", (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/poem.html'))
})
//poem words
router.get("/poem-words", async (req, res) =>{
    const textWords = fs.readFileSync(path.join(__dirname, "../database/poem-words.txt"), "utf-8");
    const arrWords = textWords.slice("\r\n")

    res.send({obj: textWords})
})

//provisory
router.get("/start", (req, res) => {
    res.sendFile(path.join(__dirname, '../database/modulo1.json'))
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
        //background routes
router.get("/api/img/background/:img", (req, res) =>{
    const { img } = req.params;
    res.sendFile(path.join(__dirname, '../imagenes/fondos/' + img))
})

        //sayori routes
router.get("/api/img/sayori/:img", (req, res) => {
    const { img } = req.params;
    res.sendFile(path.join(__dirname, '../imagenes/sayori/school/' + img))
})
        //yuri routes
router.get("/api/img/yuri/:img", (req, res) => {
    const { img } = req.params;
    res.sendFile(path.join(__dirname, '../imagenes/yuri/' + img))
})
        //Natsuki routes
router.get("/api/img/natsuki/:img", (req, res) => {
    const { img } = req.params;
    res.sendFile(path.join(__dirname, '../imagenes/natsuki/' + img))
})
        //Monika routes 
router.get("/api/img/monika/:img",(req, res)=>{
    const { img } = req.params;
    res.sendFile(path.join(__dirname, '../imagenes/monika/' + img))
})




//your name post
router.post('/tengoTuNombre', (req,res) => {
    console.log(req.body)
})

module.exports = router;