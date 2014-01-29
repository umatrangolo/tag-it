var Store = {
    save: function(title, url, continuation) {
        chrome.storage.sync.get("tagit", function(tagit) {
            if (tagit == {}) {
                var journal = append(title, url, []);

                chrome.storage.sync.set({
                    "tagit" : { "journal": journal }
                }, function() {
                    console.log("TagIt storage area has been initialized.");
                    chrome.storage.sync.get("tagit", continuation);
                });
            } else {
                var journal = append(title, url, tagit.journal)

                chrome.storage.sync.set({ "tagit" : { "journal" : journal } }, function() {
                    console.log("TagIt Journal has been updated for url " + url);
                    chrome.storage.sync.get("tagit", continuation);
                });
            }
        });

        function append(title, url, journal) {
            var item = {
                "id": Date.now(),
                "url": url,
                "title": title,
                "deleted": false
            };

            return journal.unshift(item);
        }
    },

    delete: function(id) {
        chrome.storage.sync.get("tagit", function(tagit) {
            _.each(tagit.journal, function(e) {
                if (e.id == id) {
                    e.deleted = true;
                }
            });

            chrome.storage.sync.set({"tagit": tagit}, function() {
                console.log("Journal item with id: " + id + " has been deleted");
                chrome.storage.sync.get("tagit", continuation);
            });
        });
    },

    loadAll: function(continuation) {
        chrome.storage.sync.get("tagit", function(tagit) { continuation(tagit); });
    }
};
