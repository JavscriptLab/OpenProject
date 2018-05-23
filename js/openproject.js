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
var splittimevalue="09:00";
    function peekandsettime(callback,stopfillactivitydate) {
        peek("timedetailsdefaulttheme",
        function (timedetailsdefaulttheme)
        {
           
            peek("currentUserActivities", function (result) {
            var datetimenow = new Date();
            $("#time_entry_hours").closest("div").find(".timedetails").remove();
            var filtereddata = [];
            var reporteddate = new Date($("#time_entry_spent_on").val());
            var day = reporteddate.getDate();
            var monthNo = reporteddate.getMonth();
            var year = reporteddate.getFullYear()
            result = result.sort(function (a,b) {
                var adate = new Date(a.date);
                var bdate = new Date(b.date);
                return adate>bdate?1:adate<bdate?-1:0;
            });
            
            result = result.filter(function (v, i) {
                var thisdate = new Date(v.date);
                var thisday = thisdate.getDate();
                var thismonthNo = thisdate.getMonth();
                var thisyear = thisdate.getFullYear()
                if (thisday == day && thismonthNo == monthNo && thisyear == year)
                {
                    return v.state == "active" || v.state == "recorded" || v.state == "locked";
                }
                return false;
            });
            if(result&&result.length>0){
            var todaysdatestring=(monthNo+1)+"-"+day+"-"+year;
            var lastdate = new Date(todaysdatestring);
          
             var laststatusname = "locked";
            var objecti = 0;
            
            ////var totaltimespend = 0;
            ////var totaltimeinterval = 0;
           
            var nowday = datetimenow.getDate();
            var nowmonthNo = datetimenow.getMonth();
            var nowyear = datetimenow.getFullYear()
            if(nowday==day&&nowmonthNo==monthNo&&nowyear==year)
            {
                if(result[result.length-1].state!="active"){
                result.push({state:"active", date:datetimenow.toString()});
                }
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
                    if(i!=0){
                            filtereddata[objecti]={from:lastdate, to:thisdate, state:laststatusname};
                            objecti++;
                            ////if(laststatusname=="active")
                            ////{
                            ////    totaltimespend+=thisdate-lastdate;
                            ////}
                            ////else
                            ////{
                            ////    totaltimeinterval+=thisdate-lastdate;
                            ////}
                      
                    }
                    ////if(filtereddata.length==0||(filtereddata[filtereddata.length-1].active!=v.active))
                    ////{
                    ////    filtereddata.push(v);
                    ////}
                    lastdate = thisdate;
                    laststatusname = v.state;
                
            });
           
        
            

            $("#time_entry_hours").closest("div").append(`<div class='timedetails timedetailsmodtheme'><div class='timedetailshead'><div class='timeloghead pad10'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>Activities<div class="templateselector"> <select class='changetheme'>
        <option value='pro'>Professional Theme</option>
        <option value='mod' selected>Modern Theme</option>
        </select></div></div><div class='timelogsummaryhead pad10'><svg fill="white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>Summary</div><div class='timelogoptionshead pad10'><svg fill="white" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <path fill="none" d="M0 0h20v20H0V0z"/>
    <path d="M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
</svg>Options</div></div><div class='timedetailsbody'><div class='timelog pad10'></div><div class='timelogsummary pad10'></div><div class='timelogoptions pad10'><div class='timedetailsformgroup'><label>Any Time Updations/Split time in records</label><input type='time' id='splittime' value='${splittimevalue}'/></div><div class='timedetailsformgroup'><label>What was the status</label><select id='splittimestatus'><option >Active</option><option >Inactive</option></select></div><div class='timedetailsformgroup pad10'><button class="button -highlight" type='button' id="splittimego">Change time details</button><p>If you set lock/inactive manually, you must manually unlock/active, otherwise computer lock events will not work on lock/shutdown pc</p></div></div></div></div>`);
if(timedetailsdefaulttheme){
    $(".templateselector .changetheme").val(timedetailsdefaulttheme).trigger("change");
    }
            $.each(filtereddata, function (i, v) {

                var diffMs = v.to - v.from;
                /////diffMs = diffMs - timetoescape;
                var diffDays = Math.floor(diffMs / 86400000); // days
                var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
                var diffMins = Math.round(((diffMs % 86400000) % 3600000)
                / 60000); // minutes

                var timestring = (v.from.getHours()>12?v.from.getHours()-12+":" + (v.from.getMinutes()<=9?"0"+v.from.getMinutes().toString():v.from.getMinutes())+" PM":v.from.getHours()+":" + (v.from.getMinutes()<=9?"0"+v.from.getMinutes().toString():v.from.getMinutes())+" AM" ) + "<br/> to <br/>" + (v.to.getHours()>12?v.to.getHours()-12+":" + (v.to.getMinutes()<=9?"0"+v.to.getMinutes().toString():v.to.getMinutes())+" PM":v.to.getHours()+":" + (v.to.getMinutes()<=9?"0"+v.to.getMinutes().toString():v.to.getMinutes())+" AM");
                v.state=v.state=="recorded" ? "active" : v.state;
                v.state=v.state=="locked" ? "inactive" : v.state;
var inactivetext=`<svg title="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
<path fill="none" d="M0 0h24v24H0V0z"/>
<path d="M23 16c0 1.1-.9 2-2 2h-1l-2-2h3V4H6L4 2h17c1.1 0 2 .9 2 2v12zm-5.5 2l-2-2zm-2.6 0l6 6 1.3-1.3-4.7-4.7-2-2L1.2 1.8 0 3.1l1 1V16c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h.9zM3 16V6.1l9.9 9.9H3z"/>
</svg>`;
var activetext=`<svg xmlns="http://www.w3.org/2000/svg" title=""  width="24" height="24" viewBox="0 0 24 24">
<path d="M0 0h24v24H0z" fill="none"/>
<path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
</svg>`;


                $(".timedetails .timelog").append(`<div  data-status="${v.state}" class="timelogbox pad10" data-timefrom="${v.from.getHours() + ":" + v.from.getMinutes()}" data-timeto="${v.to.getHours() + ":" + v.to.getMinutes()}"  data-timespend="${diffMs}"><div class="timeline-icon "><p class="timeline-iconcontent">${timestring}</p></div>
                <div class="timeline-content" title="${v.state=="active"?"You were active in this PC":"You were not active in this PC"}">
                <p class="timeline-title">${v.state=="active"?activetext:inactivetext}<span class="timlinetimespan"> ${diffHrs < 10?"0"+diffHrs.toString():diffHrs}H : ${diffMins < 10?"0"+diffMins.toString():diffMins}M </span></p>
                    <select class='changestatusoftime'>
                    <option value='1'>Working on ${$(".form--field-instructions").text()} </option>
                    <option value='2'>Working on other projects </option>
                    <option value='3'>Lunch Time </option>
                    <option value='4'>Coffee Time </option>
                    <option value='5'>Meetings </option>
                    <option value='6'>At Home</option>
                    <option value='7'>Playing Games</option>
                    </select></div></div>`);
                var lastselectbox = $(".timedetails .timelog").find(".changestatusoftime:last");
                var daynoonstart = new Date(todaysdatestring);
                daynoonstart.setHours(12);
                daynoonstart.setMinutes(00);
                daynoonstart.setSeconds(00);
                var daynoonend = new Date(todaysdatestring);
                daynoonend.setHours(15);
                daynoonend.setMinutes(30);
                daynoonend.setSeconds(00);
                
                
                if(v.state=="inactive"&&diffHrs>6)
                {
                    lastselectbox.val(6);
                }else
                if (v.state == "inactive" && (diffHrs < 2 && (diffHrs >= 1 || (diffHrs == 0 && diffMins >= 10))) && v.from >= daynoonstart && v.to <= daynoonend) {
                    lastselectbox.val(3);
                }else
                if(v.state=="inactive"&&
                    (diffHrs<1&&(diffHrs>=1||(diffHrs==0&&diffMins>=10)))&&
                    v.from<daynoonstart&&
                    v.to>daynoonend)
                {
                    lastselectbox.val(4);
                }
                else
                if (v.state == "inactive" && ((diffHrs >= 1 || (diffHrs == 0 && diffMins >= 10))))
                {
                    lastselectbox.val(5);
                }else
                if(stopfillactivitydate&&v.to>stopfillactivitydate)
                {
                    lastselectbox.val(2);
                }

                lastselectbox.trigger("change");
                
            });
           
            peek("changedUserActivities",
                function (changedUserActivities)
                {
                    
                    if (changedUserActivities) {
                        $.each(changedUserActivities,
                            function (changeddetailsi, changeddetails)
                            {
                                var element=$(".timelogbox[data-timespend='"+
                                    changeddetails.timespend+
                                    "'][data-timefrom='"+
                                    changeddetails.timefrom+
                                    "'][data-timeto='"+
                                    changeddetails.timeto+
                                    "'] .changestatusoftime");

if(changeddetails.value=="2"){
    changeddetails.value=1;
}

                                element
                                    .val(changeddetails.value).trigger("change")
                                if(changeddetails.disabled&&element.length>0)
                                {
                                    element.closest(".timelogbox").attr("data-disabled",true);
                                    element.after("<p title='"+changeddetails.text+"'>" + changeddetails.text + "</p>");
                                    element.closest(".timelogbox").trigger("changedtime");
                                    element.remove();
                                    
                                }
                            })


                    }
                    
                    if(callback)
                    {
                        
                        callback();
                    }
                    if($(".templateselector .changetheme").val()=="mod"){
                    $(".timedetails .timelog .timelogbox").each(function(){
                        $(this).find(".timeline-content").css("margin",($(this).outerHeight()-$(this).find(".timeline-content").outerHeight())/2+"px -3px");
                    })
                }
                });
            }else{
                if(callback)
                    {
                        
                        callback();
                    }
            }


        });
    });
    }

    var activateinterval=true;
    if ($("#time_entry_hours").length > 0) {
        $("body").on("mouseenter",".timedetails",function ()
        {
            activateinterval=false;
        }) 
        $("body").on("mouseleave",".timedetails",function () {
            activateinterval = true;
        });
        peekandsettime();
        setInterval(function () {
            if(activateinterval)
            {
             ////   peekandsettime();
            }
        }, 10000);
        
        $("body").on("change", "#splittime", function (e)
        {
            splittimevalue=$("#splittime").val();
        });

        $("body").on("click", "#splittimego", function (e)
        {
            if($("#splittime").val()){
                var reporteddate = $("#time_entry_spent_on").val();
var seleteddate=new Date(reporteddate+" "+$("#splittime").val());
// // var datenow=new Date(reporteddate);
// // datenow.setHours(seleteddate.getHours());
// // datenow.setMinutes(seleteddate.getMinutes());
peek("currentUserActivities",
function(currentUserActivitiesList)
{currentUserActivitiesList.push({state:$("#splittimestatus").val()=="Active"?"active":"locked", date:seleteddate.toString()});
    keep("currentUserActivities", currentUserActivitiesList);
    peekandsettime();
});
}
        });
        $("body").on("submit", "#new_time_entry", function (e)
        {
            try{
            if($("#time_entry_hours").val()&&$("#time_entry_spent_on").val()){
            if(e.originalEvent)
            {
                $(this).find("[type=submit]").hide();
                e.preventDefault();
                activateinterval=false;
                var currentUserActivitiesList=[];

                peek("changedUserActivities",
                    function(result)
                    {
                       
                        peek("currentUserActivities",
                            function(currentUserActivities)
                            {
                               var currentUserActivitiesList=currentUserActivities;
                               var time = $("#time_entry_hours").val();
                               var timeParts = time.split(".");
                             if(!timeParts[1]){
                                timeParts[1]=0;
                             }
                                var allowedmilliseconds=(+timeParts[0] * (60000 * 60)) + (+(timeParts[1]*60/100) * 60000);
                                
                                var reportedtime = new Date($("#time_entry_spent_on").val()+" 00:00");
                               var idfoundreportedtime=false;
                                var timeussed=0;
                                $(".timedetails .timelog .timelogbox[data-statuscolor=1]:not([data-disabled])")
                                .each(function()
                                {
                                    if(!idfoundreportedtime){
                                    var whatthelasttimeinseconds=timeussed;
                                   timeussed+=parseInt($(this).attr("data-timespend"));
                                   if(timeussed>allowedmilliseconds){
                                    var secondstoincrease=allowedmilliseconds-whatthelasttimeinseconds;
                                    idfoundreportedtime=true;

                                    reportedtime = new Date($("#time_entry_spent_on").val()+" "+$(this).attr("data-timefrom"));
                                    reportedtime.setMilliseconds(secondstoincrease);
                                    return true;
                                   }
                                }
                                });
                                if(!idfoundreportedtime){
                                reportedtime= new Date();
                            }
                                
                                currentUserActivitiesList.push({state:"active", date:reportedtime.toString()});
                                keep("currentUserActivities", currentUserActivitiesList);
                                peekandsettime(function()
                                {
                                    setTimeout(function()
                                        {
                                        
                                            $(".timedetails .timelog .timelogbox[data-statuscolor=1] .changestatusoftime")
                                                .each(function()
                                                {
                                                    $(this).prop("disabled", true);
                                                    if(result&&result.length>500){
                                                        result.splice(0,result.length-500);
                                                      }
                                                      if (!result){
                                                        result=[];
                                                     }
                                                    changeactivity($(this), result);
                                                });
                                            keep("changedUserActivities", result);
                                            setTimeout(function()
                                                {
                                                    $("#new_time_entry").submit();
                                                    $("#new_time_entry").find("[type=submit]").show();
                                                },
                                                500);
                                        },
                                        500);
                                },reportedtime);
                            });
                    });
            }
        }
    }
    catch(e){
        $("#new_time_entry").submit();
    }
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
        function changeactivity(th, result)
        {if(th.length>0){
            activateinterval = false;
            
            if (result && result.length > 500) {
                result.splice(0, result.length - 500);
                    }
                     if (!result){
                        result=[];
                     }
                    var reporteddate = $("#time_entry_spent_on").val();
                    result.push({
                        timespend: th.closest(".timelogbox").attr("data-timespend"),
                        timefrom: th.closest(".timelogbox").attr("data-timefrom"),
                        timeto: th.closest(".timelogbox").attr("data-timeto"),
                        value: th.val(),
                        text: th.find("option:selected").text().replace("Working on ",""),
                        date: reporteddate,
                        disabled: th.prop("disabled")
                    });
                    
                    activateinterval = true;
                }
        }
        $("body")
        .on("change blur",
            "#time_entry_spent_on",
            function(e)
            {
                var th=$(this);
               setTimeout(function(){ if(th.val()){
peekandsettime();
}
},2000)
            })

            var changestatus=function(e,th){
                if(e.originalEvent)
                    {
                        peek("changedUserActivities",
                            function(result)
                            {
                                if (!result) {
                                result = [];
                                }
                                if (result && result.length > 500) {
                                    result.splice(0, result.length - 500);
                                  }
                                changeactivity(th, result);
                                keep("changedUserActivities", result);
                            });
                    }
                    if(th.val()){
                        th.closest(".timelogbox").attr("data-statuscolor", th.val());
                    }
                    $(".timedetails .timelogsummary").html("");
                    $(".timelogbox").each(function()
                    {
                        var timespend = parseInt($(this).attr("data-timespend"));
                        var changedstatus = $(this).find(".changestatusoftime").val();
                        if(!changedstatus)
                        {
                            changedstatus=1;
                        }
                        
                        var exist = $(".timedetails .timelogsummary .timelogbox[data-statuscolor=" + changedstatus + "]")
                        if($(this).attr("data-disabled"))
                        {
                            exist=exist.filter("[data-disabled]");
                        }
                        else
                        {
                            exist = exist.not("[data-disabled]");
                        }
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
                       
                        if($(this).attr("data-disabled"))
                        {
                            debugger;
                            $(".timedetails .timelogsummary")
                                .append(
                                    `<div class="timelogbox pad10 timelinesummary-content" data-timespend="${timespend
                                    }" data-disabled="true" data-statuscolor="1" ><div class ="timelinesummary-contentbox">Hours Updated</div><div class="timelinesummary-contentbox timelinesummary-contentboxtime">  ${
                                    diffHrs} Hours : ${diffMins} Minutes</div></div>`);
                        }
                        else
                        {
                            $(".timedetails .timelogsummary")
                                .append(
                                    `<div class="timelogbox pad10 timelinesummary-content" data-timespend="${timespend
                                    }" data-statuscolor="${$(this).find(".changestatusoftime").val()
                                    }"><div class="timelinesummary-contentbox">${
                                    $(this).find(".changestatusoftime option:selected").text()
                                    } </div><div class="timelinesummary-contentbox timelinesummary-contentboxtime">  ${
                                    diffHrs} Hours : ${diffMins} Minutes</div></div>`);
                        }
                    });
                   
                    var timespendforthistask = parseInt($(".timedetails .timelogsummary .timelogbox[data-statuscolor=1]").not("[data-disabled]").attr("data-timespend"));
                    var diffDays = Math.floor(timespendforthistask / 86400000); // days
                    var diffHrs = Math.floor((timespendforthistask % 86400000) / 3600000); // hours
                    var diffMins = Math.round(((timespendforthistask % 86400000) % 3600000)
                        / 60000); // minutes
                    if (!$("#time_entry_hours").val() || $("#time_entry_hours").attr("data-processed-by-op"))
                    {
                        $("#time_entry_hours").attr("data-processed-by-op", true);
                        var timespend=(diffHrs+parseFloat((diffMins/60).toFixed(2))).toFixed(2);
                        if(!isNaN(timespend)){
                        $("#time_entry_hours").val(timespend);
                    }
                    }
            }
            
        $("body")
            .on("change",
                ".timedetails .changetheme",
                function(e)
                {
                    $(this).closest(".timedetails").removeClass("timedetailsmodtheme timedetailsprotheme")
                    $(this).closest(".timedetails").addClass("timedetails"+$(this).val()+"theme");
                    keep("timedetailsdefaulttheme",$(this).val());
                    if(e.originalEvent){
                    peekandsettime();
                }
                });
                $("body")
                .on("change",
                    ".timelogbox .changestatusoftime",
                    function(e)
                    {
                        changestatus(e,$(this))
                    });
                $("body")
                .on("changedtime",
                    ".timelogbox",
                    function(e)
                    {
                        changestatus(e,$(this))
                    });
    }
})(myjQuery);