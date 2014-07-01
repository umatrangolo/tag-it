var PopUp = {

  buildUI: function(url, title, continuation) {
    document.getElementById('title').innerHTML = title;
    document.getElementById('sub-title').innerHTML = Utils.stripUrl(url);
    document.getElementById('favicon').setAttribute('src', Utils.urlForFavicon(Utils.stripUrl(url)));

    document.getElementById('ftags').addEventListener('submit', function(e) {
      var data = document.getElementById('tags').value;
      var tags = [];

      if (data) {
        tags = data.split(' ');
      }

      e.preventDefault();
      continuation(url, title, tags);
    });
  },

  extractInfo: function(continuation) {
    chrome.tabs.query({
      active: true
    }, function(tabs) {
      if (tabs.length > 0) {
        continuation(tabs[0].title, tabs[0].url);
      } else {
        console.log("No active tabs");
      }
    });
  },

  sanitizeTags: function(tags) {
    return _.filter(tags, function(t) {
      return t.trim().length > 0; // TODO Get rid of html while sanitizing the tags
    });
  }
};


document.addEventListener('DOMContentLoaded', function() {
  PopUp.extractInfo(
    function(title, url) {
      PopUp.buildUI(url, title, function(url, title, tags) {
        var sanitizedTags = PopUp.sanitizeTags(tags);
        console.log("Saving " + title + "@" + url + " with tags: " + tags);
        chrome.runtime.sendMessage({ msg: "add", "url": url, "title": title, "tags": sanitizedTags }, function(response) {
          // NOP
        });
        console.log("Done!");
        window.close();
      });
    }
  );
});
