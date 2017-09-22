var bg_port = null;
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "currentpage");
    bg_port = port;
    port.onMessage.addListener(function(msg) {
      if (msg.current_page)
        port.postMessage(Contact_List);  
        //alert('back recieve msg!');    
    });    
});

setInterval(function(){if(bg_port){bg_port.postMessage({barrager:{}});}}, 20000);


