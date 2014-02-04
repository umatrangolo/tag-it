var Store = {
    save: function(title, url, continuation) {
        chrome.storage.sync.get("tagit", function(tagit) {
            if (_.isEmpty(tagit)) {
                var newJournal = appendToJournal(title, url, []);
                var tagit = { "journal": newJournal };

                chrome.storage.sync.set({ "tagit" : tagit }, function() {
                    console.log("TagIt storage area has been initialized.");
                    chrome.storage.sync.get("tagit", continuation);
                });
            } else {
                var newJournal = append(title, url, tagit.tagit.journal); // TODO wtf!?!

                chrome.storage.sync.set({ "tagit" : { "journal" : newJournal } }, function() {
                    console.log("TagIt Journal has been updated for url " + url);
                    chrome.storage.sync.get("tagit", continuation);
                });
            }
        });

        function appendToJournal(title, url, journal) {
            var item = {
                "id": Date.now(),
                "url": url,
                "title": title,
                "deleted": false
            };

            journal.unshift(item);
            return journal;    
        }
    },

    delete: function(id, continuation) {
        chrome.storage.sync.get("tagit", function(tagit) {
            _.each(tagit.tagit.journal, function(e) { // TODO wtf !?!
                if (e.id == id) {
                    e.deleted = true;
                }
            });

            chrome.storage.sync.set({ "tagit": tagit }, function() {
                console.log("Journal item with id: " + id + " has been deleted");
                chrome.storage.sync.get("tagit", continuation);
            });
        });
    },

    loadAll: function(continuation) {
        chrome.storage.sync.get("tagit", function(content) {
            continuation(content.tagit);  
        });
    }
};
