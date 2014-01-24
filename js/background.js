chrome.commands.onCommand.addListener(function(command) {
    if (command == "save") {
        // TODO we assume that the current tab is the first one from the query
        // TODO extract the minimal url (e.g: https://www.mywickr.com instead of https://www.mywickr.com/en/index.php)
        chrome.tabs.query({ "active": true }, function(tab) {
            Store.save(tab[0].title, tab[0].url);
        });

        // notify all opened tabs
        chrome.tabs.query({ "title": "Tag It" }, function(tabs) {
            tabs.forEach(function(tab) {
                chrome.tabs.sendMessage(tab.id, { "action": "add" })
            });
        });
    } else {
        chrome.tabs.create({ "url" : "html/main.html" }, function() {
            console.log("Displaying Journal ...");
        });
    }
});

// on clicking the `TagIt` icon the Journal screen appears in a new tab
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': chrome.extension.getURL('html/main.html')}, function(tab) {
        // TODO
    });
});