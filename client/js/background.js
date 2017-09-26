var ws = new WebSocket("ws://127.0.0.1:5678/");
var Contact_List={};
var Chat_Tab = {};

ws.onopen = function(){
    //ws.send(JSON.stringify({'msgid':'greet', 'body':'hello'}));

    /*first load the customer infomation from lacalstorage, if there isn't. Popup a login 
      dialog from contentscript.
    */
    msg={'msgid':'login', 'option':{'anonymous': true}, 'body':{'currentpage':'www.bai.com'}};
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
          var data = {'msgid':'history', 'input':'true','body':url};    
          ws.send(JSON.stringify(data));
        });
};
setInterval(getAndSendUrl,10000);

chrome.tabs.onUpdated.addListener(function(tabid, changeinfo){
  if(changeinfo.url){
    var data = {'msgid':'history', 'input':'true','body': changeinfo.url};    
    ws.send(JSON.stringify(data));
  }
});


function _history(msg){

}

function profile(msg){

}

function customer(msg){

}

function description(msg){

}

function problem(msg){

}

function chat(msg){  
  var tab = Chat_Tab[msg.to];
  chrome.tabs.sendMessage(tab, msg);
}

function get_contact(msg){
  
}



operation={
  'history': _history,
  'profile': profile,
  'customer':customer,
  'description':description,
  'problem':problem,
  'chat':chat,
  'contactable': get_contact,
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