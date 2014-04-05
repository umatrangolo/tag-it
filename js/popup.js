var PopUp = {

    buildUI: function(url, title, continuation) {
        document.getElementById('title').innerHTML = title;

        document.getElementById('save').addEventListener('click', function(e) {
            var data = document.getDocumentById('save').value;
            var tags = [];

            if (data) {
                tags = data.tags.split(' ');
                console.log("Tags are " + tags);
            }
            continuation(url, title, tags);
        });
    },

    extractInfo: function() {


    },


    extractTitle: function() {
        return document.title;
    },

    extractUrl: function() {
        return document.location.href;
    },

    sanitizeTags: function(tags) {
        return _.filter(tags, function(t) {
            return t.trim().length > 0; // TODO Get rid of html while sanitizing the tags
        });
    }
};


document.addEventListener('DOMContentLoaded', function() {
    var url = PopUp.extractUrl();
    var title = PopUp.extractTitle();

    console.log("url " + url + ", title " + title);

    PopUp.buildUI(url, title, function(url, title, tags) {
        var sanitizedTags = PopUp.sanitizeTags(tags);
        chrome.runtime.sendMessage({ msg: "add", "url": url, "title": title, "tags": sanitizedTags }, function(response) {
            // NOP
        });
    });
});
