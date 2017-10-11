function message() {
    var a = $.blinkTitle.show();
    setTimeout(function () {
        $.blinkTitle.clear(a)
    }, 8e3)
}

function Binding() {
    function show_message() { //e() function happend after "send" button clicked.
        // function h() {  //recursive replaces #emo_ symbols to images.
        //     -1 != send_text.indexOf("*#emo_") && (send_text = send_text.replace("*#", "<img src='img/").replace("#*", ".gif'/>"), h())
        // }
        var e = new Date,
            msgtime = "";
        msgtime += e.getFullYear() + "-", f += e.getMonth() + 1 + "-", f += e.getDate() + "  ", f += e.getHours() + ":", f += e.getMinutes() + ":", f += e.getSeconds();
        var send_text = $("#textarea").html();  // it shows that the e() function happend after "send" button clicked.
        // console.log('the text is ', send_text);
        // h();
        var i = "<div class='message clearfix'><div class='user-logo'><img src='" + from_head_url +
            "'/>" + "</div>" + "<div class='wrap-text'>" + "<h5 class='clearfix'>"+user_name+"</h5>" +
            "<div>" + send_text + "</div>" + "</div>" + "<div class='wrap-ri'>" + "<div clsss='clearfix'><span>" + msgtime +
            "</span></div>" + "</div>" + "<div style='clear:both;'></div>" + "</div>";   //this should be the message sent.
        if(null != send_text && "" != send_text){
            $(".mes" + a).append(i);
            $(".chat01_content").scrollTop($(".mes" + a).height());
            $("#textarea").html("");
            message();
            var cusid_list=$(".chat03_content li span").text();
            if(typeof(cusid_list) != typeof([])) 
                cusid_list = [cusid_list];
            chrome.runtime.sendMessage({ msgid: 'chat', bady: send_text, time: msgtime, from: customer_id, to: cusid_list});
        } 
        else{
            alert("请输入内容!")
        }
    }
    var a = 3,
        from_head_url = "img/head/2024.jpg",
        to_head_url = "img/head/2015.jpg",
        user_name = "\u738b\u65ed";
    $(".close_btn").click(function () {
        $(".chatBox").hide();
        document.onkeydown=function(){};        
        defaultvalue._removeMask();
        defaultvalue._showScroll(true);
    }), $(".chat03_content li").mouseover(function () {
        $(this).addClass("hover").siblings().removeClass("hover")
    }).mouseout(function () {
        $(this).removeClass("hover").siblings().removeClass("hover")
    }), $(".chat03_content li").dblclick(function () {
        var b = 3; //$(this).index() + 1;
        a = b, to_head_url = "img/head/20" + (12 + a) + ".jpg", d = $(this).find(".chat03_name").text(), $(".chat01_content").scrollTop(0), $(this).addClass("choosed").siblings().removeClass("choosed"), $(".talkTo a").text($(this).children(".chat03_name").text()), $(".mes" + b).show().siblings().hide()
    }), $(".ctb01").mouseover(function () {
        $(".wl_faces_box").show()
    }).mouseout(function () {
        $(".wl_faces_box").hide()
    }), $(".wl_faces_box").mouseover(function () {
        $(".wl_faces_box").show()
    }).mouseout(function () {
        $(".wl_faces_box").hide()
    }), $(".wl_faces_close").click(function () {
        $(".wl_faces_box").hide()
    }), $(".wl_faces_main img").click(function () {
        var a = $(this).attr("src");                                     
        document.getElementById("textarea").innerHTML+='<img src="'+a+'">', $("#textarea").focusEnd(), $(".wl_faces_box").hide();         
    }), $(".chat02_bar img").click(function () {
        show_message();
    }), document.onkeydown = function (a) {
        var b = document.all ? window.event : a;
        return 13 == b.keyCode ? (show_message(), !1) : void 0
    }, $.fn.setCursorPosition = function (a) {
        return 0 == this.lengh ? this : $(this).setSelection(a, a)
    }, $.fn.setSelection = function (a, b) {
        if (0 == this.lengh) return this;
        if (input = this[0], input.createTextRange) {
            var c = input.createTextRange();
            c.collapse(!0), c.moveEnd("character", b), c.moveStart("character", a), c.select()
        } else input.setSelectionRange && (input.focus(), input.setSelectionRange(a, b));
        return this
    }, $.fn.focusEnd = function () {
        this.setCursorPosition(this.val().length)
    }
}

function BlinkBlink(a) {
    a.extend({
        blinkTitle: {
            show: function () {
                var a = 0,
                    b = document.title;
                if (-1 == document.title.indexOf("\u3010")) var c = setInterval(function () {
                    a++ , 3 == a && (a = 1), 1 == a && (document.title = "\u3010\u3000\u3000\u3000\u3011" + b), 2 == a && (document.title = "\u3010\u65b0\u6d88\u606f\u3011" + b)
                }, 500);
                return [c, b]
            },
            clear: function (a) {
                a && (clearInterval(a[0]), document.title = a[1])
            }
        }
    })
}