var Tagger = {
  augment: function(url, tags) {
    if (Utils.endsWith(url, ".pdf") || Utils.endsWith(url, "=pdf")) {
      console.log('--> is a pdf');
      return Tagger.augmentForPdf(url, tags);
    } else {
      return tags; // unknown
    }
  },

  augmentForPdf: function(url, tags) {
    tags.push('pdf');

    return tags;
  }
}