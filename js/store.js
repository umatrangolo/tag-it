var Store = {
    JOURNAL_STORE: "journal.tagit",
    DB_VERSION: 1,

    // Opens/inits the DB
    open: function(continuation) {
        var request = indexedDB.open("tagit", Store.DB_VERSION);

        request.onerror = function(event) {
            console.log("Error while opening/creating TagIt DB!\n" + JSON.stringify(event));
        };

        request.onsuccess = function(event) {
            var db = event.target.result;

            // root error handler
            db.onerror = function(event) {
                console.log("Database error (" + event.target.errorCode + "):\n" + JSON.stringify(event));
            };

            console.log("TagIt DB successfully opened");
            continuation(db);
        };

        request.onupgradeneeded = function(event) {
            var db = event.target.result;

            // root error handler
            db.onerror = function(event) {
                console.log("Database error (" + event.target.errorCode + "):\n" + JSON.stringify(event));
            };

            // create journal object store and its index
            var journalObjStore = db.createObjectStore(Store.JOURNAL_STORE, { keyPath: "id" });
            journalObjStore.createIndex("id", "id", { unique: true });

            // create indexes on title and url
            var journalObjStoreByTitle = journalObjStore.createIndex("title", "title", { unique: true });
            var journalObjStoreByUrl = journalObjStore.createIndex("url", "url", { unique: false });

            journalObjStore.transaction.oncomplete = function(event) { // here we are sure the store is in place
                console.log("TagIt DB successfully created");
                continuation(db);
            };
        };
    },

    // returns all items in the journal
    loadAll: function(db, continuation) {
        var journal = [];

        var tx = db.transaction([ Store.JOURNAL_STORE ]);
        var objStore = tx.objectStore(Store.JOURNAL_STORE);
        var request = objStore.openCursor();

        request.onsuccess = function(event) {
            var cursor = event.target.result;

            if (cursor) {
                // var item = cursor.value;
                // item['favicon'] = window.atob(item['favicon']);
                journal.push(cursor.value);
                cursor.continue();
            } else {
                continuation(journal);
            }
        };
    },

    // store a new journal item
    save: function(db, title, url, tags, favicon, continuation) {
        var item = { "id": Date.now(), "url": url, "title": title, "tags": tags, "favicon": window.btoa(favicon), "deleted": false };
        console.log("Storing item: " + JSON.stringify(item));

        db.transaction([ Store.JOURNAL_STORE ], "readwrite").objectStore(Store.JOURNAL_STORE).add(item).onsuccess = function(event) {
            console.log("Journal has been updated for url " + url);
            continuation(item);
        };
    },

    // soft delete an item from the journal
    delete: function(db, id, continuation) {
        var tx = db.transaction([ Store.JOURNAL_STORE ], "readwrite");
        var journalStore = tx.objectStore(Store.JOURNAL_STORE);
        var request = journalStore.get(parseInt(id));

        request.onerror = function(event) { console.log("Error loading journal item with id:" + id); }
        request.onsuccess = function(event) {
            var item = request.result;

            item.deleted = true;
            journalStore.put(item).onsuccess = function(event) {
                console.log("Journal item with id: " + id + " has been deleted");
                continuation();
            };
        };
    }
};
