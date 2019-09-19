
// Query DOM
var state = document.getElementById("status"),
    connected = document.getElementById("connected"),
    log = document.getElementById("log");

if (window.WebSocket === undefined) {
    state.innerHTML = "sockets not supported";
    state.className = "fail";
} else {
    if (typeof String.prototype.startsWith != "function") {
        String.prototype.startsWith = function (str) {
            return this.indexOf(str) == 0;
        };
    }
    window.addEventListener("load", onLoad, false);
}

function onLoad() {
    var wsUri = "ws://127.0.0.1:80";
    websocket = new WebSocket(wsUri);
    websocket.onopen = function (evt) {
        onOpen(evt)
    };
    websocket.onclose = function (evt) {
        onClose(evt)
    };
    websocket.onmessage = function (evt) {
        onMessage(evt)
    };
    websocket.onerror = function (evt) {
        onError(evt)
    };
}

function onError(evt) {
    state.className = "fail";
    state.innerHTML = "Communication error";
}




