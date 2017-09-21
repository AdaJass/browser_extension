var bg_port = None;
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "currentpage");
    bg_port = port;
    port.onMessage.addListener(function(msg) {
      if (msg.current_page)
        port.postMessage(Contact_List);      
    });
});

if(bg_port){
    bg_port.postMessage({barrager:{}});
}