var TagItUI = {

	showTagsDialog: function(url, title, continuation) {
		vex.defaultOptions.className = 'vex-theme-flat-attack';
		vex.dialog.open({
			message: title,
			input: '<input name="tags" type="text"/>',
			callback: function(data) {
				var tags = [];

				if (data) {
					tags = data.tags.split(' ');
					console.log("Tags are " + tags);
				}

				continuation(url, title, tags);
			}
		});
	},

	extractTitle: function() {
		return document.title;
	},

	extractUrl: function() {
		return document.location.href;
	}
};

function main() {
	var url = TagItUI.extractUrl();
	var title = TagItUI.extractTitle();

	console.log("url: " + url + ", title: " + title);

	TagItUI.showTagsDialog(url, title, function(url, title, tags) {
    	Store.save(title, url, tags, function(tagit) {
      		// notify all opened tabs
       		chrome.tabs.query({ "title": "Tag It" }, function(tabs) {
        		tabs.forEach(function(tab) {
                	chrome.tabs.sendMessage(tab.id, { "action": "add" })
            	});
        	});
		});
    });
}

main();
