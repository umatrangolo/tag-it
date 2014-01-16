var Store = {
    save: function(title, url) {
        if (localStorage.tagit == undefined) {
            localStorage.tagit = JSON.stringify({
                "journal": []
            });
        }

        var tagit = JSON.parse(localStorage.tagit);
        var item = {
            "id": Date.now(),
            "url": url,
            "title": title,
            "deleted": false
        };

        tagit.journal.unshift(item);
        localStorage.tagit = JSON.stringify(tagit);
    },

    delete: function(id) {
        if (localStorage.tagit != undefined) {
            var tagit = JSON.parse(localStorage.tagit);

            tagit.journal.forEach(
                function(item) {
                    if (item.id == id) {
                        item.deleted = true;
                    }
                }
            );
            localStorage.tagit = JSON.stringify(tagit);
        }
    },

    loadAll: function() {
        var tagit = JSON.parse(localStorage.tagit);
        if (tagit) return tagit.journal;
        else [];
    }
};
