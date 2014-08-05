var Extractors = {

  extractorFor: function(tab) {
    if (Utils.endsWith(tab.url, ".pdf") || Utils.endsWith(tab.url, "=pdf")) {
      return Extractors.pdf;
    } else {
      return Extractors.default;
    }
  },

  pdf: function(tab, continuation) {
    function scan(pdf, idx) {
      function scanFor(str, items) {
        return _.find(items, function(item) {
          return (item.str.trim().toLowerCase() == 'abstract');
        });
      }

      function collectTitle(items) {
        var i = 0;
        var title = "";

        while (items[i].str.trim().toLowerCase() == '' ||
               items[i].str.trim().toLowerCase().substring(0, 6) == 'arxiv:') { i++; } // hack to fix arXiv papers
        var titleFont = items[i].fontName;

        while (items[i].fontName == titleFont && i < items.length) {
          title = title + " " +items[i].str;
          i++;
        }

        return title;
      }

      pdf.getPage(idx).then(function(page) {
        console.log("Scanning page " + idx + " ...");
        page.getTextContent().then(function(text) {
          var scanRes = scanFor('abstract', text.items);
          if (scanRes != undefined) {
            console.log("Title parsed as " + text.items[0].str);
            continuation({
              title: collectTitle(text.items), // assuming is the title
              url: tab.url
            });
          } else {
            if (idx == pdf.numPages) { // not found: fallback on the default one
              console.log("No title found.");
              Extractors.default(tab, continuation);
            } else {
              scan(pdf, idx + 1);
            }
          }
        });
      });
    }

    console.log("Parsing document at " + tab.url);
    PDFJS.getDocument(tab.url).then(function(pdf) {
      scan(pdf, 1);
    });
  },

  default: function(tab, continuation) {
    continuation({
      title: tab.title,
      url: tab.url
    });
  }
}