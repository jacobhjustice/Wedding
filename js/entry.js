var wedding = wedding != undefined ? wedding : {};
wedding.entry = {
    WEDDING_TIME: new Date('December 21, 2019 16:00:00'),
    clockTick: function() {
        var current = new Date();
        tick = document.getElementById("tick");
        var diff = this.WEDDING_TIME.getTime() - current.getTime();
        if(diff > 0) {
            var secs = Math.floor(diff / 1000);
            var mins = Math.floor(secs / 60);
            var hrs = Math.floor(mins / 60);
            var days = Math.floor(hrs / 24);
            var hrsLeft = hrs % days;
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