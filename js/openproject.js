(function ($) {
    localStorage.timetoescapeupdated = "";
    var datetimestarts = new Date();
    var keep = function (key, value) {
        chrome.runtime.sendMessage({ method: "OPputDataByKey", value: value, key: key },
          function (response) {

          });
    };
    var peek = function (key, callback) {
        chrome.runtime.sendMessage({ method: "OPgetDataByKey", key: key },
           function (response) {

               callback(response);

           });

    };

    function peekandsettime() {
        peek("currentUserActivities", function (result) {
            var datetimenow = new Date();
            $("#time_entry_hours").closest("div").find(".timedetails").remove();
            var filtereddata = [];
            var reporteddate = new Date($("#time_entry_spent_on").val());
            var day = reporteddate.getDate();
            var monthNo = reporteddate.getMonth();
            var year = reporteddate.getFullYear()
            
            result = result.filter(function (v, i) {
                var thisdate = new Date(v.date);
                var thisday = thisdate.getDate();
                var thismonthNo = thisdate.getMonth();
                var thisyear = thisdate.getFullYear()
                if (thisday == day && thismonthNo == monthNo && thisyear == year)
                {
                    return v.state == "active" || v.state == "locked";
                }
                return false;
            });
            var todaysdatestring=(monthNo+1)+"-"+day+"-"+year;
            var lastdate = new Date(todaysdatestring);
          
             var laststatusname = "locked";
            var objecti = 0;
            
            var totaltimespend = 0;
            var totaltimeinterval = 0;
           
            var nowday = datetimenow.getDate();
            var nowmonthNo = datetimenow.getMonth();
            var nowyear = datetimenow.getFullYear()
            if(nowday==day&&nowmonthNo==monthNo&&nowyear==year)
            {
                result.push({state:"active", date:datetimenow.toString()});
            }
            else
            {
                var dayend=reporteddate;
                dayend.setHours(23);
                dayend.setMinutes(59);
                dayend.setSeconds(59);
                result.push({ state: "locked", date: dayend });
            }

            /////This is Just for end the loop
            result.push({ state: "end", date: datetimenow.toString() });
            
            $.each(result, function (i, v) {
                var thisdate = new Date(v.date);
                var allowtosetlastdate = true;
                    ////if (thisdate - lastdate <= 60000)
                    ////{
                    ////    lastdate = secondlastdate;
                    ////    laststatusname = secondlaststatusname;
                    ////    laststatus=secondlaststatus;
                    ////}
                    
                    if (laststatusname == v.state) {
                        allowtosetlastdate = false;
                    }
                    else {
                        ////If less than 1 minute
                            filtereddata[objecti]={from:lastdate, to:thisdate, state:laststatusname};
                            objecti++;
                            if(laststatusname=="active")
                            {
                                totaltimespend+=thisdate-lastdate;
                            }
                            else
                            {
                                totaltimeinterval+=thisdate-lastdate;
                            }
                      
                    }
                    ////if(filtereddata.length==0||(filtereddata[filtereddata.length-1].active!=v.active))
                    ////{
                    ////    filtereddata.push(v);
                    ////}


                
                if (allowtosetlastdate)
                {
                   
                    lastdate = thisdate;
                    laststatusname = v.state;
                }
            });
           
            debugger
            

            $("#time_entry_hours").closest("div").append("<div class='timedetails'><div class='timelog'></div><div class='timelogsummary'></div></div>");
            $.each(filtereddata, function (i, v) {

                var diffMs = v.to - v.from;
                /////diffMs = diffMs - timetoescape;
                var diffDays = Math.floor(diffMs / 86400000); // days
                var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
                var diffMins = Math.round(((diffMs % 86400000) % 3600000)
                / 60000); // minutes

                var timestring = v.from.getHours() + ":" + v.from.getMinutes() + " to " + v.to.getHours() + ":" + v.to.getMinutes()

                $(".timedetails .timelog").append(`<div class="timelogbox" data-timefrom="${v.from.getHours() + ":" + v.from.getMinutes()}" data-timeto="${v.to.getHours() + ":" + v.to.getMinutes()}"  data-timespend="${diffMs}"><p>${timestring} ${v.state} - ( ${diffHrs} : ${diffMins} )</p>
                    <select class='changestatusoftime'>
                    <option value='1'>Working on ${$(".form--field-instructions").text()} </option>
                    <option value='2'>Working on other projects </option>
                    <option value='3'>Launch Time </option>
                    <option value='4'>Coffee Time </option>
                    <option value='5'>Meetings </option>
                    <option value='6'>At Home</option>
                    <option value='7'>Playing Games</option>
                    </select></div>`);
                var lastselectbox = $(".timedetails .timelog").find(".changestatusoftime:last");
                var daynoonstart = new Date(todaysdatestring);
                daynoonstart.setHours(12);
                daynoonstart.setMinutes(00);
                daynoonstart.setSeconds(00);
                var daynoonend = new Date(todaysdatestring);
                daynoonend.setHours(15);
                daynoonend.setMinutes(30);
                daynoonend.setSeconds(00);
                
                
                
                if(v.state=="locked"&&diffHrs>6)
                {
                    lastselectbox.val(6);
                }else
                if (v.state == "locked" && (diffHrs < 2 && (diffHrs >= 1 || (diffHrs == 0 && diffMins >= 10))) && v.from >= daynoonstart && v.to <= daynoonend) {
                    lastselectbox.val(3);
                }else
                if(v.state=="locked"&&
                    (diffHrs<1&&(diffHrs>=1||(diffHrs==0&&diffMins>=10)))&&
                    v.from<daynoonstart&&
                    v.to>daynoonend)
                {
                    lastselectbox.val(4);
                }
                else
                if (v.state == "locked" && ((diffHrs >= 1 || (diffHrs == 0 && diffMins >= 10))))
                {
                    lastselectbox.val(5);
                }

                lastselectbox.trigger("change");
            });

            peek("changedUserActivities",
                function (changedUserActivities)
                {
                    debugger;
                    if (changedUserActivities) {
                        $.each(changedUserActivities,
                            function (changeddetailsi, changeddetails)
                            {
                                var element=$(".timelogbox[data-timespend="+
                                    changeddetails.timespend+
                                    "][data-timefrom="+
                                    changeddetails.timefrom+
                                    "][data-timeto="+
                                    changeddetails.timetoss+
                                    "] .changestatusoftime");
                                element
                                    .val(changeddetails.value).trigger("change")
                                if(changeddetails.disabled)
                                {
                                    element.after("<p>" + changeddetails.text + "</p>");
                                    element.remove();
                                }
                            })


                    }
                });

            // // var currentTime = (new Date()).getTime();

            // // var diffMs = datetimenow - starttimeindate;
            // // diffMs = diffMs - timetoescape;
            // // var diffDays = Math.floor(diffMs / 86400000); // days
            // // var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
            // // var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes


            // // $("#time_entry_hours").closest("div").append("<div class='timedetails'><br/><br/><p style='width:100%'>Time Spend = " + diffHrs + ":" + diffMins + "</p><div></div><p style='width:100%'>Intervals = " + Math.floor((timetoescape % 86400000) / 3600000) + ":" + Math.round(((timetoescape % 86400000) % 3600000) / 60000) + "</p></div>");

            // // $("#time_entry_hours").val((diffHrs + parseFloat((diffMins / 60).toFixed(2))).toFixed(2));



        });
    }
    if ($("#time_entry_hours").length > 0) {
        peekandsettime();
        setInterval(function () {
            peekandsettime();
        }, 10000);
        $("body").on("click", "#new_time_entry [type=submit]", function () {

            localStorage.setItem("lasttimeupdate", datetimenow);
            localStorage.setItem("timetoescape", 0);
        });
        $("body")
            .on("keyup blur",
                "#time_entry_hours",
                function(e)
                {
                    if(e.originalEvent)
                    {
                        if($(this).val())
                        {
                            $("#time_entry_hours").removeAttr("data-processed-by-op");
                        }
                    }
                });
        function isEmpty(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }

            return JSON.stringify(obj) === JSON.stringify({});
        }
        function changeactivity(th)
        {
            peek("changedUserActivities",
                function (result) {
                    if (result&&result.length > 70) {
                        result.splice(0, result.length - 70);
                    }
                    if (!result) {
                        result = [];
                    }
                    var reporteddate = $("#time_entry_spent_on").val();
                    result.push({
                        timespend: th.closest(".timelogbox").attr("data-timespend"),
                        timefrom: th.closest(".timelogbox").attr("data-timefrom"),
                        timeto: th.closest(".timelogbox").attr("data-timeto"),
                        value: th.val(),
                        text: th.find("option:selected").text(),
                        date: reporteddate,
                        disabled: th.prop("disabled")
                    });
                    keep("changedUserActivities", result)
                });
        }
        $("body")
            .on("change",
                ".timelogbox .changestatusoftime",
                function(e)
                {
                    if(e.originalEvent)
                    {
                        changeactivity($(this));
                    }
                    $(this).closest(".timelogbox").attr("data-statuscolor", $(this).val());
                    $(".timedetails .timelogsummary").html("");
                    $(".timelogbox").each(function()
                    {
                        var timespend = parseInt($(this).attr("data-timespend"));
                        var exist = $(".timedetails .timelogsummary .timelogbox[data-statuscolor=" + $(this).find(".changestatusoftime").val() + "]")
                        if(exist.length>0)
                        {
                            var existtimespend = parseInt(exist.attr("data-timespend"));
                            timespend += existtimespend;
                            exist.remove();
                        }
                        var diffDays = Math.floor(timespend / 86400000); // days
                        var diffHrs = Math.floor((timespend % 86400000) / 3600000); // hours
                        var diffMins = Math.round(((timespend % 86400000) % 3600000)
                            / 60000); // minutes
                        $(".timedetails .timelogsummary").append(`<div class="timelogbox" data-timespend="${timespend}" data-statuscolor="${$(this).find(".changestatusoftime").val()}"><p>${$(this).find(".changestatusoftime option:selected").text()} -  ${diffHrs} Hours : ${diffMins} Minutes</p></div>`);
                    });
                   
                    var timespendforthistask = parseInt($(".timedetails .timelogsummary .timelogbox[data-statuscolor=1]").attr("data-timespend"));
                    var diffDays = Math.floor(timespendforthistask / 86400000); // days
                    var diffHrs = Math.floor((timespendforthistask % 86400000) / 3600000); // hours
                    var diffMins = Math.round(((timespendforthistask % 86400000) % 3600000)
                        / 60000); // minutes
                    if (!$("#time_entry_hours").val() || $("#time_entry_hours").attr("data-processed-by-op"))
                    {
                        $("#time_entry_hours").attr("data-processed-by-op", true);
                        $("#time_entry_hours").val((diffHrs+parseFloat((diffMins/60).toFixed(2))).toFixed(2));
                    }
                });
    }
})(myjQuery);