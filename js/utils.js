var Utils = {

  stripUrl: function(url) {
    return new URL(url).hostname;
  }
};