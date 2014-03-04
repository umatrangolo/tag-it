var IndexedStore = {
    DB: {}, // main tagit db

    init: function(continuation) {
        var request = indexedDB.open("tagit", 1);

        request.onerror = function(event) {
            console.log("Error while opening indexed DB!\n" + JSON.stringify(event));
        };

        request.onupgradeneeded = function(event) {
            IndexedStore.DB = event.target.result;

            IndexedStore.DB.onerror = function(event) {
                console.log("Error with the IndexedDB:\n" + JSON.stringify(event));
            };

            // create journal object store
            var journalObjStore = DB.createObjectStore("tagit.journal", { keyPath: "id" });
            journalObjStore.createIndex("id", "id", { unique: true });

            journalObjStore.transaction.oncomplete = function(event) {
                console.log("Creation of object stores complete");
                continuation();
            };
        };
    },

    save: function(title, url, tags, continuation) {
        var tx = IndexedStore.DB.transaction(["tagit.journal"], "readwrite");

        tx.oncomplete = function(event) { continuation(); };
        tx.onerror = function(event) {
            console.log("Error saving title: " + title + ", url: "  + url + ", tags: " + tags + "\nError: " + JSON.stringify(event));
        };

        var objStore = tx.objectstore("tagit.journal");
        var request = objStore.get("journal");
        request.onsuccess = function(event) {
            var content = request.result;
            
            if (_.isEmpty(content)) {
                var newJournal = appendToJournal(title, url, tags, []);
                var journal = { "journal": newJournal };

                chrome.storage.sync.set({ "tagit" : tagit }, function() {
                    console.log("TagIt storage area has been initialized.");
                    console.log(chrome.runtime.lastError);
                    chrome.storage.sync.get("tagit", continuation);
                });

            } else {

            }
        };

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
    }
};

var Store = {
    save: function(title, url, tags, continuation) {
        chrome.storage.sync.get("tagit", function(content) {
            if (_.isEmpty(content)) {
                var newJournal = appendToJournal(title, url, tags, []);
                var tagit = { "journal": newJournal };

                chrome.storage.sync.set({ "tagit" : tagit }, function() {
                    console.log("TagIt storage area has been initialized.");
                    console.log(chrome.runtime.lastError);
                    chrome.storage.sync.get("tagit", continuation);
                });
            } else {
                var newJournal = appendToJournal(title, url, tags, content.tagit.journal);
                var tagit = { "journal": newJournal };

                chrome.storage.sync.set({ "tagit" : tagit }, function() {
                    console.log("TagIt Journal has been updated for url " + url);
                    console.log(chrome.runtime.lastError);
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
