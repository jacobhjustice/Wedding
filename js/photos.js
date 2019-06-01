var wedding = wedding != undefined ? wedding : {};
wedding.photos = {
    templates: {
        img: `<img src="%%%SRC%%%" class="weddingPhoto" />`
    },


    // Relies on a set of photos in /img/couple named...
    // I) 1.jpg, 2.jpg, ..., 27.jpg  (A set of 27 pictures through the years)
    // II) e1.jpg, ... , e5.jpg (A set of 5 pictures to feature as engagement pictures)
    buildPhotos: function() {
        var html = "";
        for(var i = 1; i <= 5; i++) {
            html += wedding.util.formatString(
                wedding.photos.templates.img, {
                SRC: "img/couple/e" + i + ".jpg"
            });
        }
        document.getElementById("engagementPhotoWrapper").innerHTML = html
        html = "";
        for(var i = 1; i <= 27; i++) {
            html += wedding.util.formatString(
                wedding.photos.templates.img, {
                SRC: "img/couple/" + i + ".jpg"
            });
        }
        document.getElementById("photoWrapper").innerHTML = html
    }
}