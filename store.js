var Store = {
    save: function(title, url) {
        if (localStorage.tagit == undefined) {
            localStorage.tagit = JSON.stringify({
                "journal": []
            });
        }

        var tagit = JSON.parse(localStorage.tagit);
        var item = {
            "url": url,
            "title": title
        };

        tagit.journal.unshift(item);
        localStorage.tagit = JSON.stringify(tagit);
    },

    loadAll: function() {
        var tagit = JSON.parse(localStorage.tagit);
        if (tagit) return tagit.journal;
        else [];
    }
};
