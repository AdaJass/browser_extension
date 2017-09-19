$(function(){
	$('.demo2').Tabs({
		event:'click'
	});

	var customer = chrome.extension.getBackgroundPage().customer;
	var ws = chrome.extension.getBackgroundPage.ws;
	ws.send({'hehe':'ssss'});

	if(!customer.custid){
		var aa = "there must be some error."
	}else{
		$.post('http://127.0.0.1/get_friend_list',{'customerid': customer.custid},function(result){
			result = "create the page tab.";
		});	
		$.post('http://127.0.0.1/get_message_list',{'customerid': customer.custid},function(result){
			$("span").html(result);
		});
		$.post('http://127.0.0.1/get_similar_list',{'customerid': customer.custid},function(result){
			$("span").html(result);
		});	
	}
});	
