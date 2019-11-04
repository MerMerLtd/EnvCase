function onOpen(evt) {
    state.className = "success";
    state.innerHTML = "Connected to server";
}

function onClose(evt) {
    state.className = "fail";
    state.innerHTML = "Not connected";
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