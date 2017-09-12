var ws = new WebSocket("ws://127.0.0.1:5678/");
ws.onopen = function(){
    //ws.send(JSON.stringify({'msgid':'greet', 'body':'hello'}));
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
          var data = {'msgid':'history', 'option':{'input':'true'},'body':{'url':url}};    
          ws.send(JSON.stringify(data));
        });
};
setInterval(getAndSendUrl,10000);

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
