var server_url = "http://localhost:3000/";
var 
var barrager_color = '#fff';
var last_barrager_time = new Date();

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


function setBarrager(info, imgurl,) {    
    var speed = 6;    
    var window_height = $(window).height() - 150;
    var bottom = Math.floor(Math.random() * window_height + 40);
    var item = {
        'img': server_url+'static/images/'+imgurl,  //relativeurl+'images/' + img,
        'info': info,        
        'close': true,
        'speed': speed,
        'bottom': bottom,
        'color': barrager_color,
        'old_ie_color': '#fff' 
    };    
    $('body').barrager(item);
}
var example_item={'img':server_url+'static/images/heisenberg.png','info':'Heeeello world!'};
$('body').barrager(example_item);


function clear_barrager() {
    $.fn.barrager.removeAll();
}


/*-----------------------main dashbord---------------------------------*/
$('<div id="main_dashbord" class="xuanfu"></div>').appendTo('body');
$('<div id="chat_box" class="xuanfu"></div>').appendTo('body');
$('<div id="control_box"></div.').appendTo('#main_dashbord');
$('<div id="content_box"></div.').appendTo('#main_dashbord');  //one half show the sorted list, another show them randomly.
var ct_box = '<button id="set_panel">设置</button>';
ct_box +='<button id="clear_barrager">禁用弹幕</button>';
ct_box += '<input type="text" name="input_barrager" id="input_barrager">';
ct_box +='<label>排序：</label><select name="sort_with"><option value="similiar">按相似度</option><option value="level">按等级</option><option value="activity">按活跃度</option><option value="score">按系统评分</option></select>';
$('#control_box').html(ct_box);
$('#input_barrager').attr('placeholder','按回车发送');
$('#input_barrager').bind('keypress', function(event) {  
    if (event.keyCode == "13") {              
        event.preventDefault();   
        //回车执行查询  
        var val = $(this).val();
        if(val.length<1) return;
        setBarrager(val,'haha.gif');  
    }  
});  
$('#clear_barrager').on('click', clear_barrager);
/*--------------------------------------------------------------------*/


