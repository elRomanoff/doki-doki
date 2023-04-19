const { json } = require('body-parser');
const fs = require('fs');

const rawText = fs.readFileSync( __dirname + "/transc.txt", "utf-8")

const rawArray = (rawText.split("\n"))




const arr = rawArray.map(x =>{
    const rawObj = {}
    if ((x[0] === "s" && x[1] === "h" && x[2] === "o") || (x[0] === "h" && x[1] === "i" && x[2] === "d") || (x[0] === "p" && x[1] === "l" && x[2] === "a")){
        return
    }
    else if(x[0] === "m" && x[1] === "c") {
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

const bestArr = arr.filter(x => x != null)

try{
    fs.writeFileSync("./algo.json", JSON.stringify(bestArr))
}
catch(e){
    console.log(e)
}
