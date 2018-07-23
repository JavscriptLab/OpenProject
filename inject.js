var keep = function (key, value) {
    chrome.runtime.sendMessage({ method: "OPputDataByKey", value: value, key: key },
      function (response) {

      });
};
var peek = function (key, callback) {
    chrome.runtime.sendMessage({ method: "OPgetDataByKey", key: key },
       function (response) {
           if (callback) {
               callback(response);
           }
       });

};
var getExtensionKey = function (callback) {
    chrome.runtime.sendMessage({ method: "AutogetExtensionKey" },
       function (response) {
           if (callback) {
               callback(response);
           }
       });
};
window.addEventListener('message', function (event) {

    // Only accept messages from same frame
    if (event.source !== window) {
        return;
    }

    var message = event.data;

    // Only accept messages that we know are ours
    if (typeof message !== 'object' || message === null) {
        return;
    }
});
setTimeout(function () {
    peek("owner");
},
  5000);

(function () {

    var ls = function (src, location, callback) {
        var valid = false;
        var chances = location.split("|");
        for (var key in chances) {
            if (window.location.href.toLowerCase().split(chances[key.toLowerCase()]).length > 1) {
                valid = true;
            }
        }
        if (valid && (location != "" || src == "jquery.js" || window.top == window.self)) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.onload = function () {
                if (callback) {
                    callback();
                }
            }
            if (src.split("http").length == 1) {

                getExtensionKey(function (extensionkey) {
                    script.src = "chrome-extension://" + extensionkey + "/js/" + src;
                });
            } else {
                script.src = src;
            }
            document.head.appendChild(script);
        }
    }

    ls("jquery.js", "",
        function () {
            ls("op.js", "");
            

        });


})();
