document.addEventListener('DOMContentLoaded', function () {
  Store.open(function(db) {
    Store.loadAll(db, function(journal) {

      function filterDeleted(journal) {
        return _.filter(journal, function(e) { return e.deleted != true; });
      }

      function removeFavicon(journal) {
        return _.map(journal, function(e) { return _.omit(e, 'id', 'favicon', 'deleted'); });
      }

      var exportableJournal = _.compose(filterDeleted, removeFavicon)(journal);
      var jsonJournal = JSON.stringify(exportableJournal, undefined, 2);
      document.getElementById('journal-export').innerText = jsonJournal;
    });
  });
});
