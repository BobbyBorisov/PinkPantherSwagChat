var ImageUploader = (function () {
    // inpudId - the ID of the <input type="file" /> element
    // success - called when the image is uploaded. Contains the 
    // image url as a parameter
    var uploadImage = function(inputId, success) {
        var file = document.getElementById(inputId).files[0];

        if (!file || !file.type.match(/image.*/)) {
            return;
        }

        var fd = new FormData();
        fd.append("image", file);
        fd.append("key", "6528448c258cff474ca9701c5bab6927");
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://api.imgur.com/2/upload.json");

        xhr.onload = function() {
            var imgUrl = JSON.parse(xhr.responseText).upload.links.imgur_page + ".jpg";
            success(imgUrl);
        };

        xhr.send(fd);
    };

    return {
        uploadImage: uploadImage
    };
})();