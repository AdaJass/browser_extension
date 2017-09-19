var port = chrome.runtime.connect({name: "currentpage"});
var last_pagecontact=[]
setInterval(function(){port.postMessage({current_page: 1});}, 1500);

port.onMessage.addListener(function(msg) {
    var pagecontact = msg.pagecontact
    if(pagecontact && (pagecontact.toString() != last_pagecontact.toString())){
        //here reinsert to page. 
        last_pagecontact = pagecontact;       
    }
    if (msg.barrager){
        
    }
    
    if (msg.login){

    }
    if (msg.chatWindow){
        
    }
    if (msg.chatting){

    }    
});


