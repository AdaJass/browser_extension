var ws = new WebSocket("ws://192.168.1.53:5678/");
var Friends_List={};
var Chat_Tab = {};   //{'chat_customer_id': tabid, ....}
var Customer_id = null;
var Tab_Url_dict = {};

ws.onopen = function(){
    //ws.send(JSON.stringify({'msgid':'greet', 'body':'hello'}));

    /*first load the customer infomation from lacalstorage, if there isn't. Popup a login 
      dialog from contentscript.
    */
    // msg={'msgid':'login', 'anonymous': true};
    var cusid = prompt("请输入id:","3");    
    msg = {'msgid':'login', 'password':'test1234', 'customerid': cusid};
    ws.send(JSON.stringify(msg));    
};
var queryInfo = {
  active: true,
  currentWindow: true
};  

var getAndSendUrl=function(){            
  chrome.tabs.query(queryInfo, function(tabs) {          
    var tab = tabs[0];
    //console.log(tabs.length()) 
    console.log(JSON.stringify(tab))
    var url = tab.url; 
    Tab_Url_dict[tab.id] = url;
    var data = {'msgid':'history', 'input':'true','body':url, tabid: tab.id, 'duration': 'true'};    
    ws.send(JSON.stringify(data));
  });
};
setInterval(getAndSendUrl,30000);

/*--------------------Event listener---------------------*/
chrome.tabs.onUpdated.addListener(function(tabid, changeinfo){
  chrome.tabs.get(tabid, function(tab){Tab_Url_dict[tabid] = tab.url;});
  if(changeinfo.url){
    var data = {'msgid':'history', 'input':'true','body': changeinfo.url};    
    ws.send(JSON.stringify(data));
  }
});

chrome.tabs.onActivated.addListener(function(info){
  chrome.tabs.get(info.tabId, function(tab){
    Tab_Url_dict[tab.id] = tab.url;
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
    // alert(msg);
    if(msg.msgid == 'chat'){
        Chat_Tab[msg.roomid] = sender.tab.id;
        ws.send(JSON.stringify(msg));
    }
    if(msg.msgid == 'friendlist'){
      var messg = {msgid:'friendlist', body: Friends_List}
      chrome.tabs.sendMessage(sender.tab.id, messg);
    }
    if(msg.msgid=='barrager'){
      msg.customerid = Customer_id;
      console.log(JSON.stringify(msg));
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

function recBarrager(msg){
  var psa = document.createElement('a');
  var psb = document.createElement('a');
  for(var t in Tab_Url_dict){
    psa.href = Tab_Url_dict[t];
    psb.href = msg.url;
    if(psa.host == psb.host&& psa.pathname == psb.pathname){
      chrome.tabs.sendMessage(parseInt(t), msg);
    }
  }

      
}

function recChat(msg){ 
  // alert(JSON.stringify(msg)); 
  var tabid = Chat_Tab[msg.roomid];
  if(tabid){
    chrome.tabs.sendMessage(tabid, msg);
  }else{
    chrome.tabs.query(queryInfo,function(tabs){
      var tab=tabs[0];
      chrome.tabs.sendMessage(tab.id, msg);
    });
  }
}

function recContactable(msg){
  // Friends_List = msg.body.friends;
  chrome.tabs.sendMessage(msg.tabid, msg);
}

function loginsucceed(msg){  
  alert(JSON.stringify(msg));
  var data = {'msgid':'contactable'};    
  ws.send(JSON.stringify(data));  
  Customer_id =msg.customerid;
  Friends_List = msg.friends;
}

function printerror(msg){
  alert(JSON.stringify(msg));
}

operation={
  'history': recHistory,
  'profile': recProfile,
  'customer':recCustomer,
  'description':recDescription,
  'problem':recProblem,
  'chat': recChat,
  'barrager':recBarrager,
  'contactable': recContactable,
  'loginsucceed': loginsucceed,
  'error': printerror
};

ws.onmessage = function(msg){ 
  // alert(msg.data); 
  var mesg = JSON.parse(msg.data);
  operation[mesg['msgid']](mesg) 
}

////////////////////////////////////////////////////////////////////////
/*--------------------popuo.js------------------------*/
