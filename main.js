var JournalGenerator = {

    showJournal: function(journal) {
        var journalUl = document.getElementById('journal-list');

        journal.forEach(function(j) {
            if (!j.deleted) {
                var li = document.createElement('li');

                // TODO there should be a better way!
                li.innerHTML =
                    '<div id="journal-item-' + j.id + '">' +
                    '<button class="delete-journal-item" id="' + j.id + '" type="button">x</button>' +
                    '<a href="' + j.url + '">' + j.title + '</a>' +
                    '</div>';

                journalUl.appendChild(li);
            }
        });

        // binding events
        var all = document.querySelectorAll('.delete-journal-item');
        for (var i = 0; i < all.length; i++) {
            all[i].addEventListener('click', function(e) {
                var id = e.currentTarget.getAttribute('id');
                Store.delete(id);
                JournalGenerator.deleteJournalItem(id);
            });
        }
    },

    deleteJournalItem: function(id) {
        var deletedItem = document.getElementById('journal-item-' + id);
        deletedItem.parentNode.removeChild(deletedItem);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var journal = Store.loadAll();
    JournalGenerator.showJournal(journal);
});
