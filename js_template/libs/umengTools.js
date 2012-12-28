/*
 * jquery render chart
 * Rely on: jquery.highcharts
 * author: umeng-lxy;
 **/
(function($){
    $.chartCache ={};
    $.hashCache =[];
    window.uploadFileWait = false;
    $.fn.extend({
        renderChart : function(opt){
            var defaultOpt = {
                chart: {
                defaultSeriesType: "area",
                animation: true,
                height:300
            },
            yAxis: {
                title:"",
                min:0
            },
            credits: {
                "enabled":false
            },
            plotOptions: {
                "area":{
                    "stacking":null,
                    fillColor: {
                        linearGradient: [0, 0, 0, 300],
                        stops: [
                        [0, 'rgb(160, 192, 193)'],
                        [1, 'rgba(255,255,255,0)']
                        ]
                    },
                    "marker": {
                        symbol: 'circle',
                        fillColor: '#FFFFFF',
                        lineWidth: 2,
                        lineColor: null
                    }
                },
                "series":{
                    animation: true,
                    events: {
                      legendItemClick: function(event) {
                        var legendName = this.name+'_<dot>';
                        var tempSeries = this.chart.series;
                        var seriesLength = tempSeries.length;
                        for (var i=0; i < seriesLength; i++){
                          if (tempSeries[i].name == legendName){
                            tempSeries[i].visible ? tempSeries[i].hide() : tempSeries[i].show();
                          }
                        }
                      }
                    }
                }
            },
            tooltip: {
                enabled: true,
                formatter: function() {
                    return ''+
                    this.x + '日'+ this.series.name + ' : '+ this.y;
                }
            },
            legend: {
                margin: 25,
                enabled: true
            },
            subtitle: {}
            };
            var options = $.extend(true,{},defaultOpt,opt||{});
            return this.each(function(){
                options.chart.renderTo = $(this).attr('id');
                try{
                    $.chartCache($(this).attr('id')).destroy();
                }catch(e){
                    $.chartCache[$(this).attr('id')] = new Highcharts.Chart(options);
                }
            });
        },
        ajaxBlock : function(opt){
            var defaultOpt = {
                message: "<img src='/imgs/xp/ajax-load.gif'/>",
                css:{
                    width:'16px',
                    border:'none',
                    background: 'none'
                },
                overlayCSS:{
                    backgroundColor: '#FFF',
                    opacity: 0.8
                },
                baseZ:997
            };
            var options = $.extend(true,{},defaultOpt,opt||{});
            return this.each(function(){
                $(this).block(options);
            });
        },
        timeFilterTab : function(opt){
            var defaultOpt = {
                callback:null,
                selIndex : 0,
                tabs:[
                    {
                        text : "今天",
                        paramName : "period",
                        paramVal : "today"
                    },
                    //  {
                    //     text : "昨天",
                    //     paramName : "period",
                    //     paramVal : "yesterday"
                    // },
                     {
                        text : "过去7天",
                        paramName : "period",
                        paramVal : "-7"
                    }, {
                        text : "上周",
                        paramName : "period",
                        paramVal : "lastWeek"
                    }, {
                        text : "上月",
                        paramName : "period",
                        paramVal : "lastMonth"
                    }, {
                        text : "上季度",
                        paramName : "period",
                        paramVal : "lastQuarter"
                    }, {
                        text : "自定义时间",
                        paramName : "period",
                        paramVal : "custom"
                    }
                ]
            };
            opt = $.extend(defaultOpt,opt||{});
            return this.each(function(){
                $(this).append($('#time-filter-tmpl').tmpl(opt,{
                    getStatus : function(i){
                        return i==this.data.selIndex?'sel':'';
                    }
                }));
                var filterTab = $(this).find('.filter');
                var selLi = filterTab.find('li:eq('+ opt.selIndex +')');
                filterTab.find('.bg').animate({'left':selLi.position().left+10,'width':selLi.outerWidth()},500,'easeInOutCubic');
                filterTab.find('li').click(function(){
                    $(this).addClass('sel').siblings('li').removeClass('sel');
                    filterTab.find('.bg').animate({'left':$(this).position().left+10,'width':$(this).outerWidth()},500,'easeInOutCubic');
                    if($('a',this).attr('period')=='custom'){
                        var customBody = $(this).closest('.filter').find('.custom').slideDown(300);
                        customBody.find(".from").datepicker({
                            defaultDate: "+1w",
                            // changeMonth: true,
                            dateFormat : "yy-mm-dd",
                            dayNamesMin:['日','一','二','三','四','五','六'],
                            // monthNamesShort:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
                            monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
                            numberOfMonths: 2,
                            onSelect: function( selectedDate ) {
                                customBody.find(".to").datepicker( "option", "minDate", selectedDate );
                            }
                        });
                        customBody.find(".to").datepicker({
                            defaultDate: "+1w",
                            dateFormat : "yy-mm-dd",
                            dayNamesMin:['日','一','二','三','四','五','六'],
                            monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
                            // changeMonth: true,
                            numberOfMonths: 2,
                            onSelect: function( selectedDate ) {
                                customBody.find(".from").datepicker( "option", "maxDate", selectedDate );
                            }
                        });
                        customBody.find('.btn_small_green').unbind('click').click(function(){
                            $(this).closest('.filter').find('.custom').slideUp(300);
                            if(opt.callback){
                                opt.callback.call(this,opt);
                            }
                        });
                    }else{
                        $(this).closest('.filter').find('.custom').slideUp(300);
                        if(opt.callback){
                            opt.callback.call(this,opt);
                        }
                    }
                });
            });
        },
        blockTab : function(opt){
            var defaultOpt ={
                tabfors:$('.bodys'),
                callback:null,
                type:'normal',
                data:[]
            };
            opt = $.extend(defaultOpt,opt||{});
            opt.tabfors.data('opt',opt);
            return this.each(function(){
                $(this).find('.item').click(function(){
                    if(opt.type == 'normal'){
                        $(this).closest('.sub_head').find('.bg').animate({'left':$(this).position().left+167,'width':$(this).width()},500,'easeInOutCubic');
                    }
                    $(this).addClass('sel').siblings('.item').removeClass('sel');
                    $.tabSlideTo($(this),opt);
                    if(opt.callback){
                        opt.callback.apply(this,opt.data);
                    }
                });
            });
        },
        checkBox : function(opt){
            var defaultOpt = {
                type:'single',//single multi singletoggle
                group: 'closed',
                callback : null
            };
            opt = $.extend(defaultOpt,opt||{});

            return this.each(function(){
                var that = this;
                function checkDisable() {
                    var nowGroup = $('.sel',that).attr('group');
                    $('.btn_checkbox',that).removeClass('disabled');
                    nowGroup && $('.btn_checkbox:not([group='+ nowGroup +'])').addClass('disabled');
                }
                checkDisable();
                $('.btn_checkbox',that).on('click',function(){
                    if(!$(this).hasClass('disabled')){
                        if(opt.group == 'closed') {
                            if(opt.type == 'single'){
                                $(this).addClass('sel').closest('.check_box').find('.btn_checkbox').not(this).removeClass('sel');
                            }else if(opt.type == 'multi'){
                                $(this).toggleClass('sel');
                            }else{
                                $(this).toggleClass('sel');
                                if($(this).hasClass('sel')){
                                    $(this).siblings('.btn_checkbox').removeClass('sel');
                                }
                            }
                        }else{
                            $(this).toggleClass('sel');
                            checkDisable();
                        }
                        $($(that).attr('linkfor')).val($('.sel',that).map(function(){
                            return $(this).attr('val');
                        }).get().join(',')).trigger('change');
                        $($(that).attr('groupfor')).val($('.sel',that).attr('group')).trigger('change');
                        opt.callback&&opt.callback.call(this,opt);
                    }
                });
            });
        },
        selectList : function(opt){
            var defaultOpt = {
                defaultVal:'请选择',//single multi singletoggle
                callback : null,
                val:'',
                platform:'',
                className:'',
                id:'',
                list : []
            };
            opt = $.extend(defaultOpt,opt||{});
            return this.each(function(){
                var that = this;
                if($(this).attr('inputid')){
                    opt.id = $(this).attr('inputid');
                }
                // if(defaultOpt.defaultVal.indexOf('请选择') == -1){
                //     defaultOpt.val = defaultOpt.defaultVal;
                // }
                $(this).html($('#select-custom').tmpl(opt));
                $(this).find('.select_input').off('click').on('click',function(){
                    $(this).next().slideToggle(300);
                });
                $(this).find('.select_option li').off('click').on('click',function(){
                    var input = $($(that).find('.select_input').attr('linkfor'));
                    input.val($(this).attr('val'));
                    
                    $(that).find('.select_input .select_value').text($(this).text());
                    $(this).closest('.select_option').slideUp(300);
                    opt.callback&&opt.callback.call(this,opt);
                });
            });
        },
        addOperateBtns : function(opt){
            var defaultOpt = {
                list:'.ad_item',
                callback : null
            };
            opt = $.extend(defaultOpt,opt||{});
            return this.each(function(){
                var op_btns = $($('#operate-btns').html());
                op_btns.find('.btn_small_black').on('click',function(){
                    if(opt.callback){
                       opt.callback.call(this,opt);
                    }
                });
                $(this).append(op_btns);
            });
        },
        checkAll : function(callback){
            return this.each(function(){
                $(this).on('click',function(){
                    $($(this).attr('selectAll')).prop('checked',$(this).prop('checked'));
                });
            });
        },
        advanceSet : function(callback){
            return this.each(function(){
                $(this).click(function(){
                    $(this).toggleClass('expand');
                    var setFor = $($(this).attr('setfor'));
                    if(setFor.is('tr,td')){
                        if(setFor.is(':hidden')){
                            setFor.show();
                            setFor.find('td>div').slideDown(300);
                        }else{
                            setFor.find('td>div').slideUp(300,function(){
                                setFor.hide();
                            });
                        }
                    }else{
                        setFor.slideToggle(300);
                    }
                    if(callback){
                        callback.call(this);
                    }
                });
            });
        },
        setPrior : function(callback){
            var priorList = [
                {
                    value:'最高',
                    statusBar : 'prior_bar_red',
                    val:'5'
                },{
                    value:'高',
                    statusBar : 'prior_bar_yellow',
                    val:'4'
                },{
                    value:'中',
                    statusBar : 'prior_bar_green',
                    val:'3'
                },{
                    value:'低',
                    statusBar : 'prior_bar_blue',
                    val:'2'
                },{
                    value:'最低',
                    statusBar : 'prior_bar_pink',
                    val:'1'
                }
            ];
            return this.each(function(){
                var nowPriorPanel;

                $(this).on('click',function(e){
                    e.stopPropagation();
                    var _self = this;
                    var opt = {
                        getStatus : function(){
                            // console.log($(this));
                            return this.data.val == $(_self).attr('val')?'sel':'';
                        }
                    };
                    nowPriorPanel =$('<ul class="prior_set dn"></ul>').append($('#prior-set').tmpl(priorList,opt));
                    nowPriorPanel.appendTo('body');
                    // console.log($(this).offset().left);
                    var left = $(this).parent().offset().left+($(this).parent().width()-nowPriorPanel.width())/2;
                    var top = $(this).parent().offset().top;
                    nowPriorPanel.css({left:left,top:top}).slideDown(300);
                    nowPriorPanel.find('li').click(function(){
                        $(this).addClass("sel").siblings('li').removeClass('sel');
                        if(callback){
                            callback.call(_self,{val:$(this).attr('val'),value:$('.prior_text',this).text()});
                        }

                        $(this).closest('.prior_set').slideUp(300,function(){
                            $(this).remove();
                        });
                    });
                });
            });
        },
        createAreaOpt : function(opt){
            var defaultOpt = {
                callback:null,
                linkInput:$('#areas'),
                id:'',
                parentBody:$('body')
            };
            opt= $.extend(defaultOpt,opt||{});
            (function(opt){
                return this.each(function(){
                    var that = this;
                    opt.id ='sub_body_'+$.getToken();
                    opt.parentBody.append($('#sub-pop-area').tmpl(opt));
                    var area = $('#'+opt.id);
                    $(this).attr('area','#'+opt.id);
                    area.find("tr.tb_title").click(function(){
                        $(this).nextUntil("tr.tb_title").find("input").prop("checked",$(this).find("input").prop("checked"));
                    });
                    area.find("tr.area_list span.sub_title").click(function(){
                        $(this).nextAll("input").prop("checked",$(this).find("input").prop("checked"));
                    });
                    area.find('.region_cancel').click(function(){
                        area.animate({right:-area.outerWidth()-10+'px'},500);
                    });
                    area.find('.region_ok').click(function(){
                        var areas= area.find('tr.area_list td>:checkbox').map(function(i,e){
                            if ($(e).prop('checked')){
                                return $(e).prev('label').text();
                            }
                        }).get().join(",");
                        //为全选状态或者都不选时 默认为所有网络
                        if(areas.split(',').length === 37 || areas.length === 0){
                            $(that).find('.btn_checkbox.all').trigger('click');
                        }else{
                            opt.linkInput.val(areas);
                            $(that).find('.btn_checkbox.special').attr('val',areas);
                        }
                        area.animate({right:-area.outerWidth()-10+'px'},500);
                    });
                   
                    $(this).find('.btn_checkbox.all').click(function(){
                        opt.linkInput.val('all');
                    });
                    $(that).find('.btn_checkbox.special').click(function(){
                        // console.log(area.find(':checkbox'));
                        area.find(':checkbox').prop('checked',false);
                        if(opt.linkInput.val()!=='all'){
                            area.find('tr.area_list td>label').each(function(i,e){
                                var areas = opt.linkInput.val();
                                // console.log(area,$(e).text());
                                if (areas.indexOf($(e).text())>-1){
                                    $(e).next('input').prop('checked',true);
                                }
                            });
                        }else{
                            area.find(':checkbox').prop('checked',true);
                        }
                        area.animate({right:'10px'},500);
                    });
                });
            }).call(this,opt);
        },
        pageNav : function(opt,callback){
            var defaultOpt = {
                ajaxUrl:'',
                totalPages:20,
                tmpl:null,
                viewCount:3,
                callback:null,
                pageFor:$('.table_body table tbody'),
                ajaxBlocker:$('.table_body'),
                current:1
            };
            opt= $.extend(defaultOpt,opt||{});
            function genPagin(totalPages,current){
                var str="",lowPageNo,upPageNo;
                //分页显示...逻辑
                lowPageNo = current-opt.viewCount;
                upPageNo = current+opt.viewCount;
                if(lowPageNo<1){
                    upPageNo = upPageNo-lowPageNo+1;
                }
                if(upPageNo>totalPages){
                    lowPageNo = lowPageNo - upPageNo+totalPages;
                }
                for(var i = 0;i<totalPages;i++){
                    if(i===0||i==totalPages-1||(i+1>=lowPageNo&&i+1<=upPageNo)){
                        str += '<a class="'+(i+1==current?'current':'')+'" p="'+(i+1)+'">'+(i+1)+'</a>';
                    }else if(i==totalPages-2){
                        if(upPageNo<totalPages-2){
                            str += '<a class="dot" p="'+(i+1)+'">...</a>';
                        }else{
                            str += '<a  p="'+(i+1)+'">'+(i+1)+'</a>';
                        }
                    }else if(i==1){
                        if(lowPageNo>3){
                            str += '<a class="dot" p="'+(i+1)+'">...</a>';
                        }else{
                            str += '<a  p="'+(i+1)+'">'+(i+1)+'</a>';
                        }
                    }
                }
                return str;
            }
            return this.each(function(){
                var pagin = $('<div class="pagin">');
                var pages = genPagin(opt.totalPages,opt.current);
                pagin.append(pages);
                pagin.find('a:not(.current)').click(function(){
                    if(opt.callback){
                        opt.callback.call(this,opt,genPagin);
                    }
                    
                });
                $(this).html(pagin);
           });
        },
        tipImageShow : function(){
            return this.each(function(){
                var showTip = $($(this).attr('show')),top,left,windowW,WindowH;
                $(this).hover(function(e){
                    var img = new Image();
                    img.src = $(this).attr('href');
                    if(img.width>350){
                        img.height = img.height*350/img.width;
                        img.width = 350;
                    }
                    windowW = $(window).width();
                    windowH = $(window).height();
                    left = $(this).offset().left+$(this).width();
                    top = $(this).offset().top+$(this).height();
                    if($(this).attr("href").indexOf("baidu")<0){
                        showTip.attr('src',$(this).attr('href')).width(img.width).height(img.height).show();
                    }else{
                        showTip.attr('src',$(this).attr('href')+'&rnd='+Math.random()).width(img.width).height(img.height).show();
                    }
                    // console.log(windowH+'/'+top);
                    left -= windowW-$(this).offset().left+$(window).scrollLeft()<img.width? img.width:0;
                    top -= windowH-$(this).offset().top+$(window).scrollTop()<(img.height+20)? (img.height+25):0;
                    // console.log(top);
                    showTip.css('left',left);
                    showTip.css('top' ,top);
                },function(e){
                    showTip.hide().attr('src','');//'/images/ajax-loader.gif'+'?rnd='+Math.random());
                });
            });
        },
        umSlider : function(method){
            var methods = {
                init: function(opt){
                    var defaultOpt = {
                        speed: 10, //ms
                        step: 1,
                        auto: false,
                        leftBtn: null,
                        direction: 'left',
                        rightBtn: null,
                        stop: false,
                        pauseOnHover: false,
                        pagin: null,
                        slideIndex: 0
                    };
                    opt = $.extend(defaultOpt,opt || {});
                    return this.each(function(){
                        var that = this;
                        var h = $('li',this).outerHeight();
                        var w = $('li',this).outerWidth();
                        $(this).css({
                            width: w + 'px',
                            height: h + 'px',
                            overflow: 'hidden',
                            position: 'relative',
                            zoom: 1
                        });
                        $('ul',this).css({width: w * $('li',this).length + 'px',position: 'absolute'});
                        $('li',this).css({'float': 'left'});
                        if(opt.auto){
                            var autoRun = function(){
                                if(!opt.stop){
                                    $(that).umSlider(opt.direction == 'left' ? 'slideLeft' : 'slideRight',opt);
                                    setTimeout(function(){
                                        autoRun();
                                    },opt.speed);
                                }
                            };
                            setTimeout(function(){autoRun();},opt.speed);
                        }else{
                            opt.leftBtn.click(function(){
                                $(that).umSlider('slideRight',opt);
                            });
                            opt.rightBtn.click(function(){
                                $(that).umSlider('slideLeft',opt);
                            });
                        }
                    });
                },
                slideLeft: function(opt){
                    opt = opt || {step:1};
                    var w = $('li',this).outerWidth();
                    var childrenSize = $('li',this).length;
                    if(opt.slideIndex < childrenSize - 1 ){
                        ++opt.slideIndex;
                        $('ul',this).animate({left: ('-=' + opt.step * w)},300,function(){
                            opt.pagin.children('.sel').removeClass('sel');
                            opt.pagin.children().eq(opt.slideIndex).addClass('sel');
                        });
                    }else{
                        opt.stop = true;
                    }
                },
                slideRight: function(opt){
                    opt = opt || {step:1};
                    var w = $('li',this).outerWidth();
                    if(opt.slideIndex > 0){
                        --opt.slideIndex;
                        $('ul',this).animate({left: ('+=' + opt.step * w)},300,function(){
                            opt.pagin.children('.sel').removeClass('sel');
                            opt.pagin.children().eq(opt.slideIndex).addClass('sel');
                        });
                    }else{
                        opt.stop = true;
                    }
                }
            };
            if ( methods[method] ) {
                return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
            } else if ( typeof method === 'object' || ! method ) {
                return methods.init.apply( this, arguments );
            } else {
                $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
            }
        }
    });
    //以下添加的静态方法
    $.extend({
        getSearchParamVal : function(url,param){
            var result =  new RegExp(param+'='+'([^&]*)&?','i').exec(url);
            return result?result[1]:"";
        },
        renderNormalChartOpt : function(rendObj,data,xAixs){
            rendObj.renderChart(
                {
                    chart: {
                        renderTo: rendObj.attr('id')
                    },
                    title:"",
                    xAxis: {
                        categories: xAixs,
                        labels:{
                            align:"right",
                            step: parseInt(xAixs.length / 7)
                        }
                    },
                    series: data
                });
        },
        getToken:function (){
            return Math.random().toString(16).substring(2);
        },
        tabSlideTo : function(self,opt){
            var tabfor = $(self.attr('tabfor'));
            var index = opt.tabfors.children('.tab_show').index(tabfor);
            opt.tabfors.children('.tab_show').removeClass('dn sel');
            tabfor.addClass('sel');
            opt.tabfors.animate({left:(-1000*index)+'px'},500,'easeInOutCubic',function(){
                // opt.tabfors.css('left',0);
                // tabfor.siblings('.tab_show').addClass('dn');
                $.bodyAutoFit();
            });
        },
        //底部适应不同高度的body
        bodyAutoFit : function(){
            var height=0;
            var selBody = $('.bodys .body.sel');
            var selSubBody = selBody.find('.sub_body.sel');
            if(selSubBody.length>0){
                height = selSubBody.outerHeight()+40;
            }else{
                height = selBody.outerHeight();
            }
            $('.bodys').animate({'height':height+'px'},300,'easeOutCubic');
        },
        cookie_get :function (k) {
            var h = document.cookie.split("; ");
            g = h.length;
            f = [];
            for (var j = 0; j < g; j++) {
                f = h[j].split("=");
                if (k === f[0]) {
                    return unescape(f[1]);
                }
            }
            return null;
        },

        cookie_set : function (f, g,del) {
            var h = new Date();
            if(!del){
                 h.setDate(h.getDate() + 1);
             }else{
                h.setDate(h.getDate() - 10);
             }
            document.cookie = f + "=" + escape(g) + "; expires=" + h.toGMTString()+"; path=/";
        },

        popBox : function(opt){
            var defaultOpt = {
                h_title:"test",
                body:'',
                animation:'slideFromTop',
                width:518,
                dialog_id:'dialog_' + $.getToken(),//dialog 唯一标示符
                b_title:"",
                callback:null,
                closeHash:"",
                buttons:[{'name':'ok','className':'','click':null}]
            };
            $.removePopBox();
            opt = $.extend(defaultOpt,opt||{});
            $('body').append($('#pop-box').tmpl(opt)).css({"overflowY":"hidden"});

            var dialog = $('#'+opt.dialog_id).find('.pop_dialog');
            dialog.attr('route',opt.closeHash);
            dialog.css({'width':(opt.width+20)+'px'});
            $.each(opt.buttons,function(i,e){
                var btn = $('<button id="btn_'+i+'" class="btn_mid_green ' + e.className + '">' + e.name + '</button>');
                if(typeof e.click == 'function'){
                    btn.on('click',e.click).data('opt',opt).appendTo(dialog.find('.pop_dialog_foot .buttons'));
                }
            });

            $('#'+opt.dialog_id).fadeIn(300,function(){
                dialog.css({top:-dialog.height()+'px'});
                var top ;
                if(typeof opt.callback =='function'){
                    opt.callback(opt);
                }
                top = ($(window).height()-dialog.height())/2;
                if(opt.animation=='fade'){
                    dialog.css({top:(top<0?0:top)+'px'}).fadeIn(300);
                }else{
                    dialog.animate({top:(top<0?0:top)+'px'},300,function(){
                    });
                }
                $('#'+opt.dialog_id).find('.close').on('click',function(){
                    $.closePopBox($(this).closest('.pop_dialog'),opt);
                });
            });

           
            // console.log(dialog.offset().top);
            // console.log(dialog.offset().left);
        },
        removePopBox : function(){
            $('body .mark').remove();
            $('body').css({overflowY:'auto'});
            // location.hash="#!#";
        },
        closePopBox : function(dialog,opt){
            location.hash = $.hashCache[$.hashCache.length-1];
            function closeCallBack(){
                $(this).closest('.mark').fadeOut(300).remove();
                $('body').css({overflowY:'auto'});
            }
            if(opt&&opt.animation=='fade'){
                dialog.fadeOut(300,function(){
                    closeCallBack.call(this);
                });
            }else{
                dialog.animate({top:-dialog.height()+'px'},300,function(){
                    closeCallBack.call(this);
                });
            }

        },
        //初始化table hover 显示按钮
        initHoverShow : function(obj){
            $('dl.combine_val:not(.noshow)',obj).hover(function(){
                $(this).stop().animate({top:'-45px'},500,'easeInOutCubic');
            },function(){
                $(this).stop().animate({top:'0'},500,'easeInOutCubic');
            });
            $('td',obj).hover(function(){
                $('.hover_show',this).stop().animate({right:'0'},500,'easeInOutCubic');
            },function(){
                $('.hover_show',this).stop().animate({right:'-100px'},500,'easeInOutCubic');
            });
        },
        //自定义提示填出窗口
        alert : function(text,opt){
            var defaultOpt = {
                h_title:"提示:",
                body:'',
                animation:'fade',
                width:240,
                dialog_id:'dialog_' + $.getToken(),//dialog 唯一标示符
                b_title:"",
                callback:null,
                buttons:[
                            {
                                'name':'关闭',
                                'class':'',
                                'click':function(){
                                    $.closePopBox($(this).closest('.pop_dialog'),{animation:'fade'});
                                    return false;
                                }
                            }
                        ]
            };
            defaultOpt.body = '<div style="background:white;line-height:30px;padding:10px;">'+text+'</div>';
            opt = $.extend(defaultOpt,opt||{});
            $.popBox(opt);
        },
        confirm : function(text,opt){
            var defaultOpt = {
                buttons : [
                            {
                                'name':'确定',
                                'class':'',
                                'click':function(){
                                    // console.log($(this).data('opt'));
                                    var opt = $(this).data('opt');
                                    if(typeof opt.sure == 'function'){
                                        opt.sure.call(this,opt);
                                    }
                                    $.closePopBox($(this).closest('.pop_dialog'),{animation:'fade'});
                                    return true;
                                }
                            }, {
                                'name':'取消',
                                'class':'',
                                'click':function(){
                                    $.closePopBox($(this).closest('.pop_dialog'),{animation:'fade'});
                                    return false;
                                }
                            }
                        ]
            };
            opt = $.extend(defaultOpt,opt||{});
            $.alert(text,opt);
        },
        pieInit :function (obj){
            if (window.PIE && ~~$.browser.version < 9) {
                obj.find('.pie').each(function() {
                    PIE.attach(this);
                });
            }
        },
        upload : function (obj,uploadType,feedback,callback,form,landingSize){
            function beginUpload(){
                uploadFileWait = true;
                $(form).removeAttr('novalidate');
                var old_action = $(form).attr('action');
                $(form+'_uploadType').val(uploadType);
                $(form+'_fileObject').val(obj.id);
                $(form+'_feedback').val(feedback);
                $(form+'_callback').val(callback);
                $(form).attr('target', "uploadFrame");
                $(form).attr('action', "/upload/uploadFile");
                $(form)[0].submit(); //用dom的submit 避开由于jquery validate的验证导致不能上传的bug
                $(form).attr('target',"_self");
                $(form).attr('action', old_action);
            }
            if(obj){
                if($.verify_file($(obj))){
                    $(obj).parent().find('#loadingStatus').remove();
                    $(obj).parent().after('<img id="loadingStatus" src="/imgs/xp/ajax-load.gif" width="20" height="20"/>');
                    
                    if(landingSize && landingSize != '-'){
                        var size = landingSize.split('x');
                        $(form+'_width').val(size[0]);
                        $(form+'_height').val(size[1]);
                    }
                    // console.log(uploadFileWait);
                   if(!uploadFileWait){
                        
                        beginUpload();
                   }else{
                        uploadFileHd = setInterval(function(){
                            if(uploadFileWait){
                                return false;
                            }else{
                                beginUpload();
                                clearInterval(uploadFileHd);
                            }
                        },200);
                   }
                   
                }else{
                    // $.alert('请上传类型为'+$(obj).attr('rule')+'的文件!'+'大小不能超过'+$(obj).attr('filesize')+'K');
                }
            }
        },
        verify_file : function(obj,noerror){
            var patt=new RegExp($(obj).attr('rule'),"gi");
               
            if (!patt.test(obj.val())) {
                if(!noerror){
                    obj.closest('td').next().html("<span class='err'>" + $(obj).attr('title') + "</span>");
                }
                obj.focus();
                return false;
            } else{
                var fileSizeTooLarge = false;
                if(obj[0].files){
                    fileSizeTooLarge = (obj[0].files[0].size/1024 > parseInt(obj.attr('filesize')));
                }else{
                    try{
                        var fso = new ActiveXObject("Scripting.FileSystemObject");
                        fileSizeTooLarge = (fso.GetFile(obj.val()).size/1024 > parseInt(obj.attr('filesize')));
                    }catch(e){
                        obj.closest('td').next().html("<span class='err'>建议使用非ie内核浏览器</span>");
                    }
                    
                }
                if(fileSizeTooLarge){
                    if(!noerror){
                        obj.closest('td').next().html("<span class='err'>文件不得大于" + obj.attr('filesize') + "K</span>");
                        obj.focus();
                    }
                    return false;
                }else{
                    obj.closest('td').next().find(".err").remove();
                    return true;
                }
            }
        }

    });
})(jQuery);
