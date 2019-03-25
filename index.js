wedding = {
    WEDDING_TIME: new Date('December 21, 2019 16:00:00'),
    entry: {
        clockTick: function() {
            var current = new Date();
            tick = document.getElementById("tick");
            var diff = wedding.WEDDING_TIME.getTime() - current.getTime();
            var secs = Math.floor(diff / 1000);
            var mins = Math.floor(secs / 60);
            var hrs = Math.floor(mins / 60);
            var days = Math.floor(hrs / 24);
            var hrsLeft = hrs % days;
            var minsLeft = mins % hrs;
            var secsLeft = secs % mins;
            str = days + " Days<br/>" + hrsLeft + " Hours<br/>" +  minsLeft + " Minutes<br/>" + secsLeft + " Seconds<br/>"
            tick.innerHTML = str;
            setTimeout(function(){
                wedding.entry.clockTick(); 
            }, 1000)
        }
    },

    util: {
        callServer: function(func, callback, paramArray) {

            http = new XMLHttpRequest();
        
            http.onreadystatechange = function() {
                if (this.readyState == 4 && this.status < 500) {
                    if (typeof callback == "function" && callback != undefined) {
                        callback(this.responseText);
                    }
                }
            };
        
           // var url = "server_requests.php"?FUNCTION=" + func";
           var url = "backend/addUser.php?t=1";
            if(paramArray != undefined) {
                for(var i = 0; i < paramArray.length - 1; i += 2) {
                    url += "&" + paramArray[i] + "=" + paramArray [i+1];
                }
            }
        
            http.open("GET", url, true); 
            http.send();
        },
    }
}