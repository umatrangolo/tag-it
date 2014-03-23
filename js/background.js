function setup(db) {
    console.log("Starting TagIt ...");

    var index = Search.open();

    // create the index
    Store.loadAll(db, function(journal) {
        console.log("Building index ...");
        _.each(journal, function(element, index, list) {
            Search.add(index, element);
        });
    });

    chrome.commands.onCommand.addListener(function(command) {
        if (command == "save") {
            // injecting all needed dependencies
            chrome.tabs.executeScript(null, { file: "js/underscore.js" });
            chrome.tabs.executeScript(null, { file: "js/jquery-2.1.0.min.js" });
            chrome.tabs.executeScript(null, { file: "js/vex.combined.min.js" });
            chrome.tabs.insertCSS(null, { file: "css/vex.css" });
            chrome.tabs.insertCSS(null, { file: "css/vex-theme-flat-attack.css" });

            chrome.tabs.executeScript(null, { file: "js/tagit_ui.js" });
        } else if (command == "export") {
            chrome.tabs.create({ "url" : "html/export.html" }, function() {
                console.log("Exporting Journal ...");
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

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

        if (request.msg == "add") {
            console.log("'Add' message received: " + JSON.stringify(request));
            Store.save(db, request.title, request.url, request.tags, function(tagit) {
                chrome.tabs.query({ "title": "Tag It" }, function(tabs) {
                    tabs.forEach(function(tab) {
                        chrome.tabs.sendMessage(tab.id, { "action": "add" });
                    });
                });
            });
        }
    });
};

Store.open(setup);
