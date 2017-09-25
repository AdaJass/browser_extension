// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, {greeting: "background say hello"});
//     alert(tabs.length)
//   });

chrome.runtime.onMessage.addListener(
    function(msg, sender) {
      if(msg.msgid == 'chat'){
          msg.tabid = sender.tab.id;
          ws.send(JSON.stringify(msg));
      }
      chrome.tabs.sendMessage(sender.tab.id, {greeting: "background say hello"});
});

//here insert tabid to massage to send to background.

