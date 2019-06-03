var wedding = wedding != undefined ? wedding : {};
wedding.controller = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    labels: {
        entry: "entry",
        rsvp: "rsvp",
        couple: "couple",
        trip: "trip",
    },
    load: function(id) {
        switch(id) {
            case this.labels.rsvp: 
                if(!this.isMobile) {
                    wedding.rsvp.showModal(this.isMobile);
                } else {
                    wedding.rsvp.showPage();
                    this.swapActiveView(id);
                }
                break;
            case this.labels.entry: 
            case this.labels.couple:
            case this.labels.trip:
                this.swapActiveView(id);
                break;
        }
    },
    swapActiveView: function(id) {
        [].forEach.call(document.getElementsByClassName("tabContent"), element => {
            element.style.display = "none";
        });
        document.getElementById(id).style.display = "block";
    }
};