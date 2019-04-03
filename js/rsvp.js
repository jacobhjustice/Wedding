var wedding = wedding != undefined ? wedding : {};
wedding.rsvp = {
    templates: {
        rsvpModal: 
            `<div id="rsvpWrapper">
                <div id="rsvpModal">
                    <div id="x" onclick="wedding.rsvp.closeRSVP();">&times;</div>
                    <div id="modalContent">
                        
                    </div>
                </div>
            </div>`,
        findInvitationView: 
            `<div>
                <div class="header">Enter your name in the box below to help us find your invitation</div>
                <input id="invitationInput" />
                <div class="btn" onclick="wedding.rsvp.findGuest(invitationInput);">Search</div>
            </div>`,
        divider: `<div class="divider"></div>`,
        partyRow: 
            `<div class="guestPartyRow row">
                <div class="guestPartyContent cell">%%%partyHTML%%%</div>
                <div class="guestPartyMe cell">
                    <div class="btn" id="rsvpMe" onclick="wedding.rsvp.guestPartyMe(%%%id%%%)">This is me!</div>
                </div>
            </div>`,
        guestRow:
            `<div class="guest">
                <div class="rsvp">%%%rsvp%%%</div>
                <div class="name">%%%name%%%</div>
            </div>`,
        guestRowEdit:
            `<div class="guestRSVP">
                <div class="rsvpLabel">%%%name%%%'s RSVP Status: </div>
                <label><input type="radio" name="status%%%index%%%" value="Pending" checked="%%%pendingCheck%%%"> Pending     </label>
                <label><input type="radio" name="status%%%index%%%" value="Accept" checked="%%%acceptCheck%%%"> Going     </label>
                <label><input type="radio" name="status%%%index%%%" value="Decline" checked="%%%declineCheck%%%"> Unable to Attend     </label>
            </div>`,
        guestRowSubmit:
            `<br/><br/>
            <div class="btn" id="submitRSVPStatuses">Submit</div>`
    },

    currentGuestParties: [],
    currentID: -1,
    showModal: function() {
        var wrapper = document.createElement("div");
        wrapper.id = "rsvpDiv";
        wrapper.innerHTML = this.templates.rsvpModal;
        document.body.appendChild(wrapper);
        document.getElementById("modalContent").innerHTML = this.templates.findInvitationView;
    },
    findGuest: function(input) {
        var self = this;
        var name = input.value;
        wedding.util.callServer("getGuests.php", function(data){
            var parties = wedding.guests.packageGuests(data);
            self.currentGuestParties = parties;
            var html = "";
            for(var i = 0; i < parties.length; i++) {
                if(i != 0) {
                    html += self.templates.divider;
                }
                var partyHTML = "";
                for(var o = 0; o < parties[i].guests.length; o++) {
                    partyHTML += wedding.util.formatString(self.templates.guestRow, parties[i].guests[o]);
                }
                var obj = {
                    partyHTML: partyHTML,
                    id: parties[i].id
                };
                html += wedding.util.formatString(self.templates.partyRow, obj);

            }
            var wrapper = document.createElement("div");
            wrapper.classList.add("table"); 
            wrapper.innerHTML = html;
            element = document.getElementById("modalContent");
            element.innerHTML = "";
            element.appendChild(wrapper);
        }, ["NAME",  encodeURIComponent(name)]);
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
                declineCheck: guest.rsvp == "Decline" ? "checked" : ""
            }
            html += wedding.util.formatString(this.templates.guestRowEdit, obj);
        }
        html += this.templates.guestRowSubmit
        document.getElementById("modalContent").innerHTML = html;
    }
};