



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  
  if (request.method =="OPputDataByKey")
  {
    var obj = {};
    obj[request.key] = request.value;
    chrome.storage.sync.set(obj,
      function () {
        ////sendResponse(request);
      });
  } 
  if (request.method == "OPgetDataByKey") {
    chrome.storage.sync.get([request.key], function (result)
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
chrome.storage.sync.get("currentUserActivities", function (result) {
  if(!isEmpty(result)){
    currentUserActivitiesList= result.currentUserActivities;
    if(currentUserActivitiesList.length>70){
      currentUserActivitiesList.splice(0,currentUserActivitiesList.length-70);
    }
  }
  currentUserActivitiesList.push({state:"active",date:dateNow});
chrome.storage.sync.set({ currentUserActivities: currentUserActivitiesList }, function () {
  
});

});

var currentStorageDetals=
chrome.idle.onStateChanged.addListener(function(state) {
 
  if(state != 'idle'){
  chrome.storage.sync.get("currentUserActivities", function (result) {
    dateNow=new Date().toString();
    if(result.currentUserActivities.length>70){
      result.currentUserActivities.splice(0,result.currentUserActivities.length-70);
    }
  result.currentUserActivities.push({date:dateNow,state:state});
     console.log(result.currentUserActivities);

    chrome.storage.sync.set({ currentUserActivities: result.currentUserActivities }, function () {
      
    });
    });
  }
})
chrome.idle.queryState(60, function(state){
  console.log('queryState');
  console.log(state);
});
