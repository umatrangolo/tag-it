document.addEventListener('DOMContentLoaded', function () {
  var journal = Store.loadAll();
  console.log("Journal is " + journal);
  JournalGenerator.showJournal(journal);
});
