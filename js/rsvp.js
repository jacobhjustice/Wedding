var wedding = wedding != undefined ? wedding : {};
wedding.rsvp = {
    templates: {
        mobile: {
            rsvpModal: `<div id="modalContent" class="mobile"></div>`,
            findInvitationView: 
                `<div class="searcher">
                    <div class="header">Enter your name in the box below to help us find your invitation</div>
                    <input id="invitationInput" />
                    <div class="btn" onclick="wedding.rsvp.findGuest(invitationInput);">Search</div>
                    <div class="btn error" onclick="wedding.controller.load(wedding.controller.labels.entry);">Return</div>
                </div>`,
            finalView:
                `<h2>You're all set.</h2><h3>%%%STRING%%%</h3><div class="btn error" onclick="wedding.controller.load(wedding.controller.labels.entry);">Return</div>`,
            guestRowSubmit:
                `<br/>
                <div class="btnWrapper">
                    <div class="btn error " onclick="wedding.rsvp.showPage();">Back</div>
                    <div class="btn" onclick="wedding.rsvp.submitStatuses();">Submit</div>
                </div>`,
        },
        desktop: {
            rsvpModal: 
                `<div id="rsvpWrapper">
                    <div id="rsvpDimmer" onclick="wedding.rsvp.closeRSVP();"></div> 
                    <div id="rsvpModal">
                        <div id="x" onclick="wedding.rsvp.closeRSVP();">&times;</div>
                        <div id="modalContent"></div>
                    </div>
                </div>`,
            findInvitationView: 
                `<div>
                    <div class="header">Enter your name in the box below to help us find your invitation</div>
                    <input id="invitationInput" />
                    <div class="btn" onclick="wedding.rsvp.findGuest(invitationInput);">Search</div>
                </div>`,
            finalView:
                `<h2>You're all set.</h2><h3>%%%STRING%%%</h3><div class="btn error" onclick="wedding.rsvp.closeRSVP();">Close</div>`,
            guestRowSubmit:
                `<br/>
                <div class="btnWrapper">
                    <div class="btn error " onclick="wedding.rsvp.displayParty();">Back</div>
                    <div class="btn" onclick="wedding.rsvp.submitStatuses();">Submit</div>
                </div>`,
        },
        shared: {
            divider: `<div class="divider"></div>`,
            emptyView: `<div class="modalAlertMessage header">Sorry, we could not find you on the list. Please make sure you have entered your name as seen on your invitation.</div><div class="btn error" onclick="wedding.rsvp.closeRSVP();wedding.controller.load(wedding.controller.labels.rsvp);">Back</div>`,
            partyRow: 
                `<div class="guestPartyRow row">
                    <div class="guestPartyContent cell">%%%partyHTML%%%</div>
                    <div class="guestPartyMe cell">
                        <div class="btn" id="rsvpMe" onclick="wedding.rsvp.guestPartyMe(%%%id%%%)">This is me!</div>
                    </div>
                </div>`,
            guestRow:
                `<div class="guest">
                    <div class="rsvp">%%%rsvpInfo%%%</div>
                    <div class="name">%%%name%%%</div>
                </div>`,
            guestRowEdit:
                `<div class="guestRSVP" data-id="%%%id%%%">
                    <div class="rsvpLabel">%%%name%%%'s RSVP Status: </div>
                    <div id="statuses%%%index%%%" class="radios">
                        <label><input type="radio" name="status%%%index%%%" value="Pending" %%%pendingCheck%%% > Undecided     </label>
                        <label><input type="radio" name="status%%%index%%%" value="Accept" %%%acceptCheck%%% > Attending     </label>
                        <label><input type="radio" name="status%%%index%%%" value="Decline" %%%declineCheck%%% > Unable to Attend     </label>
                    </div>
                </div>
                <br/>`,
            guestRowSubmit:
                `<br/>
                <div class="btnWrapper">
                    <div class="btn error " onclick="wedding.rsvp.displayParty();">Back</div>
                    <div class="btn" onclick="wedding.rsvp.submitStatuses();">Submit</div>
                </div>`,
        }
    },
    version: undefined,
    currentGuestParties: [],
    currentID: -1,
    showModal: function() {
        this.version = "desktop";
        var wrapper = document.createElement("div");
        wrapper.id = "rsvpDiv";
        wrapper.innerHTML = this.templates[this.version].rsvpModal;
        document.body.appendChild(wrapper);
        document.getElementById("modalContent").innerHTML = this.templates[this.version].findInvitationView;
    },

    showPage: function() {
        this.version = "mobile";
        var rsvpContent = document.getElementById("rsvpContent");
        if(rsvpContent == undefined) {
            rsvpContent = document.createElement("div");
            rsvpContent.id = "rsvp";
            rsvpContent.innerHTML = this.templates[this.version].rsvpModal;
            rsvpContent.classList.add("tabContent");
            document.body.appendChild(rsvpContent);
        }
        document.getElementById("modalContent").innerHTML = this.templates[this.version].findInvitationView;
    },
    // TODO make back button to search bar
    findGuest: function(input) {
        var self = this;
        var name = input.value;
        wedding.util.callServer("getGuests.php", function(data){
            self.currentGuestParties = wedding.guests.packageGuests(data);
            self.displayParty();
        }, ["NAME",  encodeURIComponent(name)]);
    },
    displayParty: function() {
        var parties = this.currentGuestParties
        var html = "";
        var wrapper = document.createElement("div");
        if (parties.length == 0 || parties[0] == undefined) {
            html += this.templates.shared.emptyView;
        } else {
            wrapper.classList.add("table"); 
            for(var i = 0; i < parties.length; i++) {
                if(i != 0) {
                    html += this.templates.shared.divider;
                }
                var partyHTML = "";
                for(var o = 0; o < parties[i].guests.length; o++) {
                    var guest = parties[i].guests[o];
                    partyHTML += wedding.util.formatString(this.templates.shared.guestRow, {
                        name: guest.name,
                        rsvpInfo: this.getRSVPInfo(guest.rsvp)
                    });
                }
                var obj = {
                    partyHTML: partyHTML,
                    id: parties[i].id
                };
                html += wedding.util.formatString(this.templates.shared.partyRow, obj);

            }
        }
        wrapper.innerHTML = html;
        element = document.getElementById("modalContent");
        if(this.version != "mobile") {
            element.innerHTML = "";

        }
        element.appendChild(wrapper);
    },
    closeRSVP: function() {
        document.body.removeChild(document.getElementById("rsvpDiv"));
    },
    guestPartyMe: function(id) {
        var party = this.currentGuestParties.find(function(test){
            return test.id == id;
        });
        var html = "";
        for(var i = 0; i < party.guests.length; i++) {
            var guest = party.guests[i];
            var obj = {
                name: guest.name,
                pendingCheck: guest.rsvp == "Pending" ? "checked" : "",
                acceptCheck: guest.rsvp == "Accept" ? "checked" : "",
                declineCheck: guest.rsvp == "Decline" ? "checked" : "",
                index: i,
                id: guest.id
            };
            html += wedding.util.formatString(this.templates.shared.guestRowEdit, obj);
        }
        this.currentID = party.id;
        html += this.templates[this.version].guestRowSubmit
        document.getElementById("modalContent").innerHTML = html;
    },
    submitStatuses: function(){
        var rows = document.getElementsByClassName("guestRSVP");
        var json = [];
        for(var i = 0; i < rows.length; i++) {
            var id = rows[i].dataset["id"];
            var rsvp = document.querySelector(`input[name="status` + i + `"]:checked`).value;

            json.push({
                ID: parseInt(id),
                RSVP: rsvp
            });
        }
        wedding.util.callServer("rsvpGuest.php", function(data){
            if(data == "SUCCESS") {
                document.getElementById("modalContent").innerHTML = wedding.util.formatString(
                    wedding.rsvp.templates[wedding.rsvp.version].finalView, {
                    STRING: wedding.rsvp.getFinishMessage(json[0].RSVP)
                });
            } else {
                // error
            }
        }, ["DATA", encodeURIComponent(JSON.stringify(json))]);
    },

    getFinishMessage: function(status) {
        switch(status) {
            case "Pending": 
                return "We await hearing back from you!";
            case "Decline":
                return "We wish you could make it!";
            case "Accept": 
                return "We can't wait to see you there!";
            default:
                return "";
        };
    },

    getRSVPInfo: function(status) {
        switch(status) {
            case "Pending": 
                return "Pending";
            case "Decline":
                return "Not Attending";
            case "Accept": 
                return "Attending";
            default:
                return "";
        };
    }
};