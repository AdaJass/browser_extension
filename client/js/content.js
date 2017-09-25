chrome.runtime.sendMessage({greeting: "content say, hello"});


chrome.runtime.onMessage.addListener(
    function(request, sender) {
        alert(sender.tab ?
                  "content receive from a content script:" + sender.tab.url :
                  "from the extension");
        alert(request.greeting)
});

//here build the channel
/*
message={
    msgid: 'chat', from: 'cus_id', to: 'cus_id', body: ''
}


*/