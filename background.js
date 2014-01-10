var Store = {

    save: function(url) {
        if (localStorage.tagit == undefined) {
            localStorage.tagit = JSON.stringify({
                "journal": []
            });
        }

        var tagit = JSON.parse(localStorage.tagit);
        tagit.journal.unshift(url);

        localStorage.tagit = JSON.stringify(tagit);

        console.log("Tagged " + url + " has been saved in the Local Storage");
    },

    loadAll: function() {
        console.log("Loading the journal ...");
    }
};

chrome.commands.onCommand.addListener(function(command) {
    if (command == "save") {
        // TODO we assume that the current tab is the first one from the query
        // TODO extract the minimal url (e.g: https://www.mywickr.com instead of https://www.mywickr.com/en/index.php)
        chrome.tabs.query({ "active": true }, function(tab) {
            Store.save(tab[0].url);
        });
    }
    else Store.loadAll();
});
