var Utils = {

  stripUrl: function(url) {
    return new URL(url).hostname;
  },

  urlForFavicon: function(domain) {
    return "http://www.google.com/s2/favicons?domain=" + domain;
  },

  endsWith: function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  },

  loadFavicon: function(url, continuation) {
    var xhr = new XMLHttpRequest();
    var blob;

    xhr.open("GET", Utils.urlForFavicon(Utils.stripUrl(url)), true);
    xhr.responseType = "blob";
    xhr.addEventListener("load", function () {
      if (xhr.status === 200) {
        console.log("Favicon successfully retrieved");
        continuation(xhr.response);
      }
    }, false);

    xhr.send();
  }
};