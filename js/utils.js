var Utils = {

  stripUrl: function(url) {
    return new URL(url).hostname;
  },

  urlForFavicon: function(domain) {
    return "http://www.google.com/s2/favicons?domain=" + domain;
  }
};