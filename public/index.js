"use strict";

var dataspan = document.getElementById("dataspan");;
var ws = {}; 
var linecount = 0;

let combos = document.querySelectorAll(".cb");

const manageSelections = function() {
    dataspan.innerHTML = "";
    var navrate = document.getElementById("navrate");
    var msg = { "navrate": navrate.value, "list": [] };
    Array.prototype.forEach.call(combos, function(combo) {   
        msg["list"].push([combo.id, combo.checked]);   
    });
    ws.send(JSON.stringify(msg));
}

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        ws = new WebSocket(xhttp.responseText);
        ws.onopen = function() { 
            manageSelections();            
        }
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