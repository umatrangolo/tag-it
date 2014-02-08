var Store = {
    save: function(title, url, tags, continuation) {
        chrome.storage.sync.get("tagit", function(content) {
            if (_.isEmpty(content)) {
                var newJournal = appendToJournal(title, url, tags, []);
                var tagit = { "journal": newJournal };

                chrome.storage.sync.set({ "tagit" : tagit }, function() {
                    console.log("TagIt storage area has been initialized.");
                    chrome.storage.sync.get("tagit", continuation);
                });
            } else {
                var newJournal = appendToJournal(title, url, tags, content.tagit.journal);
                var tagit = { "journal": newJournal };

                chrome.storage.sync.set({ "tagit" : tagit }, function() {
                    console.log("TagIt Journal has been updated for url " + url);
                    chrome.storage.sync.get("tagit", continuation);
                });
            }
        });

        function appendToJournal(title, url, tags, journal) {
            var item = {
                "id": Date.now(),
                "url": url,
                "title": title,
                "tags": tags,
                "deleted": false
            };

            journal.unshift(item);
            return journal;
        }
    },

    delete: function(id, continuation) {
        chrome.storage.sync.get("tagit", function(content) {
            var journal = content.tagit.journal;
            var updatedJournal = _.map(journal, function(e) {
                if (e.id == id) {
                    e.deleted = true;
                }

                return e;
            });
            var tagit = { "journal" : updatedJournal };

            chrome.storage.sync.set({ "tagit": tagit }, function() {
                console.log("Journal item with id: " + id + " has been deleted");
                chrome.storage.sync.get("tagit", continuation);
            });
        });
    },

    // returns the journal
    loadAll: function(continuation) {
        chrome.storage.sync.get("tagit", function(content) {
            _.isEmpty(content) ? [] : continuation(content.tagit.journal)
        });
    }
};
