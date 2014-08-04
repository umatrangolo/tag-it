var Extractors = {

  extractorFor: function(tab) {
    if (Utils.endsWith(tab.url, ".pdf")) {
      return Extractors.pdf;
    } else {
      return Extractors.default;
    }
  },

  pdf: function(tab) {
    return { // TODO
      title: "Dynamo: Amazon's Highly Available Key-value Store",
      url: 'http://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf'
    }
  },

  default: function(tab) {
    return {
      title: tab.title,
      url: tab.url
    };
  }
}