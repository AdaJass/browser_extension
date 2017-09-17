$(function(){
	$('.demo2').Tabs({
		event:'click'
	});

	$.post('http://127.0.0.1/data',{'msgid':''},function(result){
		$("span").html(result);
	  });

});	
