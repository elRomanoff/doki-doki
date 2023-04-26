window.oncontextmenu = function () {
    remove();
    return false
}

const charName = document.getElementById("char-name");
const textBackground = document.querySelector(".text-background");
const textBox = document.getElementById("text-box");

export default function remove() {
    charName.classList.toggle("none");
    textBackground.classList.toggle("none");
    textBox.classList.toggle("none");
}