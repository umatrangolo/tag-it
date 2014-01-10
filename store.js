var Store = {
    save: function(url) {
        if (localStorage.tagit == undefined) {
            localStorage.tagit = JSON.stringify({
                "journal": []
            });
        }

        var tagit = JSON.parse(localStorage.tagit);
        tagit.journal.unshift(url);

        localStorage.tagit = JSON.stringify(tagit);
    },

    loadAll: function() {
        var tagit = JSON.parse(localStorage.tagit);
        if (tagit) return tagit.journal;
        else [];
    }
};
