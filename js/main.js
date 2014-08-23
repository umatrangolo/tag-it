var JournalGenerator = {

  show: function(db, journal, selected) {

    function createJournalItem(item) {

      function emitTags(tags) {
        var ts = "";

        _.forEach(tags, function(tag) {
          ts += '<span class="tag">#' + tag + '</span>';
        });

        return ts;
      }

      var p = document.createElement('p');
      p.classList.add("journal-item");

      var html = '<div id=journal-item-' + item.id + ' class="card">' +
        '  <div class="actions">' +
        '    <img id="' + item.id + '" class="delete-journal-item" src="../public/delete.png"></img>' +
        '  </div>' +
        '<div class="favicon">' +
        '<img id="favicon" class="item-favicon" src="' + URL.createObjectURL(item.favicon) + '">' +
        '</div>' +
        '  <div class="item">' +
        '  <div class="page">' +
        '  <a id="title" class="item-title" href="' + item.url  + '">' + abbreviate(item.title, 110, '...') + '</a>' +
        ' <div class="page-info">' +
        '   <div class="domain">' +
        '     <p id="sub-title" class="item-sub-title">' + abbreviate(Utils.stripUrl(item.url), 42) + '</p>' +
        '   </div>' +
        '   <div class="tags">' + emitTags(item.tags) +
        ' </div>' +
        '</div>';

      html += '</div></div>';
      p.innerHTML = html;

      return p;
    };

    function findScore(item, selected) {
      var match =_.find(selected, function(e) {
                   return e.ref == item.id;
                 });

      if (match != undefined) {
        return match.score;
      } else {
        return -1;
      }
    };

    var journalList = document.getElementById('journal-list');

    journal.forEach(function(jtem) {
      jtem.score = findScore(jtem, selected);
    });

    journal.sort(function(a, b) {
      if (a.score != b.score) {
        return b.score - a.score;
      } else {
        return b.id - a.id;
      }
    });

    journal.forEach(function(j) {
      if (!j.deleted && !(j.score == -1 && selected != undefined && selected.length > 0)) {
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
               return '<span class="tag">#' + tag + '</span>';
             });
    }
  },

  remove: function() {
    var items = document.querySelectorAll('.journal-item');
    _.each(items, function(e, i, l) {
      e.parentNode.removeChild(e);
    });
  },

  refresh: function(journal, selected) {
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
        Store.loadAll(db, Export.exportJournal);
      });

      document.getElementById('search').addEventListener('keyup', function() {
        var searchTerms = document.getElementById('search').value;
        console.log("Searching for [" + searchTerms + "] ...");
        chrome.runtime.sendMessage({ msg: "search", "terms": searchTerms }, function(response) {
          console.log("Search response for " + searchTerms + " is " + JSON.stringify(response));
          Store.open(function(db) {
            Store.loadAll(db, function(journal) {
              JournalGenerator.remove();
              JournalGenerator.show(db, journal, response.response);
            });
          });
        });
      });
    });
  });

  document.getElementById('search').focus();
});
