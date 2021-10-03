const express = require('express');
const app = express();
const path = require('path');

//para que lea los post lpm

//settings
app.use(express.static('./frontend'));
app.set("port", 80);



//routes
app.use(require('./routes/index'))

//starting the server
app.listen(80, function () {
    console.log('listening on 80')
})

