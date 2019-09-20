
function onOpen(evt) {
    state.className = "success";
    state.innerHTML = "Connected to server";
    // 告訴server 我是主螢幕
}


function onMessage(evt) {
    // There are two types of messages:
    // 1. a chat participant message itself
    // 2. a message with a number of connected chat participants
    var data = JSON.parse(evt.data);
    console.log(data);
}

function onClose(evt) {
    state.className = "fail";
    state.innerHTML = "Not connected";
    connected.innerHTML = "0";
}

const slideplayer = document.querySelector('.slide-player');
const body = document.querySelector('body');
slideplayer.addEventListener('click', () => {
    playSlide();
    websocket.send(JSON.stringify({from:'main', event: 'playSlide'}));
}, false);

window.addEventListener('click', (e) => getClickPosition(e, body), false);


// const display = ({
//     page
// }) => {
//     switch (page) {
//         case '1':
//             break;
//         case '2':
//             break;
//         case '3':
//             break;
//         default:
//     }
//     console.log(page);
// };