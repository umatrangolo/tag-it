var JournalGenerator = {

    showJournal: function(journal) {
        var journalUl = document.getElementById('journal-list');

        journal.forEach(function(j) {
            var li = document.createElement('li');

            li.innerHTML = '<a href="' + j + '">' + j + '</a>';
            journalUl.appendChild(li);
        });
    }
}
