var wedding = wedding != undefined ? wedding : {};
wedding.util = {
    callServer: function(file, callback, paramArray) {

        http = new XMLHttpRequest();
    
        http.onreadystatechange = function() {
            if (this.readyState == 4 && this.status < 500) {
                if (typeof callback == "function" && callback != undefined) {
                    callback(this.responseText);
                }
            }
        };
    
       var url = "../backend/" + file + "?t=1";
        if(paramArray != undefined) {
            for(var i = 0; i < paramArray.length - 1; i += 2) {
                url += "&" + paramArray[i] + "=" + paramArray [i+1];
            }
        }
    
        http.open("GET", url, true); 
        http.send();
    }
}