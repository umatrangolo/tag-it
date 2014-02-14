var TagItUI = {

    showTagsDialog: function(url, title, continuation) {
        vex.defaultOptions.className = 'vex-theme-flat-attack';
        vex.dialog.open({
            message: title,
            input: '<input name="tags" type="text"/>',
            callback: function(data) {
                var tags = [];

                if (data) {
                    tags = data.tags.split(' ');
                    console.log("Tags are " + tags);
                }

                continuation(url, title, tags);
            }
        });
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

function main() {
    var url = TagItUI.extractUrl();
    var title = TagItUI.extractTitle();

    console.log("url: " + url + ", title: " + title);

    TagItUI.showTagsDialog(url, title, function(url, title, tags) {
        var sanitizedTags = TagItUI.sanitizeTags(tags);
        chrome.runtime.sendMessage({ msg: "add", "url": url, "title": title, "tags": sanitizedTags }, function(response) {
            console.log("'Add' msg sent to extension");
        });
    });
}

main();
