var wedding = wedding != undefined ? wedding : {};
wedding.controller = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    labels: {
        entry: "entry",
        rsvp: "rsvp",
        couple: "couple",
        trip: "trip",
        registry: "registry"
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
                window.location.hash = id;
                break;
            case this.labels.entry: 
            case this.labels.couple:
            case this.labels.trip:
            case this.labels.registry:
                window.location.hash = id;
                this.swapActiveView(id);
                break;
        }
    },
    swapActiveView: function(id) {
        [].forEach.call(document.getElementsByClassName("tabContent"), element => {
            element.style.display = "none";
        });
        document.getElementById(id).style.display = "block";
    },
    onLoad: function() {
        var hash = window.location.hash;
        if(hash.length > 1) {
            hash = hash.substring(1)
        }
        switch(hash) {
            case this.labels.registry:
            case this.labels.rsvp:
            case this.labels.couple:
            case this.labels.entry:
            case this.labels.trip:
                this.load(hash);
                break;
            default:
                this.load(this.labels.entry);
        }
    }
};