const renderPin = (parentEl, posX, posY) => {
    const markup = `<div class="pin"></div>`;
    parentEl.insertAdjacentHTML("afterbegin", markup);
    pin = document.querySelector(`.pin`);
    pin.style.left = `${posX}px`;
    pin.style.top = `${posY}px`;
}

function getClickPosition(e, parentEl) {
    var posX = e.clientX;
    var posY = e.clientY;
    console.log(posX, posY, parentEl);
    renderPin(parentEl, posX, posY);
}