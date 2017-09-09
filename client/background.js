var ws = new WebSocket("ws://127.0.0.1:5678/");
ws.onopen = function(){
    //ws.send(JSON.stringify({'msgid':'greet', 'body':'hello'}));
    msg={'msgid':'login', 'option':{'anonymous': true}, 'body':{'currentpage':'www.baidu.com'}};
    ws.send(JSON.stringify(msg));
};

var getAndSendUrl=function(){    
        var queryInfo = {
          active: true,
          currentWindow: true
        };      
        chrome.tabs.query(queryInfo, function(tabs) {          
          var tab = tabs[0]; 
          var url = tab.url; 
          var data = {'msgid':'history', 'option':{'input':'true'},'body':{'url':url}};    
          ws.send(JSON.stringify(data));
        });
};
setInterval(10000,getAndSendUrl);

