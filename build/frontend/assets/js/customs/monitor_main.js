

function onOpen(evt) {
    state.className = "success";
    state.innerHTML = "Connected to server";
    // 告訴server 我是主螢幕
}

function onClose(evt) {
    state.className = "fail";
    state.innerHTML = "Not connected";
    // connected.innerHTML = "0";
}

function onMessage(evt) {
    // There are two types of messages:
    // 1. a chat participant message itself
    // 2. a message with a number of connected chat participants
    var data = JSON.parse(evt.data);
    if (data.event === 'changePage') {
        display(data.currentPage, 'main');
    }
    if (data.event === 'changeImage') {
        const imgContainer = document.querySelector('.slide-wrap img');
        if (window.location.href.split('/').pop() === 'index.html') {
            imgContainer.src = imgContainer.src.replace(`main-${data.index}`, `main-${parseInt(data.index) + 1}`);
        } else {
            // console.log(htmlAssets[`main_${parseInt(data.index)+1}`]);
            imgContainer.src = htmlAssets[`main_${parseInt(data.index)+1}`];
        }
    }
    console.log(data);
}



const slideplayer = document.querySelector('.slide-player');
const positioning = document.querySelector('.positioning');

slideplayer.addEventListener('click', () => {
    if (window.location.href.split('/').pop() === 'slider-main.html') {
        playSlide();
        websocket.send(JSON.stringify({
            event: 'playSlide'
        }));
    } else {
        // 要在按一次play才會play
        websocket.send(JSON.stringify({
            event: 'changePage',
            currentPage: 'index.html',
        }));
    }
}, false);

positioning.addEventListener('click', (evt) => {
    const slideWrap = document.querySelector('.slide-wrap');
    // console.log(slideWrap.dataset.length, slideWrap.dataset.index);
    // console.log(slideWrap.dataset.length > 1);
    // console.log(parseInt(slideWrap.dataset.index) < slideWrap.dataset.length);
    if (slideWrap.dataset.length > 1 && parseInt(slideWrap.dataset.index) < slideWrap.dataset.length) {
        websocket.send(JSON.stringify({
            event: 'changeImage',
            index: slideWrap.dataset.index,
        }));
        slideWrap.dataset.index = parseInt(slideWrap.dataset.index) + 1;
    } else {
        websocket.send(JSON.stringify({
            event: 'changePage',
            // currentPage: window.location.href,
            currentPage: window.location.href.split('/').pop(),
        }));
        display(window.location.href.split('/').pop(), 'main');
    }
}, false);


// window.addEventListener('click', (e) => getClickPosition(e, positioning), false);
// window.addEventListener('click', (e) => router.routes.find(route => route.uri === "/slider-main").callback(), false);