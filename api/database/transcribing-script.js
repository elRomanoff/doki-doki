const { json } = require('body-parser');
const fs = require('fs');

const rawText = fs.readFileSync( __dirname + "/.txt", "utf-8")

const rawArray = (rawText.split("\n"))




const arr = rawArray.map(x =>{
    const rawObj = {}
    if(x[0] === "m" && x[1] === "c") {
        rawObj.char = "you";  
        x = x.slice(0, -1); 
        x = x.split(`"`);
    }    
    else if (x[0] === "m"){
        rawObj.char = "Monika";   
        x = x.slice(0, -1); 
        x =x.split(`"`);
    }
    else if (x[0] === "s") {
        rawObj.char = "Sayori";  
        x = x.slice(0, -1);
        x = x.split(`"`);

    }
    else if (x[0] === "n") {
        rawObj.char = "Natsuki";
        x = x.slice(0, -1);
        x =x.split(`"`)
    }
    else if (x[0] === "y") {
        rawObj.char = "Yuri";  
        x = x.slice(0, -1);       
        x = x.split(`"`); 
    }
    else if (x[0] === `"`){
        rawObj.content = x;
        return rawObj;
    }

    if(x.includes("[Player]")) x.replace("[Player]", "#var")
    
    rawObj.content = x[1]

    return rawObj
})

fs.writeFileSync(__dirname + "./algo.json", JSON.stringify(arr))
