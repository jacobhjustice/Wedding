var wedding = wedding != undefined ? wedding : {};
wedding.guests = {
    templates: {
        guestTableTemplate: 
            `<div id="guestTableWrapper">
                <div class="table" id="guestTable">
                </div>
            </div>`,
        guestRowTemplate:
            `<div class="row" data-name="%%%name%%%" data-rsvp="%%%rsvp%%%" data-id="%%%id%%%">
                <div class="cell name %%%secondaryClass%%%">%%%name%%%</div>
                <div class="cell status %%%secondaryClass%%%">%%%rsvp%%%</div>
            </div>`,
    },
    partyList: [],
    guestParty: function(primaryGuest, address, isSaveTheDateSent, diet) {
        this.id = primaryGuest.id;
        this.guests = [primaryGuest];
        this.address = address;
        this.isSaveTheDateSent = isSaveTheDateSent;
        this.diet = diet
    },
    guest: function(id, name, rsvp, isPrimary) {
        this.id = id;
        this.name = name;
        this.rsvp = rsvp;
        this.isPrimary = isPrimary;
    },
    getGuests: function(cb) {
        var self = this;
        wedding.util.callServer("getGuests.php", function(data){
            partyList = self.packageGuests(data);
            self.partyList = partyList;
            if(cb != null) {
                cb(partyList)
            }
        });
    },
    packageGuests: function(data) {
        var guests = JSON.parse(data);
        var partyList = [];
        var curParty;
        for(var i = 0; i < guests.length; i++) {
            var name = guests[i].NAME;
            var rsvp = guests[i].RSVP;
            var primary = guests[i].PRIMARY_GUEST;
            var id = guests[i].ID;

            var guest = new this.guest(id, name, rsvp, primary == null);

            if(curParty == null || guest.isPrimary) {
                if(curParty != null) {
                    partyList.push(curParty);
                }
                curParty = new this.guestParty(guest, guests[i].ADDRESS, guests[i].SAVE_THE_DATE == true, guests[i].DIET);
            } else {
                curParty.guests.push(guest);
            }

        }
        partyList.push(curParty);
        return this.sortPartyList(partyList);
    },
    sortPartyList: function(list) {
        return list.sort(function(a, b){
            return a.guests[0].name < b.guests[0].name ? -1 : 0;
        })
    },
    generateGuestTableHTML: function() {
        var wrapper = document.createElement("div");
        wrapper.innerHTML = this.templates.guestTableTemplate;

        for(var i = 0; i < this.partyList.length; i++) {
            var party = this.partyList[i];
            for(var o = 0; o < party.guests.length; o++) {
                var g = party.guests[o];
                var obj = {
                    rsvp: g.rsvp,
                    name: g.name,
                    id: g.id,
                    secondaryClass: g.isPrimary ? "" : "secondary"
                }
                var tempStr = wedding.util.formatString(this.templates.guestRowTemplate, obj);
                wrapper.getElementsByClassName("table")[0].innerHTML += tempStr;
            }
        }

        document.body.appendChild(wrapper);
    }
}