var ws = new WebSocket("ws://localhost:9090");
ws.onmessage = function(message) {
    var ele = document.getElementById("dataspan");
    ele.textContent = message.data;
};