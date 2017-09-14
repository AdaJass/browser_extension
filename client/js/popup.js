/* =================================================
// jQuery Tabs Plugins 1.0
// author:chenyg@5173.com
// URL:http://stylechen.com/jquery-tabs.html
// 4th Dec 2010
// =================================================*/

(function($){
	$.fn.extend({
		Tabs:function(options){
			// 处理参数
			options = $.extend({
				event : 'mouseover',
				timeout : 0,
				auto : 0,
				callback : null
			}, options);
			
			var self = $(this),
				tabBox = self.children( 'div.tab_box' ).children( 'div' ),
				menu = self.children( 'ul.tab_menu' ),
				items = menu.find( 'li' ),
				timer;
				
			var tabHandle = function( elem ){
					elem.siblings( 'li' )
						.removeClass( 'current' )
						.end()
						.addClass( 'current' );
						
					tabBox.siblings( 'div' )
						.addClass( 'hide' )
						.end()
						.eq( elem.index() )
						.removeClass( 'hide' );
				},
					
				delay = function( elem, time ){
					time ? setTimeout(function(){ tabHandle( elem ); }, time) : tabHandle( elem );
				},
				
				start = function(){
					if( !options.auto ) return;
					timer = setInterval( autoRun, options.auto );
				},
				
				autoRun = function(){
					var current = menu.find( 'li.current' ),
						firstItem = items.eq(0),
						len = items.length,
						index = current.index() + 1,
						item = index === len ? firstItem : current.next( 'li' ),
						i = index === len ? 0 : index;
					
					current.removeClass( 'current' );
					item.addClass( 'current' );
					
					tabBox.siblings( 'div' )
						.addClass( 'hide' )
						.end()
						.eq(i)
						.removeClass( 'hide' );
				};
							
			items.bind( options.event, function(){
				delay( $(this), options.timeout );
				if( options.callback ){
					options.callback( self );
				}
			});
			
			if( options.auto ){
				start();
				self.hover(function(){
					clearInterval( timer );
					timer = undefined;
				},function(){
					start();
				});
			}
			
			return this;
		}
	});
})(jQuery);

(function($){
	$.fn.lazyload=function(options){
		var settings = {
			threshold:0,
			failurelimit:0,
			event:"scroll",
			effect:"show",
			container:window
		};
		if(options){
			$.extend(settings,options);
		}
	var elements=this;
	
	if("scroll"==settings.event){
		$(settings.container).bind("scroll", function(event){
			var counter=0;
			elements.each(function(){
				if($.abovethetop(this,settings)||$.leftofbegin(this,settings))
				{}else if(!$.belowthefold(this,settings)&&!$.rightoffold(this,settings)){
					$(this).trigger("appear");
				}else{
					if(counter++ > settings.failurelimit){
						return false;
					}
				}
			});
			var temp = $.grep(elements,function(element){
				return !element.loaded;
			});
			elements = $(temp);
		});
	}

	this.each(function(){
	
		var self=this;
		
		if(undefined==$(self).attr("original")){
			$(self).attr("original", $(self).attr("src"));
		}if("scroll" != settings.event||undefined == $(self).attr("src")||"" == $(self).attr("src")||settings.placeholder == $(self).attr("src")||($.abovethetop(self,settings)||$.leftofbegin(self,settings)||$.belowthefold(self,settings)||$.rightoffold(self,settings))){
			if(settings.placeholder){
				$(self).attr("src", settings.placeholder);}else{$(self).removeAttr("src");
			}
			self.loaded=false;
		}else{
			self.loaded=true;
		}
		
		$(self).one("appear", function(){
			if(!this.loaded || 1 == 1){
				$("<img />").bind("load", function(){
					$(self).hide().attr("src", $(self).attr("original"))[settings.effect](settings.effectspeed);
					self.loaded=true;
				}).attr("src", $(self).attr("original"));
			};
		});
		
		if("scroll"!=settings.event){
			$(self).bind(settings.event, function(event){
			if(!self.loaded){
				$(self).trigger("appear");
			}
		}
		
		);}
	});

		$(settings.container).trigger(settings.event);
		return this;
	};
	
	$.belowthefold=function(element,settings){
		if(settings.container === undefined || settings.container === window){
			var fold = $(window).height() + $(window).scrollTop();
		}else{
			var fold = $(settings.container).offset().top + $(settings.container).height();
		}
		return fold <= $(element).offset().top - settings.threshold;
	};

	$.rightoffold=function(element,settings){
		if(settings.container === undefined || settings.container === window){
			var fold = $(window).width() + $(window).scrollLeft();
		}else{
			var fold = $(settings.container).offset().left + $(settings.container).width();
		}
		return fold <= $(element).offset().left - settings.threshold;
	};

	$.abovethetop=function(element,settings){
		if(settings.container === undefined || settings.container === window){
			var fold = $(window).scrollTop();
		}else{
			var fold = $(settings.container).offset().top;
		}
		return fold >= $(element).offset().top + settings.threshold  + $(element).height();
	};

	$.leftofbegin=function(element,settings){
		if(settings.container === undefined || settings.container === window){
			var fold = $(window).scrollLeft();
		}else{
			var fold = $(settings.container).offset().left;
		}
		return fold >= $(element).offset().left + settings.threshold + $(element).width();
	};

	$.extend(
		$.expr[':'],
		{
			"below-the-fold" : "$.belowthefold(a, {threshold : 0, container: window})",
			"above-the-fold" : "!$.belowthefold(a, {threshold : 0, container: window})",
			"right-of-fold"  : "$.rightoffold(a, {threshold : 0, container: window})",
			"left-of-fold"   : "!$.rightoffold(a, {threshold : 0, container: window})"
		}
	);
	
})(jQuery);