(function ($) {

    $.ajax({
        url: "https://openproject.fingent.net/api/v3/work_packages/",
        ////data: { signature: authHeader },
        type: "GET",
        ////beforeSend: function(req) {
        ////    req.setRequestHeader('Authorization', "Basic 2519132cdf62dcf5a66fd96394672079f9e9cad1:2519132cdf62dcf5a66fd96394672079f9e9cad1");
        ////},
        success: function () {
            debugger;
            $("body").append("");
        }
    });
 
})(myjQuery);