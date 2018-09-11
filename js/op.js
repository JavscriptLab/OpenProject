(function ($) {
    ////    return false;
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

        function convertstatus(workid,fromid, totitle, secondtotitle) {
            request("v3/work_packages/" + workid + "/form",
                           "POST",
                           {},
                           function (currentform) {
                             
                               var allowedstatusList = currentform._embedded.schema.status._embedded.allowedValues;
                               var newstatus = allowedstatusList.filter(function (v) {
                                   if (v.name == totitle) {
                                       return v;
                                   }
                               });
                               if (newstatus.length > 0) {
                                   
                                   currentform._embedded.payload._links.status = newstatus[0]._links.self;
                                   request("v3/work_packages/" + workid,
                                       "patch",
                                       JSON.stringify(currentform._embedded.payload),
                                       function (successofsaveform) {
                                           listallworkpackages()
                                       })

                               } else if (secondtotitle) {
                                   var newstatus = allowedstatusList.filter(function (v) {
                                       if (v.name == secondtotitle) {
                                           return v;
                                       }
                                   });
                                   if (newstatus.length > 0) {
                                       currentform._embedded.payload._links.status = newstatus[0]._links.self;
                                       request("v3/work_packages/" + workid,
                                           "patch",
                                           JSON.stringify(currentform._embedded.payload),
                                           function (successofsaveform) {
                                               convertstatus(workid, fromid, totitle);
                                           })
                                   } else {
                                       ////currentform._links.status = newstatus[0]._links.self;
                                       ////request("v3/work_packages/" + workid,
                                       ////    "patch",
                                       ////    JSON.stringify(currentform),
                                       ////    function(successofsaveform) {
                                       ////        debugger;
                                       ////    });
                                   }
                               }

                           })
        }

        function convertallstatuses(fromid, totitle, secondtotitle, currentprogressid,packageid) {
            var filters = [
                               {
                                   "assignee": { "operator": "=", "values": [myUserId] }
                               },
                               {
                                   "status": { "operator": "=", "values": [fromid] }
                               }
            ];
            if (packageid) {
                filters.push({
                    "id": { "operator": "=", "values": [packageid] }
                })
            }

            request("v3/work_packages",
                "GET",
                { filters: JSON.stringify(filters) },
                function (ongoingworks) {

                    $.each(ongoingworks._embedded.elements, function (i, v) {

                        var workid = v.id;
                        if (currentprogressid != workid) {
                            convertstatus(workid, fromid, totitle, secondtotitle);
                        }

                    })




                })
        }
        
        $("body").on("change",
            "#opmenu-toggle",
            function (e) {
                if ($(this).prop("checked")) {
                    $("#opbox").addClass("opboxactive");
                } else {
                    $("#opbox").removeClass("opboxactive");
                }
                ////TODO
            });
        $("body").on("mouseover",
            "#opbox",
            function (e) {
                
                $("#opbox").addClass("opactive");
                $("#optrigger,#opburger").show();
            });
        $("body").on("mouseout",
            "#opbox",
            function (e) {
                $("#opbox").removeClass("opactive");
                $("#optrigger,#opburger").hide();
            });
        $("body").on("click",
            ".opupdatebutton",
            function (e) {
                debugger;
                ////TODO
            });
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
                           
                                if (v.name == "In development") {
                                    return v;
                                }
                            
                        });

                        if (ongoingstatus.length > 0) {
                            convertallstatuses("8", "New", "On hold", wkid);
                            form.percentageDone = 0;
                            form._links.status = ongoingstatus[0]._links.self;

                            request("v3/work_packages/" + wkid,
                                "patch",
                                JSON.stringify(form),
                                function(result) {
                                    listallworkpackages()
                                })

                        } else {
                            if (form._links.status.title == "In development") {
                                convertallstatuses("8", "New", "On hold", 0, wkid);
                            }
                        }
                    })
            });
        function listallworkpackages() {
            var filters = [
                {
                    "assignee": { "operator": "=", "values": [myUserId] }
                }
            ]

            request("v3/work_packages",
                "GET",
                { filters: JSON.stringify(filters) },
                function (result) {
                    console.log(result);
                    $("#opbox").find(
                        '#openprojectwindow').remove();
                    $("#opbox").append(
                        '<div id="openprojectwindow"></div>');
                    $("#openprojectwindow").append('<ul id="openprojectworkslist"></ul>');
                    $.each(result._embedded.elements,
                        function (i, v) {
                           
                            if (v._links.status.title == "In development") {
                                request(v._links.activities.href,
                                    "GET", {},
                                    function (activities) {
var lastupdateddetails=activities._embedded.elements.filter(function(act){
        if(act.details.length>0){
                var detailsofstatus=act.details.filter(function(det){
                        if(det.raw.split("Status changed from").length>1){
                                return det;
                        }
                })
                if(detailsofstatus.length>0){
                        return detailsofstatus;
                }
        }
})

if (lastupdateddetails.length > 0) {
    var lastupdated = activities._embedded.elements[activities._embedded.elements.length - 1]
        ////var lastupdated=lastupdateddetails[lastupdateddetails.length-1];
var createdAt=new Date(lastupdated.createdAt).toString().split("GMT")[0];
$("#openprojectworkslist").prepend('<li data-createdtime="' + createdAt + '" data-id="' +
                                v.id +
                                '" class="openprojectworkslistitem opworkslistitemtype' + v._links.type.title.replace(/ /ig, "").toLowerCase() + ' opworkslistitemstatus' + v._links.status.title.replace(/ /ig, "").toLowerCase() + '"><a class="opitemsubject">' +
                                v.subject + '</a> <a class="opitemtypetitle"><b class="opicon">&#8859;</b>' + v._links.type.title.replace(/ /ig, "") + '</a> <a class="opitemstatustitle"><b class="opicon">&#9734;</b>' + v._links.status.title.replace(/ /ig, "") +
                                "</a><span class='opitemstatusstartingdate'>Started from "+createdAt+"</span><span class='opupdatebutton'>Update time Now</li>");
}                                     
                                    })
                            }else{
                                     $("#openprojectworkslist").append('<li data-id="' +
                                v.id +
                                '" class="openprojectworkslistitem opworkslistitemtype' + v._links.type.title.replace(/ /ig, "").toLowerCase() + ' opworkslistitemstatus' + v._links.status.title.replace(/ /ig, "").toLowerCase() + '"><a class="opitemsubject">' +
                                v.subject + '</a> <a class="opitemtypetitle"><b class="opicon">&#8859;</b>' + v._links.type.title.replace(/ /ig, "") + '</a> <a class="opitemstatustitle"><b class="opicon">&#9734;</b>' + v._links.status.title.replace(/ /ig, "") +
                                "</a></li>");
                            }
                            

                        });
                });
        }

        if (window.location.href.split("openproject.fingent.net").length == 1) {
            $("body").append('<div id="opbox"><input type="checkbox" id="opmenu-toggle"/><label id="optrigger" for="opmenu-toggle"></label><label id="opburger" for="opmenu-toggle"></label></div>')
            request("v3/my_preferences",
                "GET",
                {},
                function(result) {
                    if (result._links.user.href.split("/").length > 3) {
                        myUserId = result._links.user.href.split("/")[4];
                        listallworkpackages();


                    }

                });

            request("experimental/users?status=all",
                "GET",
                {},
                function(result) {

                    $("body").append("");

                });
        }

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