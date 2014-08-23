var Export = {
  exportJournal: function(journal, continuation) {

    function filterDeleted(journal) {
      return _.filter(journal, function(e) { return e.deleted != true; });
    }

    function removeFavicon(journal) {
      return _.map(journal, function(e) { return _.omit(e, 'id', 'favicon', 'deleted'); });
    }

    var exportableJournal = _.compose(filterDeleted, removeFavicon)(journal);
    var blob = new Blob([JSON.stringify(exportableJournal, undefined, 2)], { type: 'application/json' });
    var blobUrl = URL.createObjectURL(blob);

    continuation(blobUrl);
  }
}
