var extensionUrl = chrome.extension.getURL('/');
var friend_list = null;
var page_contact = null;
var customer_id = null;
var barrager_color = '#fff';
var last_barrager_time = new Date();
var server_url = location.protocol == 'http:'? 'http://192.168.1.53:3000/' : 'https://192.168.1.53:3448/';
var server_static = server_url + 'static/';
/*------------------- message io ------------------------ */
(function (){
    //initialization here.

})();

function randomStr(){
    var lower = [];
    var uppper = [];
    var number =[];
    var op={
        0: function(){ return String.fromCharCode(Math.floor(Math.random()*26)+97);},
        1: function(){ return String.fromCharCode(Math.floor(Math.random()*26)+65);},
        2: function(){ return String.fromCharCode(Math.floor(Math.random()*10)+48);}
    };
    var s='';
    for(var i=0; i<15;i++){
        s+=op[Math.floor(Math.random()*3)]();
    }
    return s;   
}
function idToHeadImg(id_){return server_static + 'images/head/' + id_ +'.png';}



function sendMsg(msg){
    // console.log(msg);
    chrome.runtime.sendMessage(msg);
}


chrome.runtime.onMessage.addListener(
    function (request, sender) {
        operations[request.msgid](request);
        
    }
);

function chat(msg){    
    if($('.chatBox').html()){
        // alert(JSON.stringify(msg));  //insert to the chat_box
        roomid = msg.roomid;
        show_message(msg.body,true);
    }
    else{
        if(msg.to.length>=2){
            console.log(66666);  //insert or build message information
        }
        else{
            console.log(8888);
        }
    }        
}
function contactable(msg){
    if(msg.body){
        page_contact = msg.pagecontact;
    }
}
function friendlist(msg){
    friend_list = msg.body;
}
function barrager(msg){
    // console.log(msg);
    // var parser = document.createElement('a');
    // parser.href = msg.url; 
    // parser.protocol; // => "http:"
    // parser.hostname; // => "example.com"
    // parser.port;     // => "3000"
    // parser.pathname; // => "/pathname/"
    // parser.search;   // => "?search=test"
    // parser.hash;     // => "#hash"
    // parser.host;     // => "example.com:3000"   
    
    setBarrager(msg, idToHeadImg(msg.from));    
}


var operations={
    'barrager': barrager,
    'friendlist': friendlist,
    'contactable': contactable,
    'chat': chat
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
        'img': server_static+imgurl,  //relativeurl+'images/' + img,
        'from': info.from,
        'nickName': info.nickName,
        'state': info.state,
        'info': info.body,        
        'close': true,
        'speed': speed,
        'bottom': bottom,
        'color': barrager_color,
        'old_ie_color': '#fff' 
    };    
    $('body').barrager(item);
}

// $.get(server_static+'data',function(d){alert(9);alert(JSON.stringify(d));});

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
        event.preventDefault();   
        //回车执行查询  
        var val = $(this).val();
        if(val.length<1) return;
        // setBarrager(val,'images/haha.gif'); 
        var msg ={msgid: 'barrager', body: val, url: location.href, from: customer_id};
        sendMsg(msg);
    }  
}); 
$('#clear_barrager').on('click', clear_barrager);
/*-----------------------chat box---------------------------------------*/
function showChatFramechat(chatto, nickname, onlinestate){
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
        {name: nick_name, state: self_state, url: idToHeadImg(customer_id), cus_id: customer_id}
        ,{name: nickName, state: onlinestate, url: idToHeadImg(chatto), cus_id: chatto}
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
// setTimeout(showChatFrame,5000);
