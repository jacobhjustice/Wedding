var wedding = wedding != undefined ? wedding : {};
wedding.admin = {
    templates: {
        memberTemplate: 
            `<div>
                <div class="divider"></div>
                <div class="member">
                    <label>Name<input type="text" class="name"/></label>
                    <label>Phone<input type="text" class="phone"/></label>
                    <label>Email<input type="text" class="email"/></label>
                    <label>Addrress<input type="text" class="address"/></label>
                </div>
                <div class="btn" id="removeMemberFromParty" onclick="wedding.admin.removeMemberFromParty(this.parentNode);">Remove Member</div>
            </div>`
    },

    addMemberToParty: function(form) {
        form.getElementsByClassName("success")[0].style.display = "none";
        form.getElementsByClassName("error")[0].style.display = "none";
        form.getElementsByClassName("members")[0].innerHTML += this.templates.memberTemplate;
    },

    removeMemberFromParty: function(wrapper) {
        form.getElementsByClassName("success")[0].style.display = "none";
        form.getElementsByClassName("error")[0].style.display = "none";
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
            var phone = mem.getElementsByClassName("phone")[0].value;
            var email = mem.getElementsByClassName("email")[0].value;
            var addy = mem.getElementsByClassName("address")[0].value;

            if(name == "" || phone == "" || email == "" || addy == "") {
                form.getElementsByClassName("error")[0].style.display = "block";
                return;
            }
            json.push({
                NAME: name,
                ADDRESS: addy,
                PHONE: phone,
                EMAIL: email
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
        }, ["DATA", encodeURIComponent(JSON.stringify(json))]) 
    }
};