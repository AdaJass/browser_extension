var port = chrome.runtime.connect({name: "currentpage"});
port.postMessage({current_page: "Knock knock"});
var last_pagecontact=[]
// setInterval(function(){port.postMessage({current_page: 1});}, 1500);

port.onMessage.addListener(function(msg) {
    var pagecontact = msg.pagecontact
    if(pagecontact && (pagecontact.toString() != last_pagecontact.toString())){
        //here reinsert to page. 
        last_pagecontact = pagecontact;             
    }
    if (msg.barrager){        
        alert('front receive msg.');        
    }
    
    if (msg.login){
        alert(9);
    }
    if (msg.chatWindow){
        alert(8);
    }
    if (msg.chatting){
        alert(7);
    }    
});


