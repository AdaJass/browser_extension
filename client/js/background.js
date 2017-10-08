var ws = new WebSocket("ws://127.0.0.1:5678/");
var Contact_List={};
var Chat_Tab = {};   //{'chat_customer_id': tabid, ....}
var Customer_id = None;

ws.onopen = function(){
    //ws.send(JSON.stringify({'msgid':'greet', 'body':'hello'}));

    /*first load the customer infomation from lacalstorage, if there isn't. Popup a login 
      dialog from contentscript.
    */
    msg={'msgid':'login', 'anonymous': true};
    ws.send(JSON.stringify(msg));
};

var getAndSendUrl=function(){    
        var queryInfo = {
          active: true,
          currentWindow: true
        };      
        chrome.tabs.query(queryInfo, function(tabs) {          
          var tab = tabs[0];
          //console.log(tabs.length()) 
          console.log(JSON.stringify(tab))
          var url = tab.url; 
          var data = {'msgid':'history', 'input':'true','body':url, 'duration': 'true'};    
          ws.send(JSON.stringify(data));
        });
};
setInterval(getAndSendUrl,60000);

/*--------------------Event listener---------------------*/
chrome.tabs.onUpdated.addListener(function(tabid, changeinfo){
  if(changeinfo.url){
    var data = {'msgid':'history', 'input':'true','body': changeinfo.url};    
    ws.send(JSON.stringify(data));
  }
});

chrome.tabs.onActivated.addListener(function(info){
  chrome.tabs.get(info.tabId, function(tab){
    var data = {'msgid':'contactable', 'body': tab.url, 'tabid':info.tabId};
    ws.send(JSON.stringify(data));
  });  
});

/*----------------------respone to tab message.----------------*/
chrome.runtime.onMessage.addListener(
  function(msg, sender) {
    if(msg.msgid == 'chat'){
        Chat_Tab[msg.from] = sender.tab.id;
        ws.send(JSON.stringify(msg));
    }
    // chrome.tabs.sendMessage(sender.tab.id, {greeting: "background say hello"});
});

/*---------------------respone to server message---------------*/
function recHistory(msg){

}

function recProfile(msg){

}

function recCustomer(msg){

}

function recDescription(msg){

}

function recProblem(msg){

}

function recChat(msg){  
  var tab = Chat_Tab[msg.to];
  chrome.tabs.sendMessage(tab, msg);
}

function recContactable(msg){
  chrome.tabs.sendMessage(msg.tabid, msg);
}

function loginsucceed(msg){
  Customer_id =msg.customerid;
  chrome.runtime.sendMessage({ msgid: 'loginsucceed' , customerid: Customer_id});
}

operation={
  'history': recHistory,
  'profile': recProfile,
  'customer':recCustomer,
  'description':recDescription,
  'problem':recProblem,
  'chat': recChat,
  'contactable': recContact,
  'loginsucceed': loginsucceed
};

ws.onmessage = function(msg){
  var mesg = JSON.parse(msg);
  operation[mesg['msgid']](mesg) 
}

////////////////////////////////////////////////////////////////////////
/*--------------------popuo.js------------------------*/
// var setContactList = function(){
//   if(!Contact_List.friends){  
//     var data = {'msgid':'contactable'};    
//     ws.send(JSON.stringify(data));
//   }
// }