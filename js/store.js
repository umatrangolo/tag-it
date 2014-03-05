var Store = {
  DB: {}, // main tagit db

  JOURNAL_STORE: "journal.tagit",

  // inits the DB
  init: function(continuation) {
    var request = indexedDB.open("tagit", 1);

    request.onerror = function(event) {
      console.log("Error while opening indexed DB!\n" + JSON.stringify(event));
    };

    request.onupgradeneeded = function(event) {
      Store.DB = event.target.result;

      // root error handler
      Store.DB.onerror = function(event) {
        console.log("Database error (" + event.target.errorCode + "):\n" + JSON.stringify(event));
      };

      // create journal object store and its index
      var journalObjStore = Store.DB.createObjectStore(Store.JOURNAL_STORE, { keyPath: "id" });
      journalObjStore.createIndex("id", "id", { unique: true });

      journalObjStore.transaction.oncomplete = function(event) { // here we are sure the store is in place
        console.log("Creation of object store complete");
      };
    };
  },

  // returns all items in the journal
  loadAll: function(continuation) {
    var journal = [];

    Store.DB.transaction([ Store.JOURNAL_STORE ], "read").objectStore(Store.JOURNAL_STORE).openCursor()
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
  save: function(title, url, tags, continuation) {
    var item = { "id": Date.now(), "url": url, "title": title, "tags": tags, "deleted": false };

    Store.DB.transaction([ Store.JOURNAL_STORE ], "write").objectStore(Store.JOURNAL_STORE).add(item)
      .onsuccess = function(event) {
        console.log("Journal has been updated for url " + url);
        continuation();
    };
  },

  // soft delete an item from the journal
  delete: function(id, continuation) {
    var tx = Store.DB.transaction([ Store.JOURNAL_STORE ], "");
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
