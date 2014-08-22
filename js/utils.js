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

    xhr.open("GET", Utils.urlForFavicon(Utils.stripUrl(url)), true);
    xhr.responseType = "blob";
    xhr.addEventListener("load", function() {
      if (xhr.status == 200) {
        continuation(new Blob([xhr.response], { type: "image" }));
      }
    }, false);

    xhr.send();
  },

  arrayBufferToBase64: function(buffer) {
    var binary = ''
    var bytes = new Uint8Array( buffer )
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] )
    }
    return window.btoa( binary );
  },

  base64ToArrayBuffer: function (base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        var ascii = binary_string.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes.buffer;
  }
};