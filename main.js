



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  
  if (request.method =="OPputDataByKey")
  {
    var obj = {};
    obj[request.key] = request.value;
    chrome.storage.local.set(obj,
      function () {
        ////sendResponse(request);
      });
  } 
  if (request.method == "OPgetDataByKey") {
    chrome.storage.local.get([request.key], function (result)
    {
     
     var storageresult = result[request.key];
      sendResponse(storageresult);
    });
    return true;
  } 
});
var dateNow=new Date().toString();

function isEmpty(obj) {
  for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
          return false;
  }

  return JSON.stringify(obj) === JSON.stringify({});
}
var currentUserActivitiesList=[];
chrome.storage.local.get("currentUserActivities", function (result) {
  if(!isEmpty(result)){
    currentUserActivitiesList= result.currentUserActivities;
    if (currentUserActivitiesList.length > 500) {
        currentUserActivitiesList.splice(0, currentUserActivitiesList.length - 500);
    }
  }
  var sortresults=currentUserActivitiesList.sort(function (a,b) {
    var adate = new Date(a.date);
    var bdate = new Date(b.date);
    return adate>bdate?1:adate<bdate?-1:0;
});
  var resultlength=sortresults.length;
  var allowtosetdate=true;
  if(sortresults.length>0){
  var lastdate = new Date(sortresults[resultlength-1].date);
  var day = lastdate.getDate();
  var monthNo = lastdate.getMonth();
  var year = lastdate.getFullYear()
  var lastdatestring=(monthNo+1)+"-"+day+"-"+year;
  var todaydate = new Date();
  var today = todaydate.getDate();
  var todaymonthNo = todaydate.getMonth();
  var todayyear = todaydate.getFullYear()
  var todaydatestring=(todaymonthNo+1)+"-"+today+"-"+todayyear;

if(sortresults[resultlength-1].state=="active"&&lastdatestring==todaydatestring){
allowtosetdate=false;  
}
}
if(allowtosetdate){
  currentUserActivitiesList.push({state:"active",date:dateNow});
chrome.storage.local.set({ currentUserActivities: currentUserActivitiesList }, function () {
  
});
}
});

var currentStorageDetals=
chrome.idle.onStateChanged.addListener(function(state) {
 
  if(state != 'idle'){
  chrome.storage.local.get("currentUserActivities", function (result) {
    dateNow=new Date().toString();
    if (result.currentUserActivities.length > 500) {
        result.currentUserActivities.splice(0, result.currentUserActivities.length - 500);
    }
    var sortresults=result.currentUserActivities.sort(function (a,b) {
      var adate = new Date(a.date);
      var bdate = new Date(b.date);
      return adate>bdate?1:adate<bdate?-1:0;
  });
    var resultlength=sortresults.length;
    var lastdate = new Date(sortresults[resultlength-1].date);
    var day = lastdate.getDate();
    var monthNo = lastdate.getMonth();
    var year = lastdate.getFullYear()
    var lastdatestring=(monthNo+1)+"-"+day+"-"+year;
    var todaydate = new Date();
    var today = todaydate.getDate();
    var todaymonthNo = todaydate.getMonth();
    var todayyear = todaydate.getFullYear()
    var todaydatestring=(todaymonthNo+1)+"-"+today+"-"+todayyear;
var allowtosetdate=true;
if(sortresults[resultlength-1].state==state&&lastdatestring==todaydatestring){
  allowtosetdate=false;  
}
    if(allowtosetdate)
  result.currentUserActivities.push({date:dateNow,state:state});
     console.log(result.currentUserActivities);

    chrome.storage.local.set({ currentUserActivities: result.currentUserActivities }, function () {
      
    });
    });
  }
})
chrome.idle.queryState(60, function(state){
  console.log('queryState');
  console.log(state);
});
