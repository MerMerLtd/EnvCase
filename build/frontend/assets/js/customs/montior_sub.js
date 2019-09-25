function onOpen(evt) {
    state.className = "success";
    state.innerHTML = "Connected to server";
    // 告訴server 我是副螢幕
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
    console.log(data);
    switch (data.event) {
        case 'playSlide':
            playSlide();
            break;
        case 'changePage':
            display(data.currentPage, 'sub');
            break;
        case 'changeImage':
            const imgContainer = document.querySelector('.slide-wrap img');
            if (htmlAssets[`sub_${parseInt(data.index)+1}`])
                imgContainer.src = htmlAssets[`sub_${parseInt(data.index)+1}`];
            break;
        default:

    }

}