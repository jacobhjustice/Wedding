var wedding = wedding != undefined ? wedding : {};
wedding.entry = {
    WEDDING_TIME: new Date(Date.UTC(2019, 11, 21, 20, 30)),
    clockTick: function() {
        var now = new Date();
        var current = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        tick = document.getElementById("tick");
        var diff = this.WEDDING_TIME.getTime() - current;
        if(diff > 0) {
            var secs = Math.floor(diff / 1000);
            var mins = Math.floor(secs / 60);
            var hrs = Math.floor(mins / 60);
            var days = Math.floor(hrs / 24);
            var hrsLeft = hrs % (24*days);
            var minsLeft = mins % hrs;
            var secsLeft = secs % mins;
            str = days + " Days<br/>" + hrsLeft + " Hours<br/>" +  minsLeft + " Minutes<br/>" + secsLeft + " Seconds<br/>";
            tick.innerHTML = str;
        } else {
            diff = diff*-1;
            var secs = Math.floor(diff / 1000);
            var mins = Math.floor(secs / 60);
            var hrs = Math.floor(mins / 60);
            var days = Math.floor(hrs / 24);

            str = days +  " Days Ago <br/>";
            tick.innerHTML = str;

        }
        
        setTimeout(function(){
            wedding.entry.clockTick(); 
        }, 1000);
    }
}