var ws = new WebSocket("ws://localhost:6060");
var linecount = 0;
//var selected = new Array();
var dataspan = document.getElementById("dataspan");

ws.onmessage = function(item) {
    var lines = dataspan.innerHTML;
    dataspan.innerHTML =  item.data + lines;
    //dataspan.scrollTop = ele.scrollHeight;
    linecount += 1; 
    if (linecount >= 400) {
        dataspan.textContent = "";
        linecount = 0;
    }
};

const onSubmitClick = function() {
    dataspan.innerHTML = "";
    var msg = {};
    var inputs = document.querySelectorAll(".cb");
    for (var i = 0; i < inputs.length; i++) {   
        var key = inputs[i];
        if (key.checked === true) {
            msg[key.id] = key.id;
        }   
    }   
    ws.send(JSON.stringify(msg));
}