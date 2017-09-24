// var bg_port = [];
// var port_num = 0;
chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name == "currentpage");

    port.onMessage.addListener(function (msg) {
        if (msg.init) {
            // bg_port[port_num++] = port;
            alert('init');
        }
        if (msg.current_page)
            port.postMessage(Contact_List);
        // alert(msg.current_page);
    });
});


// setInterval(function () {
//     for(var i=0,l=bg_port.length;i<l;i++) { 
//         bg_port[i].postMessage({ barrager: i }); 
//     } }, 10000);
var port = chrome.tabs.connect({name: "currentpage"});
port.postMessage({init: "yes"});

