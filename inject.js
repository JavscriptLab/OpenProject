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
(function ($) {
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
     
        if (request.method == "apirequest") {
            request.postobjects.success=function(result) {
                sendResponse(result);
                return true;
            }
            var token = $('meta[name="csrf-token"]').attr('content');
            if (token && request.postobjects.url.split("v3/").length == 1) {
                request.postobjects.headers = {
                    'X-CSRF-TOKEN': token,
                    'X-Authentication-Scheme': 'Session',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Cache-Control': "no-cache",
                    'Accept': "application/json;charset=utf-8",
                    'Pragma': "no-cache",
                    'Expires': 'Mon, 01 Jan 1990 00:00:00 GMT'
                };
                request.postobjects.accepts = {
                    text: "application/json"
                };

            } else {
                request.postobjects.headers = {
                    'X-CSRF-TOKEN': token,
                    'X-Authentication-Scheme': 'Session',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Cache-Control': "no-cache",
                    'Accept': "application/json;charset=utf-8",
                    'Pragma': "no-cache",
                    'Expires': 'Mon, 01 Jan 1990 00:00:00 GMT'
                };
                request.postobjects.accepts = {
                    text: "application/json"
                };
                request.postobjects.contentType = "application/json; charset=utf-8";
            request.postobjects.dataType = "json";    
            }
            
            
            $.ajax(request.postobjects);
        }
        return true;
    });

window.addEventListener('message', function (event) {
   
    // Only accept messages from same frame
    if (event.source !== window) {
        return;
    }

    var message = event.data;
    if (message) {

        if (message.method == "apirequest") {
           
            chrome.runtime.sendMessage(message, function (response) {
                $("body").append("<input type='hidden' id='" + message.postobjects.successfn + "'/>");
                $('#' + message.postobjects.successfn).val(JSON.stringify(response)).click();
            });

        }
    }
    // Only accept messages that we know are ours
    if (typeof message !== 'object' || message === null) {
        return;
    }
});
setTimeout(function () {
    peek("owner");
},
  5000);
})(myjQuery);
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
            if (src.split(".js").length > 1) {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.onload = function() {
                    if (callback) {
                        callback();
                    }
                }
                if (src.split("http").length == 1) {

                    getExtensionKey(function(extensionkey) {
                        script.src = "chrome-extension://" + extensionkey + "/js/" + src;
                    });
                } else {
                    script.src = src;
                }
                document.head.appendChild(script);
            } else {
                var style = document.createElement('link');
                style.type = 'text/css';
                style.rel = 'stylesheet';
                style.onload = function () {
                    if (callback) {
                        callback();
                    }
                }
                if (src.split("http").length == 1) {

                    getExtensionKey(function (extensionkey) {
                        style.href = "chrome-extension://" + extensionkey + "/styles/" + src;
                    });
                } else {
                    style.href = src;
                }
                document.head.appendChild(style);
            }
            
        }
    }

    ls("jquery.js", "",
        function () {
            ls("op.js", "");
            ls("op.css", "");


        });


})();
