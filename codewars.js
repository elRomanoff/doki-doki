//Sábado, 31 de Julio
function accum(str){
    let fin = str[0].toUpperCase();
 //
    function pushMore(x,num){
        let cantidad = "-" + x.toUpperCase();
        for (let i = 1; i < num; i++) {
            cantidad += x.toLowerCase();
        }
        return cantidad
    }
//

    for (let i = 1; i < str.length; i++) {
        const element = str[i]
        let resul = pushMore(element, i+1)
        fin += resul;
    }
    return fin
}
//domingo 1 de agosto

function getMiddle(s) {
    let splitted = s.split('');
    if (splitted.length % 2 == 0) {

        return (splitted[(splitted.length / 2) - 1].concat(splitted[splitted.length / 2]))
    }
    else {
        return (splitted[Math.floor(splitted.length / 2)])
    }
}

//Martes 3 de Agosto

function solution(number){
    let res = 0;
    for (let index = 0; index < number; index++) {
        if(index % 3 == 0 || index % 5 == 0) res += index;
    }
    return res
}

//jueves 5 de Agosto

function list(names) {
    let resul = "";
    for (let i = 0; i < names.length; i++) {
        const element = names[i];
        resul += element.name;
        if(names[i+1] === undefined) return resul;
        else if(names[i+2] === undefined) resul += " & ";
        else resul += ", ";
    }
}
//martes 10 de agosto fua sera que estuve boludeando

function disemvowel(str){
    let newStr = "";
    let lowered = str.toLowerCase();
    for (let i = 0; i < str.length; i++) {
        if(lowered[i] === "a" || lowered[i] === "e" || lowered[i] === "i" || lowered[i] === "o" || lowered[i] === "u") continue;
        else newStr += str[i];
    }
    return newStr;
}

//miercoles 11 de Agosto

function isIsogram(str) {
    if(str === '' || str[1] === undefined)return true;
    let dictionary = {}
    let lowered = str.toLowerCase();
    for (let i = 0; i < lowered.length; i++) {
        if(dictionary[lowered[i]]) return false;
        else dictionary[lowered[i]] = true;
    }
    return true;
}

// 

