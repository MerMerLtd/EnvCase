let pin;
const renderPin = (parentEl, posX, posY) => {
    let num = document.querySelectorAll(".pin").length ? document.querySelectorAll(".pin").length : 0;
    const markup = `<div class="pin" id="pin${num}"></div>`;
    parentEl.insertAdjacentHTML("afterbegin", markup);
    pin = document.querySelector(`#pin${num}`);
    console.log(pin);
    pin.style.left = `${posX}px`;
    pin.style.top = `${posY}px`;
    console.log(`${posX}px`);
}

function getClickPosition(e, parentEl) {
    var posX = e.clientX;
    var posY = e.clientY;
    console.log(posX, posY, parentEl);
    renderPin(parentEl, posX, posY);
}