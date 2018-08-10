(function ($) {
    var myUserId = 0;
    if (window.parent == window) {
        var request = function(url, type, postdata, callback) {
            var datekey = Date.parse(new Date()) + url.replace(/\//ig, "").split("?")[0];
            url=url.replace("/api/","");
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
                    console.log(datekey);
                    console.log(result);
                    callback(result);
                });
        }
        function convertallstatuses(fromid,totitle) {
            var filters = [
                               {
                                   "assignee": { "operator": "=", "values": [myUserId] }
                               },
                               {
                                   "status": { "operator": "=", "values": [fromid] }
                               }
            ];

            request("v3/work_packages",
                "GET",
                { filters: JSON.stringify(filters) },
                function (ongoingworks) {

                    $.each(ongoingworks._embedded.elements, function (i, v) {

                        var workid = v.id;
                        request("v3/work_packages/" + workid + "/form",
                            "POST",
                            {},
                            function (currentform) {
                                debugger;
                                var allowedstatusList = currentform._embedded.schema.status._embedded.allowedValues;
                                var newstatus = allowedstatusList.filter(function (v) {
                                    if (v.name == totitle) {
                                        return v;
                                    }
                                });
                                if (newstatus.length > 0) {
                                    currentform._links.status = newstatus[0]._links.self;
                                    request("v3/work_packages/" + workid,
                                        "patch",
                                        JSON.stringify(currentform),
                                        function (successofsaveform) {
                                            debugger;
                                        })

                                } else {
                                    currentform._links.status = newstatus[0]._links.self;
                                    request("v3/work_packages/" + workid,
                                        "patch",
                                        JSON.stringify(currentform),
                                        function (successofsaveform) {
                                            debugger;
                                        })
                                }

                            })


                    })




                })
        }
        $("body").on("click",
            ".openprojectworkslistitem",
            function(e) {
                $(".openprojectworkslistitem").removeClass("opiteminprogress");
                $(this).addClass("opiteminprogress");
                var wkid = $(this).attr("data-id");
                request("v3/work_packages/" + wkid + "/form",
                    "POST",
                    {},
                    function (result) {
                        var form = result._embedded.payload;
                        var allowedstatusList = result._embedded.schema.status._embedded.allowedValues;
                        var ongoingstatus = allowedstatusList.filter(function (v) {
                            if (form._links.status.title == "In development") {
                                if (v.name == "New") {
                                    return v;
                                }
                            } else {
                                if (v.name == "In development") {
                                    return v;
                                }
                            }
                        });

                        if (ongoingstatus.length > 0) {
                            converallstatuses("8","New");


                        form.percentageDone = 0;
                        form._links.status = ongoingstatus[0]._links.self;
                            
                        request("v3/work_packages/" + wkid,
                            "patch",
                            JSON.stringify(form),
                            function(result) {

                            })
                        
                            }
                    })
            });

        request("v3/my_preferences",
            "GET",
            {},
            function(result) {
                if (result._links.user.href.split("/").length > 3) {
                    myUserId = result._links.user.href.split("/")[4];

                    var filters = [
                        {
                            "assignee": { "operator": "=", "values": [myUserId] }
                        }
                    ]

                    request("v3/work_packages",
                        "GET",
                        { filters: JSON.stringify(filters) },
                        function(result) {
                            console.log(result);
                            $("body").append(
                                '<div id="openprojectwindow"></div>');
                            $("#openprojectwindow").append('<ul id="openprojectworkslist"></ul>');
                            $.each(result._embedded.elements,
                                function(i, v) {
                                    $("#openprojectworkslist").append('<li data-id="' +
                                        v.id +
                                        '" class="openprojectworkslistitem"><a>' +
                                        v.subject +
                                        "</a></li>");
                                });
                            $(".openprojectworkslistitem:eq(1)").trigger("click");

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