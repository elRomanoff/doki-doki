function cargarSonido(fuente, loop) {
    console.log(fuente)
    const sonido = document.createElement("audio");
    sonido.src = fuente;
    sonido.setAttribute("preload", "auto");
    sonido.setAttribute("controls", "none");
    if(loop) sonido.setAttribute("loop", true);
    sonido.style.display = "none"; // <-- oculto
    document.body.appendChild(sonido);
    return sonido;
};

export {cargarSonido as cargarSonido};