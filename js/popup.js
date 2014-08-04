var PDF = {};

var PopUp = {

  buildUI: function(url, title, continuation) {
    document.getElementById('title').innerHTML = abbreviate(title, 70, "...");
    document.getElementById('sub-title').innerHTML = Utils.stripUrl(url);
    document.getElementById('favicon').setAttribute('src', Utils.urlForFavicon(Utils.stripUrl(url)));

    document.getElementById('ftags').addEventListener('submit', function(e) {
      var data = document.getElementById('tags').value;
      var tags = [];

      if (data) {
        tags = data.split(' ');
      }

      continuation(url, title, tags);
      e.preventDefault();
    });
  },

  extractInfo: function(continuation) {
    chrome.tabs.query({
      active: true
    }, function(tabs) {
      if (tabs.length > 0) {

        PDFJS.getDocument(tabs[0].url).then(function(pdf) {
          pdf.getPage(1).then(function(page) {
            page.getTextContent().then(function(text) {

            });
          });
        });

        var extractor = Extractors.extractorFor(tabs[0]);
        extractor(tabs[0], function(info) {
          console.log("Info is " + JSON.stringify(info));
          continuation(info.title, info.url);
        });
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
          con
          // NOP
        });
        console.log("Done!");
        window.close();
      });
    }
  );
});
