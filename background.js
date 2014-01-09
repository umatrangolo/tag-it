console.log("Binding...");
chrome.commands.onCommand.addListener(function(command) {
    console.log('onCommand event received for message: ', command);
    chrome.tabs.create({url: "news.ycombinator.com"});
});
