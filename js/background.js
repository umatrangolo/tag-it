function setup(db) {
  console.log("Starting TagIt ...");

  var index = Search.open();

  // create the index
  Store.loadAll(db, function(journal) {
    console.log("Building index ...");
    _.each(journal, function(element, idx, list) {
      Search.add(index, element);
    });
  });

  chrome.commands.onCommand.addListener(function(command) {
    if (command == "save") {
      // injecting all needed dependencies
      chrome.tabs.executeScript(null, { file: "./lib/underscore-min.js" });
      chrome.tabs.executeScript(null, { file: "./lib/jquery-2.1.1.min.js" });
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
      Utils.loadFavicon(request.url, function(favicon) {
        Store.save(db, request.title, request.url, request.tags, favicon, function(item) {
          Search.add(index, item);
          chrome.tabs.query({ "title": "Tag It" }, function(tabs) {
            tabs.forEach(function(tab) {
              chrome.tabs.sendMessage(tab.id, { "action": "add" });
            });
          });
        });
      });
    } else if (request.msg == "search") {
      console.log("'Search' message received: " + JSON.stringify(request));
      var searchResults = Search.search(index, request.terms);
      console.log("Search response is " + JSON.stringify(searchResults));
      var searchResponse = {
        query: request,
        response: searchResults
      };
      sendResponse(searchResponse);
    }
  });
};

Store.open(setup);
