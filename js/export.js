document.addEventListener('DOMContentLoaded', function () {
    var journal = Store.loadAll();
    var journalNotDeleted = _.filter(journal, function(e) {
        return e.deleted != true;
    });

    var jsonJournal = JSON.stringify(journalNotDeleted, null, 2);
    document.getElementById('journal-export').innerText = jsonJournal;
});
