"use strict";

var dataspan = document.getElementById("dataspan");;
var ws = {}; //new WebSocket(`ws://localhost:${wsport}`);
var linecount = 0;



const onSubmitClick = function() {
    dataspan.innerHTML = "";
    var inputs = document.querySelectorAll(".cb");
    var navrate = document.getElementById("navrate");
    var msg = { "navrate": navrate.value, "list": [] };
    for (var i = 0; i < inputs.length; i++) {   
        var key = inputs[i];
        msg["list"].push([key.id, key.checked]);   
    }
    ws.send(JSON.stringify(msg));
}

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        ws = new WebSocket(xhttp.responseText);
        ws.onopen = function() { onSubmitClick() }
        ws.onmessage = function(item) {
            dataspan.innerHTML += item.data + '\n\n' ;
            dataspan.scrollTop = dataspan.scrollHeight;
            linecount += 1; 
            if (linecount >= 400) {
                dataspan.textContent = "";
                linecount = 0;
            }
        };
    }
};
xhttp.open("GET", "/wsurl", true);
xhttp.send();
