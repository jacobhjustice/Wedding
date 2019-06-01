var wedding = wedding != undefined ? wedding : {};
wedding.controller = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    labels: {
        entry: "entry",
        rsvp: "rsvp",
        
    },
    load: function(id) {
        switch(id) {
            case this.labels.rsvp: 
                if(!this.isMobile) {
                    wedding.rsvp.showModal();
                } else {
                    wedding.rsvp.showPage();
                }
                break;
        }
    },
    determine: function(){

    }
};