var ws = new WebSocket("ws://127.0.0.1:5678/");
var Friends_List={};
var Chat_Tab = {};   //{'chat_customer_id': tabid, ....}
var Customer_id = None;
var Tab_Url_dict = {};

ws.onopen = function(){
    //ws.send(JSON.stringify({'msgid':'greet', 'body':'hello'}));

    /*first load the customer infomation from lacalstorage, if there isn't. Popup a login 
      dialog from contentscript.
    */
    // msg={'msgid':'login', 'anonymous': true};
    msg = {'msgid':'login', 'password':'test1234', 'customerid': 3};
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
          var data = {'msgid':'history', 'input':'true','body':url, tabid: tab.id, 'duration': 'true'};    
          ws.send(JSON.stringify(data));
        });
};
setInterval(getAndSendUrl,60000);

/*--------------------Event listener---------------------*/
chrome.tabs.onUpdated.addListener(function(tabid, changeinfo){
  if(changeinfo.url){
    Tab_Url_dict[tabid] = changeinfo.url;
    var data = {'msgid':'history', 'input':'true','body': changeinfo.url};    
    ws.send(JSON.stringify(data));
  }
});

chrome.tabs.onActivated.addListener(function(info){
  chrome.tabs.get(info.tabId, function(tab){
    if(!Friends_List.manager){
      var data = {'msgid':'contactable', 'body': tab.url, 'tabid':info.tabId };
    }else{
      var data = {'msgid':'contactable', 'body': tab.url, 'tabid':info.tabId , 'nofriend':'yes'};
    }
    ws.send(JSON.stringify(data));
  }); 
  if(Friends_List.manager){
    var messg = {msgid:'friendlist', body: Friends_List}
    chrome.tabs.sendMessage(info.tabId, messg);
  }
});

/*----------------------respone to tab message.----------------*/
chrome.runtime.onMessage.addListener(
  function(msg, sender) {
    if(msg.msgid == 'chat'){
        Chat_Tab[msg.from] = sender.tab.id;
        ws.send(JSON.stringify(msg));
    }
    if(msg.msgid == 'friendlist'){
      var messg = {msgid:'friendlist', body: Friends_List}
      chrome.tabs.sendMessage(sender.tab.id, messg);
    }
    if(msg.msgid=='barrager'){
      ws.send(msg);
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

function recBarrager(msg){
  
  
}

function recChat(msg){  
  var tab = Chat_Tab[msg.to];
  chrome.tabs.sendMessage(tab, msg);
}

function recContactable(msg){
  Friends_List = msg.body.friends;
  chrome.tabs.sendMessage(msg.tabid, msg);
}

function loginsucceed(msg){
  if(!Contact_List.manager){  
    var data = {'msgid':'contactable'};    
    ws.send(JSON.stringify(data));
  }
  Customer_id =msg.customerid;
  chrome.runtime.sendMessage({ msgid: 'loginsucceed' , customerid: Customer_id});
}

function printerror(msg){
  console.log(JSON.stringify(msg));
}

operation={
  'history': recHistory,
  'profile': recProfile,
  'customer':recCustomer,
  'description':recDescription,
  'problem':recProblem,
  'chat': recChat,
  'barrager':recBarrager,
  'contactable': recContact,
  'loginsucceed': loginsucceed,
  'error': printerror
};

ws.onmessage = function(msg){
  var mesg = JSON.parse(msg);
  operation[mesg['msgid']](mesg) 
}

////////////////////////////////////////////////////////////////////////
/*--------------------popuo.js------------------------*/
