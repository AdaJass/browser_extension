var server_url = "http://localhost:3000/";
var extensionUrl = chrome.extension.getURL('/');
var customer_id = null;
var friend_list = null;
var page_contact = null;
var barrager_color = '#fff';
var last_barrager_time = new Date();

/*------------------- message io ------------------------ */
function sendMsg(msg){
    // console.log(msg);
    chrome.runtime.sendMessage(msg);
}


chrome.runtime.onMessage.addListener(
    function (request, sender) {
        operations[request.msgid](request);
        
    }
);
function loginsucced(msg){
    customer_id = msg.customerid;
    alert(customer_id);
    console.log(99);
}

function chat(msg){    
    if($('chatBox').html()){
        console.log(99999);  //insert to the chat_box

    }
    else{
        if(msg.to.length>=2){
            console.log(66666);  //insert or build message information
        }
    }        
}
function contactable(msg){
    if(msg.body){
        page_contact = msg.pagecontact;
    }else{
        friend_list = msg.body.friends;       
    }
}
function friendlist(msg){
    friend_list = msg.body;
}
function barrager(msg){
    // console.log(msg);
    var parser = document.createElement('a');
    parser.href = msg.url; 
    // parser.protocol; // => "http:"
    // parser.hostname; // => "example.com"
    // parser.port;     // => "3000"
    // parser.pathname; // => "/pathname/"
    // parser.search;   // => "?search=test"
    // parser.hash;     // => "#hash"
    // parser.host;     // => "example.com:3000"   
    if(parser.host == location.host){
        setBarrager(msg.value, 'images/heisenberg.png');
    }
}


var operations={
    'barrager': barrager,
    'friendlist': friendlist,
    'contactable': contactable,
    'chat': chat,
    'loginsucceed': loginsucced
};
//here build the channel
/*
message={
    msgid: 'chat', from: 'cus_id', to: 'cus_id', body: ''
}
*/

/*----------------------barrager------------------------------*/
function setBarrager(info, imgurl) {    
    var speed = 6;    
    var window_height = $(window).height() - 150;
    var bottom = Math.floor(Math.random() * window_height + 40);
    var item = {
        'img': extensionUrl+imgurl,  //relativeurl+'images/' + img,
        'info': info,        
        'close': true,
        'speed': speed,
        'bottom': bottom,
        'color': barrager_color,
        'old_ie_color': '#fff' 
    };    
    $('body').barrager(item);
}
var example_item={'img':extensionUrl+'images/heisenberg.png','info':'Heeeello world!'};
$('body').barrager(example_item);


function clear_barrager() {
    $.fn.barrager.removeAll();
}


/*-----------------------main dashbord---------------------------------*/
$('<div id="main_dashbord" class="xuanfu"></div>').appendTo('body');
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
        // console.log(9999);             
        event.preventDefault();   
        //回车执行查询  
        var val = $(this).val();
        if(val.length<1) return;
        // setBarrager(val,'images/haha.gif'); 
        var msg ={msgid: 'barrager',customerid: customer_id, value: val, url: location.href};
        sendMsg(msg);
    }  
}); 
$('#clear_barrager').on('click', clear_barrager);
/*-----------------------chat box---------------------------------------*/
function showChatFrame(){
    $('body').centermenu({
        animateIn:'fadeInRight-hastrans',
        animateOut:'fadeOutRight-hastrans',
        hasLineBorder:false,
        duration:800,
    });  
    $('#the_magic_box').html(html_text);
    for(var i=1;i<=9;i++){
        $('.wl_faces_main ul').append(
        '<li><a href="javascript:;"><img src="'+extensionUrl+'img/emo_0'+i+'.gif" /></a></li>');
    }
    for(var i=10;i<=60;i++){
        $('.wl_faces_main ul').append(
        '<li><a href="javascript:;"><img src="'+extensionUrl+'img/emo_'+i+'.gif" /></a></li>');
    }
    var templist=[
        {name:'JieSi', state:'online', url: extensionUrl+'img/head/2015.jpg', cus_id: '1'}
        ,{name:'Ada', state: 'offline', url: extensionUrl+'img/head/2014.jpg', cus_id: '2'}
    ];    
    for(var i=0, l=templist.length;i<l;i++){
        $('.chat03_content ul').append('<li>'+
            '<label class="'+templist[i].state+'">'+
            '</label><a href="javascript:;">'+
            '<img src="'+templist[i].url+'"></a><a href="javascript:;"'+
            'class="chat03_name">'+templist[i].name+'</a>'+
            '<span hidden>'+templist[i].cus_id+'</span></li>');
    } 
    $('.chat02_bar ul li img').attr('src',extensionUrl+'img/send_btn.jpg');
    Binding($);
    BlinkBlink($);
}
setTimeout(showChatFrame,5000);


