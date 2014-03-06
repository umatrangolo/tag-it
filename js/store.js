var Store = {
    JOURNAL_STORE: "journal.tagit",

    // inits the DB
    init: function(continuation) {
        var db = undefined;
        var request = indexedDB.open("tagit", 1);

        request.onerror = function(event) {
            console.log("Error while opening indexed DB!\n" + JSON.stringify(event));
        };

        request.onupgradeneeded = function(event) {
            db = event.target.result;

            // root error handler
            db.onerror = function(event) {
                console.log("Database error (" + event.target.errorCode + "):\n" + JSON.stringify(event));
            };

            // create journal object store and its index
            var journalObjStore = db.createObjectStore(Store.JOURNAL_STORE, { keyPath: "id" });
            journalObjStore.createIndex("id", "id", { unique: true });

            journalObjStore.transaction.oncomplete = function(event) { // here we are sure the store is in place
                console.log("Creation of object store complete");
                continuation(db);
            };
        };
    },

    // returns all items in the journal
    loadAll: function(db, continuation) {
        var journal = [];

        db.transaction([ Store.JOURNAL_STORE ], "read").objectStore(Store.JOURNAL_STORE).openCursor()
            .onsuccess = function(event) {
                var cursor = event.target.result;

                if (cursor) {
                    journal.push(cursor.value);
                    cursor.continue();
                } else {
                    continuation(journal);
                }
            };
    },

    // store a new journal item
    save: function(db, title, url, tags, continuation) {
        var item = { "id": Date.now(), "url": url, "title": title, "tags": tags, "deleted": false };

        db.transaction([ Store.JOURNAL_STORE ], "readwrite").objectStore(Store.JOURNAL_STORE).add(item)
            .onsuccess = function(event) {
                console.log("Journal has been updated for url " + url);
                continuation();
            };
    },

    // soft delete an item from the journal
    delete: function(db, id, continuation) {
        var tx = db.transaction([ Store.JOURNAL_STORE ], "");
        var journalStore = tx.objectStore(Store.JOURNAL_STORE);

        journalStore.get(id).onsuccess = function(event) {
            var item = event.target.result;

            item.deleted = true;
            journalStore.put(item).onsuccess = function(event) {
                console.log("Journal item with id: " + id + " has been deleted");
                continuation();
            };
        };
    }
};
