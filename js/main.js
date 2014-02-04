var JournalGenerator = {

    show: function(journal) {
        var journalList = document.getElementById('journal-list');

        journal.forEach(function(j) {
            if (!j.deleted) {
                var p = document.createElement('p');
                p.classList.add("journal-item");

                // TODO there should be a better way! --> React.js
                p.innerHTML =
                    '<div id="journal-item-' + j.id + '">' +
                    '<button class="delete-journal-item" id="' + j.id + '" type="button">x</button>' +
                    '<a href="' + j.url + '">' + j.title + '</a>' +
                    '</div>';

                journalList.appendChild(p);
            }
        });

        // binding events
        var all = document.querySelectorAll('.delete-journal-item');
        for (var i = 0; i < all.length; i++) {
            all[i].addEventListener('click', function(e) {
                var id = e.currentTarget.getAttribute('id');
                Store.delete(id, function() {
                    JournalGenerator.deleteItem(id);

                    // notify all opened tabs
                    chrome.tabs.query({ "title": "Tag It" }, function(tabs) {
                        tabs.forEach(function(tab) {
                            chrome.tabs.sendMessage(tab.id, { "action": "delete", "id" : id })
                        });
                    });    
                });
            });
        }
    },

    remove: function() {
        var items = document.querySelectorAll('.journal-item');
        _.each(items, function(e, i, l) {
            e.parentNode.removeChild(e);
        });
    },

    refresh: function(tagit) {
        JournalGenerator.remove();
        JournalGenerator.show(tagit.journal);
    },

    deleteItem: function(id) {
        var deletedItem = document.getElementById('journal-item-' + id);
        deletedItem.parentNode.removeChild(deletedItem);
    }
}

chrome.runtime.onMessage.addListener(function callback(msg, sender, sendResponse) {
    console.log("Msg is " + JSON.stringify(msg));
    if (msg.action == "delete") {
        JournalGenerator.deleteItem(msg.id);
    } else if (msg.action == "add") {
        Store.loadAll(JournalGenerator.refresh);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    Store.loadAll(function(tagit) {
        JournalGenerator.show(tagit.journal);

        document.getElementById('export').addEventListener('click', function() {
            console.log("Exporting Journal ...");
            chrome.tabs.create({'url': chrome.extension.getURL('html/export.html')}, function(tab) {
                // TODO
            });
        });
    });
});
