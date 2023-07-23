"use strict";

var dataspan = document.getElementById("dataspan");
var chkboxes = document.querySelectorAll(".cb");
var pausebutton = document.getElementById("pause");
var ws = {}; 
var linecount = 0;
var paused = false;

const manageSelections = function() {
    dataspan.innerHTML = "";
    var navrate = document.getElementById("navrate");
    var msg = { "navrate": navrate.value, "list": [] };
    Array.prototype.forEach.call(chkboxes, function(chkbox) {   
        msg["list"].push([chkbox.id, chkbox.checked]);   
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
            if (!paused) {
                let message = JSON.parse(item.data);
                dataspan.innerHTML += message.payload + '\n\n' ;
                dataspan.scrollTop = dataspan.scrollHeight;
                linecount += 1; 
                if (linecount >= 400) {
                    dataspan.textContent = "";
                    linecount = 0;
                }
            }
        };
    }
}
xhttp.open("GET", "/wsurl", true);
xhttp.send();

const pause = function() {
    paused = !paused;
    if (paused) {
        pausebutton.innerHTML = "Resume"
    }
    else {
        pausebutton.innerHTML = "Pause"
    }
}