(function ($) {

    if (window.parent == window) {
        var request = function(url, type, postdata, callback) {
            var datekey = Date.parse(new Date()) + url.replace(/\//ig, "").split("?")[0];
            window.postMessage({
                    method: "apirequest",
                    postobjects: {
                        url: "https://openproject.fingent.net/api/" + url,
                        data: postdata,
                        type: type,
                        successfn: datekey
                    }
                },
                "*");

            $("body").on("click",
                "#" + datekey,
                function(e) {
                    var result = JSON.parse($(this).val());
                    callback(result);
                });
        }

        $("body").on("click",
            ".openprojectworkslistitem",
            function(e) {
                $(".openprojectworkslistitem").removeClass("iteminprogress");
                $(this).addClass("iteminprogress");
                
                request("v3/work_packages/"+$(this).attr("data-id")+"/form",
                    "POST",
                    {},
                    function (result) {
                        var form = result._embedded.payload;

                    })
            });

        request("v3/my_preferences",
            "GET",
            {},
            function(result) {
                if (result._links.user.href.split("/").length > 3) {
                    var userid = result._links.user.href.split("/")[4];

                    var filters = [
                        {
                            "assignee": { "operator": "=", "values": [userid] }
                        }
                    ]

                    request("v3/work_packages",
                        "GET",
                        { filters: JSON.stringify(filters) },
                        function(result) {
                            console.log(result);
                            $("body").append(
                                '<div id="openprojectwindow" style="position: absolute;right: 0px;"></div>');
                            $("#openprojectwindow").append('<ul id="openprojectworkslist"></ul>');
                            $.each(result._embedded.elements,
                                function(i, v) {
                                    $("#openprojectworkslist").append('<li data-id="' +
                                        v.id +
                                        '" class="openprojectworkslistitem">' +
                                        v.subject +
                                        "</li>");
                                });


                        });

                }

            });

        request("experimental/users?status=all",
            "GET",
            {},
            function(result) {

                $("body").append("");

            });


        ////$.ajax({
        ////    url: "https://openproject.fingent.net/api/v3/work_packages/",
        ////    ////data: { signature: authHeader },
        ////    type: "GET",
        ////    ////beforeSend: function(req) {
        ////    ////    req.setRequestHeader('Authorization', "Basic 2519132cdf62dcf5a66fd96394672079f9e9cad1:2519132cdf62dcf5a66fd96394672079f9e9cad1");
        ////    ////},
        ////    success: function () {
        ////        debugger;
        ////        $("body").append("");
        ////    }
        ////});
    }
})(myjQuery);