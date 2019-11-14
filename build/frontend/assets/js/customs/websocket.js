
// Query DOM
let state = document.getElementById('status');
    var connected = document.getElementById("connected");
    var log = document.getElementById('log');

if (window.WebSocket === undefined) {
  state.innerHTML = 'sockets not supported';
  state.className = 'fail';
} else {
  if (typeof String.prototype.startsWith !== 'function') {
    String.prototype.startsWith = function (str) {
      return this.indexOf(str) == 0;
    };
  }
  window.addEventListener('load', onLoad, false);
}

function onLoad() {
  let wsUri = `ws://${location.hostname}`;
  websocket = new WebSocket(wsUri);
  websocket.onopen = function (evt) {
    onOpen(evt);
  };
  websocket.onclose = function (evt) {
    onClose(evt);
  };
  websocket.onmessage = function (evt) {
    onMessage(evt);
  };
  websocket.onerror = function (evt) {
    onError(evt);
  };
}

function onError(evt) {
  state.className = 'fail';
  state.innerHTML = 'Communication error';
}
