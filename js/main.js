var JournalGenerator = {

    show: function(db, journal, selected) {

        function createJournalItem(item) {
            var p = document.createElement('p');
            p.classList.add("journal-item");

            // TODO there should be a better way! --> React.js
            var html = 
                '<div id="journal-item-' + item.id + '">' +
                '<button class="delete-journal-item" id="' + item.id + '" type="button">x</button>' +
                '<a href="' + item.url + '">' + item.title + '</a>';

            _.forEach(emitTags(item.tags), function(tag) {
                html += tag;
            });

            html +='</div>';

            p.innerHTML = html;
            return p;
        };        

        function findScore(item, selected) {
            return -1; // TODO
        };

        var journalList = document.getElementById('journal-list');

        console.log("Journal is " + JSON.stringify(journal));
        console.log("Selected is " + JSON.stringify(selected));

        journal.forEach(function(jtem) {
            journal.score = findScore(jtem, selected);
        });

        journal.sort(function(a, b) {
            if (a.score != b.score) {
                return b.score - a.score;
            } else {
                return b.id - a.id;
            }
        });

        journal.forEach(function(j) {
            if (!j.deleted) {
                journalList.appendChild(createJournalItem(j));
            }
        });

        // binding events
        var all = document.querySelectorAll('.delete-journal-item');

        for (var i = 0; i < all.length; i++) {
            all[i].addEventListener('click', function(e) {
                var id = e.currentTarget.getAttribute('id');

                Store.delete(db, id, function() {
                    JournalGenerator.deleteItem(id);

                    // notify all opened tabs
                    chrome.tabs.query({ "title": "Tag It" }, function(tabs) {
                        tabs.forEach(function(tab) {
                            chrome.tabs.sendMessage(tab.id, { "action": "delete", "id" : id });
                        });
                    });
                });
            });
        }

        function emitTags(tags) {
            return _.map(tags, function(tag) {
                return '<span class="tag">' + tag + '</span>';
            });
        }
    },

    remove: function() {
        var items = document.querySelectorAll('.journal-item');
        _.each(items, function(e, i, l) {
            e.parentNode.removeChild(e);
        });
    },

    refresh: function(journal) {
        JournalGenerator.remove();
        Store.open(function(db) {
            JournalGenerator.show(db, journal);
        });
    },

    deleteItem: function(id) {
        var deletedItem = document.getElementById('journal-item-' + id);
        if (deletedItem != null) {
            deletedItem.parentNode.removeChild(deletedItem);
        }
    }
};

chrome.runtime.onMessage.addListener(function callback(msg, sender, sendResponse) {
    console.log("Msg is " + JSON.stringify(msg));

    if (msg.action == "delete") {
        JournalGenerator.deleteItem(msg.id);
    } else if (msg.action == "add") {
        Store.open(function(db) {
            Store.loadAll(db, JournalGenerator.refresh);
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    Store.open(function(db) {
        Store.loadAll(db, function(journal) {
            JournalGenerator.show(db, journal);

            document.getElementById('export').addEventListener('click', function() {
                console.log("Exporting Journal ...");
                chrome.tabs.create({'url': chrome.extension.getURL('html/export.html')}, function(tab) {
                    // TODO
                });
            });

            document.getElementById('search').addEventListener('keyup', function() {
                var searchTerms = document.getElementById('search').value;
                console.log("Searching for [" + searchTerms + "] ...");
                chrome.runtime.sendMessage({ msg: "search", "terms": searchTerms }, function(response) {
                    console.log("Search response for " + searchTerms + " is " + JSON.stringify(response));
                });
            });
        });
    });
});
