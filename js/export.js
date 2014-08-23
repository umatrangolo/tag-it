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
    chrome.downloads.download({ url: blobUrl, saveAs: true, filename: 'tagit.bkp.json' }, function(dloadId) {
      console.log("Downloading complete. Download id was" + JSON.stringify(dloadId));
      continuation();
    });
  }
}
