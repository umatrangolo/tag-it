document.addEventListener('DOMContentLoaded', function () {
  Store.open(function(db) {
    Store.loadAll(db, function(journal) {
      var journalNotDeleted = _.filter(journal,
        function(e) {
          return e.deleted != true;
        });

      var jsonJournal = JSON.stringify(journalNotDeleted, undefined, 2);
      document.getElementById('journal-export').innerText = jsonJournal;
    });
  });
});
