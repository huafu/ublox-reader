var ws = new WebSocket("ws://localhost:6060");
ws.onmessage = function(message) {
    var ele = document.getElementById("dataspan");
    ele.textContent = message.data;
};