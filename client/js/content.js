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


function clear_barrager() {
    $.fn.barrager.removeAll();
}


/*-----------------------main dashbord---------------------------------*/
$('<div id="main_dashbord" class="xuanfu"></div>').appendTo('body');
$('<div id="center_box"></div.').appendTo('#main_dashbord');
$('<div id="left_box"></div.').appendTo('#main_dashbord');  //one half show the sorted list, another show them randomly.
$('<div id="right_box"></div.').appendTo('#main_dashbord');
var ct_box ='<label>排序：</><select name="sort_with"><option value="similiar">按相似度</option><option value="level">按等级</option><option value="activity">按活跃度</option><option value="score">按系统评分</option></select>';
ct_box+='<button id="clear_barrager">禁用弹幕</button>';
$("#center_box").html(ct_box);
$("#clear_barrager").on('click', clear_barrager);
/*--------------------------------------------------------------------*/
