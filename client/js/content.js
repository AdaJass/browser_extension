var server_url = "http://localhost:3000/"

chrome.runtime.sendMessage({ greeting: "content say, hello" });
chrome.runtime.onMessage.addListener(
    function (request, sender) {
        // alert(sender.tab ?
        //           "content receive from a content script:" + sender.tab.url :
        //           "from the extension");
        // alert(request.greeting)
    });

//here build the channel
/*
message={
    msgid: 'chat', from: 'cus_id', to: 'cus_id', body: ''
}
*/

/*----------------------barrager------------------------------*/

function setBarrager() {
    var info = "hello world";    
    var href = "www.baidu.com";
    var speed = 6;
    var code = "dk";
    
    var window_height = $(window).height() - 150;
    var bottom = Math.floor(Math.random() * window_height + 40);
    var item = {
        'img': server_url+'images/haha.gif',  //relativeurl+'images/' + img,
        'info': info,
        'href': href,
        'close': true,
        'speed': speed,
        'bottom': bottom,
        'color': '#fff',
        'old_ie_color': '#fff' 
    };
    console.log(item.img);  
    $('body').barrager(item);
}
var example_item={'img':server_url+'static/images/heisenberg.png','info':'Heeeello world!'};
$('body').barrager(example_item);


function clear_barrage() {
    $.fn.barrager.removeAll();
}
/*-----------------------------------------------------------*/