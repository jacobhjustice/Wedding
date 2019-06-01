var wedding = wedding != undefined ? wedding : {};
wedding.admin = {
    templates: {
        memberTemplate: 
            `<div>
                <div class="divider"></div>
                <div class="member">
                    <label>Name<input type="text" class="name"/></label>
                </div>
                <div class="btn" id="removeMemberFromParty" onclick="wedding.admin.removeMemberFromParty(this.parentNode);">Remove Member</div>
            </div>`,
        guestAddress:
            `<div class="%%%stdClass%%% fill" onclick="wedding.admin.setSaveTheDate();">
                <div class="addrContent">
                    <div class="name">%%%name%%%</div>
                    <div class="street">%%%street%%%</div>
                    <div class="zip">%%%zip%%%</div>
                </div>
                <div class="stdInfo">%%%stdStr%%%</div>
            </div>`
    },      
    analytics: {
        guests: 0,
        parties: 0,
        stdSent: 0,
        attending: 0,
        pending: 0,
        reject: 0
    },

    currentGuest: 0,  

    addMemberToParty: function(form) {
        form.getElementsByClassName("success")[0].style.display = "none";
        form.getElementsByClassName("error")[0].style.display = "none";
        var wrapper = document.createElement("div");
        wrapper.innerHTML = this.templates.memberTemplate;
        document.getElementById("members").appendChild(wrapper)
    },

    removeMemberFromParty: function(wrapper) {
        document.getElementsByClassName("success")[0].style.display = "none";
        document.getElementsByClassName("error")[0].style.display = "none";
        wrapper.parentElement.removeChild(wrapper);
    },

    submitParty: function(form) {
        var members = form.getElementsByClassName("member");
        form.getElementsByClassName("success")[0].style.display = "none";
        form.getElementsByClassName("error")[0].style.display = "none";
        var json = [];
        for(var i = 0; i < members.length; i++) {
            var mem = members[i];
            var name = mem.getElementsByClassName("name")[0].value;
            var addy = i == 0 ? mem.getElementsByClassName("address")[0].value : " ";

            if(name == "" || addy == "") {
                form.getElementsByClassName("error")[0].style.display = "block";
                return;
            }
            json.push({
                NAME: name,
                ADDRESS: addy,
            });
        }
        wedding.util.callServer("addUser.php", function(data){
            if(data.indexOf("ERROR") == -1) {
                form.getElementsByClassName("success")[0].style.display = "block";
                var inputs = form.getElementsByTagName("input");
                for(var i = 0; i < inputs.length; i++) {
                    inputs[i].value = "";
                }
            }
        }, ["DATA", encodeURIComponent(JSON.stringify(json))]);
    },

    onLoad: function() {
        wedding.guests.getGuests(function(data){
            wedding.admin.buildAddressCard();
            wedding.admin.buildAnalyticDetails();
        });
    },

    cycleGuest: function(i) {
        this.currentGuest = (this.currentGuest + i) % wedding.guests.partyList.length;
        if(this.currentGuest == -1) {
            this.currentGuest = wedding.guests.partyList.length - 1;
        }
        this.buildAddressCard();
    },

    buildAddressCard: function() {
        // todo, loading screen when wedding.guests.partyList = []
        if (wedding.guests != undefined) {
            var party = wedding.guests.partyList[wedding.admin.currentGuest];
            var names = party.guests.map(g => g.name);
            var name = names.join(" & ");
            var addr = party.address.split(";");

            var stdStr = !party.isSaveTheDateSent ? "Click to mark save the date as written/sent" : "Click to mark save the date as unfinished"
            var stdClass = party.isSaveTheDateSent ? "stdSent" : "stdPending"

            var obj = {
                name: name,
                street: addr[0],
                zip: addr.length > 1 ? addr[1] : "",
                stdStr: stdStr,
                stdClass: stdClass
            };

            document.getElementById("invitationFormContent").innerHTML = 
                wedding.util.formatString(wedding.admin.templates.guestAddress, obj);

        }
    },
    
    setSaveTheDate: function(element) {
        var isSentNewStatus = !wedding.guests.partyList[wedding.admin.currentGuest].isSaveTheDateSent;
        wedding.guests.partyList[wedding.admin.currentGuest].isSaveTheDateSent = isSentNewStatus;
        var id = wedding.guests.partyList[wedding.admin.currentGuest].id;

        this.buildAddressCard();
        wedding.util.callServer("updateSent.php", function(data){}, ["SENT", isSentNewStatus, "ID", id]);
    },

    buildAnalyticDetails: function() {
        var a = wedding.admin.analytics;
        a.parties = 0;
        a.pending = 0;
        a.reject = 0;
        a.attending = 0;
        a.guests = 0;
        a.stdSent = 0;

        wedding.guests.partyList.forEach(function(party){
            a.parties++;
            if(party.isSaveTheDateSent) {
                a.stdSent++;
            }
            party.guests.forEach(function(guest){
                a.guests++;
                switch(guest.rsvp) {
                    case "Pending":
                        a.pending++;
                        break;
                    case "Accept":
                        a.attending++;
                        break;
                    case "Decline":
                        a.reject++;
                        break;
                }
            })
        })
        document.getElementById("guestData").innerHTML = a.guests;
        document.getElementById("partyData").innerHTML = a.parties;
        document.getElementById("stdSentData").innerHTML = a.stdSent;
        document.getElementById("attendingData").innerHTML = a.attending;
        document.getElementById("pendingData").innerHTML = a.pending;
        document.getElementById("rejectData").innerHTML = a.reject;
    }
};