;(function($){
	var methods = {
		init: function(opt){
			var defaultOpt = {
				ajaxUrl: '',
				placeHolder: '',
				ajaxPageName: '',
				btnId: '',
				tmplObj: '',
				callback: null,
				list: []
			};
			opt = $.extend(defaultOpt , opt || {});
			function initSearch() {
				var that = this;
				function getSearchValue() {
				    var vals = '';
				    var searchVal = $('.s_input',that).val();
				    if (searchVal) {
				        vals = $.map(opt.list,function(v,i) {
				            if (v.name.indexOf(searchVal) > -1) {
				                return v.id;
				            }
				        }).join(',');
				    }
				    return vals;
				}
				$(this).html(opt.tmplObj.tmpl(opt));
				$(this).find('.s_input').keyup(function(e) {
					if (e.keyCode == '13') {
						var sVal = getSearchValue();
						$(that).find('.s_val').val(sVal);
						opt.callback && opt.callback.call(that,sVal);
					}
				});
				$(this).find('.search_btn').click(function(e) {
					var sVal = getSearchValue();
					$(that).find('.s_val').val(sVal);
					opt.callback && opt.callback.call(that,sVal);
				});
			}
			return this.each(function() {
				var that = this;
				if(opt.ajaxUrl){
					$.get(opt.ajaxUrl,{
				        rnd: Math.random(),
				        pageSize:10000
				    },function(data) {
				        loginValidate(data);
				        opt.list = data[opt.ajaxPageName].result;
				        initSearch.call(that);
				    });
				}else{
					initSearch.call(that);
				}
			});
		},
		getValue: function(){
			return $(this).find('.s_val').val();
		}
	};
	
	$.fn.UMsearch = function(method){
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}
		
	};

})(jQuery);