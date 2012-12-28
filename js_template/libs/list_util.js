var url_status,uploadFileHd,uploadFileWait;
function pageAnchorsGenerate(totalPages,pageNo,pagerContainer,callback){
     function genPagin(totalPages,current){
        var str="",lowPageNo,upPageNo,viewCount = 3;
        //分页显示...逻辑
        lowPageNo = current - viewCount;
        upPageNo = current + viewCount;
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
    var pager = genPagin(totalPages,pageNo);
    // for (var i = 1; i <= totalPages; i++) {
    //     if (i == pageNo) pager += '<span>' + i + '</span>';
    //     else pager += '<a page="'+ i +'" class="pageChange">' + i  + '</a>';
    // }
    pagerContainer = (pagerContainer && pagerContainer !== '') ? pagerContainer : '#pager';
    $(pagerContainer).html("").append(pager).find('a:not(.current)').unbind('click').click(function(){
        callback($(this).attr('p'),url_status);
    });

    $("#loading_row_init").remove();
}
function loginValidate(data){
    if(data.status == 'login') {
        location.pathname = '/login';
        return false;
    }
}
;(function(){
    $.fn.loadDocFile = function(file){
        return this.each(function(){
            var that = this;
            $.getJSON('http://dev.umeng.com/docs?jsoncallback=?&file=' + file, function (data) {
                $(that).html(data.data);
                setTimeout(function () {
                        setupZoom();
                        $('pre',that).each(function(i, e) {hljs.highlightBlock(e, '    ')});
                    }
                    , 10);
                if(location.hash.length > 0){
                   location = location;
                }
            });
        });
    }
})(jQuery);
function stopBubble(e){
    try{
        e.stopPropagation;
    }catch(err){
        e.cancelBubble == true;
    }
}
// html5 api 调用逻辑
function runPrefixMethod(element, method) {
    var usablePrefixMethod;
    $.each(["webkit", "moz", "ms", "o", ""],function(i,prefix) {
        if (usablePrefixMethod) return;
        if (prefix === "") {
            // 无前缀，方法首字母小写
            method = method.slice(0,1).toLowerCase() + method.slice(1);
            
        }
        
        var typePrefixMethod = typeof element[prefix + method];
        if (typePrefixMethod + "" !== "undefined") {
            if (typePrefixMethod === "function") {
                usablePrefixMethod = element[prefix + method]();
                usablePrefixMethod = true;
            } else {
                usablePrefixMethod = element[prefix + method];
            }
        }
    });
    return usablePrefixMethod;
}
/*全屏函数*/
function fullScreenSet(obj,fullObj){
    fullObj = fullObj || obj[0];
    obj.append('<div class="fullscreen" title="点击全屏"></div>');
    obj.find('.fullscreen').click(function(){
        var that = this;
        if (typeof window.screenX === "number") {
            if (runPrefixMethod(document, "FullScreen") || runPrefixMethod(document, "IsFullScreen")) {
                runPrefixMethod(document, "CancelFullScreen");
                that.title = that.title.replace("退出", "全屏");
            } else if (runPrefixMethod(fullObj, "RequestFullScreen")) {
                that.title = that.title.replace("点击全屏", "点击退出");
            }else {
                alert("您的浏览器不支持全屏,请使用chrome,firefox等高级浏览器!");
            }
        } else {
            alert("您的浏览器不支持全屏,请使用chrome,firefox等高级浏览器!");
        }
    });
}
/*
 *自适应浮动层高度
 */
function adjustMsg() {
    // var body = $('.msg_pos').is(':visible')?$('.msg_pos'):($('.msg_ad').is(':visible')?$('.msg_ad'):$('#get_code'));
    // $("body>.blockMsg").stop(true).animate({top:$(window).height()/2 - (body.height() / 2) + "px"},300);
    var nowTop = $(window).height()/2 - ($('.blockMsg .msgForm').height() / 2);
    nowTop = nowTop<0?0:nowTop;
    $(".blockMsg").css({top:nowTop + "px"});
}
/**
 * 弹窗
 * @param  {[msg]} msg [弹窗内容]
 */
function popBox(msg){
    var height = $(window).height(),
        width = $(document).width(),
        nowTop = height/2 - (msg.height() / 2);
        nowTop = nowTop<0?0:nowTop;
        $.blockUI({
                css: {overflow:'hidden',height:0,position:'relative',color: '#cccccc',border:'0',width:'722px','left' : width/2 - (msg.width() / 2),'top' :nowTop ,background:'none',padding:'0px'},
                // css: {width:'722px',position:'relative',color: '#cccccc',border:'0','margin':(height/2 - (msg.height() / 2)) +'px auto ',background:'none',padding:'0px'},
                overlayCSS:  {
                    backgroundColor:' rgba(0,0,0,.5)',
                    opacity:1,
                    overflow:'auto'
                },
                allowBodyStretch: true,
                message: msg,
                onBlock:function(){
                    $('.blockOverlay').append($('.blockMsg'));
                    $('body').css({'overflow-y':'hidden'});
                    $('.blockMsg').css({height:'auto',overflow:'visible'});
                }
        });
}
function set_date_param(dateType, startDate, endDate){
    $("#dateType").val(dateType);
    $("#startDate").val(startDate);
    $("#endDate").val(endDate);
}
//选择所有列表
function checkAll(check_button, name){
     $("input[name="+name+"]").prop("checked", $(check_button).prop("checked"));
}
//广告选择广告位的逻辑
function checkAllAdSlot(check_button, name){
     if($(check_button).prop("checked")){
         if($("input[name="+name+"]:checked").length>0){
           $("input[name="+name+"]").not(':disabled').prop("checked", true);
         }else{
             $(check_button).prop("checked",false);
             alert('操作错误!不能全选所有广告位!请先选择一个广告位!');
         }
     }else{
         $("input[name="+name+"]").prop('disabled',false).prop("checked", false).closest('tr').css({color:'black'});
     }
}
//全局操作 状态态设置 begin
function change(input, target,paramName,value, recordDesc){
    var ids =$("input[name='"+input+"']:checked").map(function(){
        return $(this).val();
    }).get().join(',');
    if(ids!==""){
        if(value.indexOf("delete")>-1){
            if(confirm("你确定需要删除当前选中项吗?")){
                globalChangeSubmit(target, paramName,value,ids,input);
            }
        }else{
            globalChangeSubmit(target, paramName,value,ids,input);
        }
    }
}
function globalChangeSubmit(url, paramName,value,ids,input){
    //url = "/"+target+"/changes?";
    //url = "/changes?";
    $.ajax({
        type: "GET",
        url: url,
        data: "ids=" + ids + "&paramName=" + paramName + "&value=" + value,
        success: function(msg){
            refreshListAfterChange(paramName, value, ids,input);
        //                $('tr.expend_panel').find('div').load("/adslot/showAd/" + $('tr.expend_panel').prev('tr').attr('id').replace('tr_'));
        }
    });
}
function refreshListAfterChange(paramName, value, ids,input){
   if(value.indexOf("delete")>-1){
       //$("input[name='"+input+"']:checked").closest('tr').remove();
       loadList(1);
   }else{
       var idArray=ids.split(",");
       for(var index=0; index<idArray.length; index++){
           var id=idArray[index];
           if("status"==paramName && value.indexOf("normal")>-1){
                $("#td_status_"+id).html("<img src='/images/icon_state_normal.gif' width='16' height='16' alt='正常' />正常").attr('status',value);
           }else if("status"==paramName &&  value.indexOf("pause")>-1){
                $("#td_status_"+id).html("<img src='/images/icon_state_pause.gif' width='16' height='16' alt='暂停' />暂停").attr('status',value);
           }
       }
       if($('tr.expend_panel').length){
            var id = $('tr.expend_panel').prev().attr('id').replace('tr_','');
            adList.param.listUrl = adList.param.baseUrl+ id;
            adList.loadList(adList.param.data.pageNo,$('tr.expend_panel').prev(),true);
       }
     
   }
// $(':checkbox').prop('checked',false);
// loadList(1);
}
//全局操作 状态态设置 end
/**
 * 日期类型变更处理
 * @param report_name
 * @return
 */
function list_datetype_change(load_date, clear_data){
    if($("#dateType").val() != "Custom"){
        var today=new Date();
        if($("#dateType").val() == "Yesterday"){
            var yesterday=new Date();
            yesterday.setDate(today.getDate()-1);
            $("#startDate").val(formatdate(yesterday, "yyyy-MM-dd"));
            $("#endDate").val(formatdate(yesterday, "yyyy-MM-dd"));
        }else if($("#dateType").val() =="Today"){
            $("#startDate").val(formatdate(today, "yyyy-MM-dd"));
            $("#endDate").val(formatdate(today, "yyyy-MM-dd"));
        }else{
            var sixDayBefore=new Date();
            sixDayBefore.setDate(today.getDate()-6);
            $("#startDate").val(formatdate(sixDayBefore, "yyyy-MM-dd"));
            $("#endDate").val(formatdate(today, "yyyy-MM-dd"));
        }
        change_querylink();
        load_date();
    }else{
        clear_data();
    }
}
/**
 * 自定义时间段查询按钮单击处理
 * @param report_name
 * @return
 */
function list_updatebutton_click(load_date, clear_data){
    var start_time = $("#startDate").val();
    var end_time = $("#endDate").val();
    if(start_time==='' || end_time===''){
        alert("请输入日期范围！");
    }else{
        $("#dateType").val("Custom");
        change_querylink();
        load_date();
    }
}
/**
 * 日期查询条件变化时更新“分页”与“导出CSV”链接的URL
 * @return
 */
function change_querylink(){
    $(".queryLink").each(function() {
        var url=$(this).attr("href");
        if(url.indexOf("?")<0){
            url+="?";
        }
        url=url.replace(/&dateType=[^&]*/,'');
        url=url.replace(/&startDate=[^&]*/,'');
        url=url.replace(/&endDate=[^&]*/,'');
        url=url+"&dateType="+$("#dateType").val();
        url=url+"&startDate="+$("#startDate").val();
        url=url+"&endDate="+$("#endDate").val();
        $(this).attr("href", url);
    });

}
//数组取交集
function intersectArray (arrayA,arrayB){
    var intersect = [];
    for(var key in arrayA){
        intersect[key]= (arrayA[key]&&arrayB[key]);
    }
    return intersect;
}
//更改上传按钮的显示方式
$('tr td  a.changeIcon').click(function(){
    $(this).hide().next('span').hide().prevAll('input').show();
});
function changeUploadStyle(obj){
    var inputs = obj||$('tr input[verify="file"]');
    inputs.each(function(i,e){
        $(e).siblings('.err').remove();
        if($(e).val()==''){
            $(e).prevAll('span,a').hide().filter('span').html('');
            $(e).prevAll('input[type="file"]').show();
        }else{
            $(e).prevAll('span,a').show().filter('span').html('<a class="view_icon" target="_blank" href="'+ $(e).val() +'">/upload/public/...</a>');
            $(e).prevAll('input[type="file"]').hide();
        }
    });
}

function upload(obj,uploadType,feedback,callback,form,landingSize){
    function beginUpload(){
        uploadFileWait = true;
        var old_action = $(form).attr('action');
        $(form+'_uploadType').val(uploadType);
        $(form+'_fileObject').val(obj.id);
        $(form+'_feedback').val(feedback);
        $(form+'_callback').val(callback);
        $(form).attr('target', "uploadFrame");
        $(form).attr('action', "/upload/uploadFile");
        $(form).submit();
        $(form).attr('target',"_self");
        $(form).attr('action', old_action);

    }
    if(obj){
        if(verify_file($(obj),$(obj).attr('title'),$(obj).attr('rule'),false,true)){
            $(obj).parent().append('<img id="loadingStatus" src="/images/roller.gif" width="25" height="25"/>');
            
            if(landingSize && landingSize != '-'){ //landingsize 为'-' 会造成后台bug 所以要判断(因为之前没有文字链上传文件的逻辑)
                var size = landingSize.split('x');
                $(form+'_width').val(size[0]);
                $(form+'_height').val(size[1]);
            }
           if(!uploadFileWait){
                
                beginUpload();
           }else{
                uploadFileHd = setInterval(function(){
                    if(uploadFileWait){
                        // console.log('wait');
                        return false;
                    }else{
                        // console.log('begin');
                        beginUpload();
                        clearInterval(uploadFileHd);
                    }
                },200);
           }
           
        }else{
            alert('请上传类型为'+$(obj).attr('rule')+'的文件!'+'大小不能超过'+$(obj).attr('filesize')+'K');
        }
    }
}
function initUISelect(){
    $('.ui_select').unbind("click").click(function(e){
        if($.browser.msie && ($.browser.version < "7.0")){
            if($(this).children('.pop_menu').height()>150){
                $(this).children('.pop_menu').css('height','144px');
            }
        }
        $(this).children('.pop_menu').slideToggle(300);
        stopBubble(e);
    });
    $('.ui_select').delegate(".pop_menu li a","click",function(){
        $(this).closest('.ui_select').find('.text').html($(this).html()).attr('title',$(this).html());
        $('input[name="'+$(this).attr('pointto')+'"]').val($(this).attr('content')).trigger('change');
    });
    $(document).unbind("click").click(function(){
        $('.ui_select .pop_menu').hide();
    });
}
function selectCreate(obj,opt){
    var defaultOpt = {
        defaultVal: '请选择',
        pointTo: '',
        list:[]
    };
    var dataOpt = {

    };
    opt = $.extend(defaultOpt,opt || {});
    obj.html($('#tmpl-select').tmpl(opt,dataOpt));
}
function stopBubble(e){
    if (e.stopPropagation) e.stopPropagation();
    else e.cancelBubble = true;
}


/*
 * 验证空和验证文件
 */
function verify_null(obj, msg, newline,errPrevObj,params) {
    var param = {
        nul:true,
        num:'no',
        digits:'no',
        max:'no',
        min:'no',
        maxLength:'no',
        minLength:'no',
        fixLength:'no',
        url:'no'
    };
     $.extend(param,params);
    //验证规则
    var validate = {
        isNul : function(value){
            return value.replace(/(^\s*)|(\s*$)/g,'') != ""?{pass:true}:{pass:false,msg:'不能为空'};
        },
        isNumberic: function(value){
            return parseFloat(value) == value?{pass:true}:{pass:false,msg:'输入数字格式'};
        },
        isDigit : function(value){
            return (parseInt(value) == value&&value>0)?{pass:true}:{pass:false,msg:'输入正整数'};
        },
        maxV: function(value,maxV){
            return parseInt(value) <= parseInt(maxV)?{pass:true}:{pass:false,msg:'不能大于 ' + maxV};
        },
        minV: function(value,minV){
            return parseInt(value) >= minV?{pass:true}:{pass:false,msg:'不能小于 ' + minV};
        },
        maxLength:function(value,maxLength){
            return value.length <= maxLength?{pass:true}:{pass:false,msg:'长度不能大于 ' + maxLength};
        },
        minLength:function(value,minLength){
            return value.length >= minLength?{pass:true}:{pass:false,msg:'长度不能小于 ' + minLength};
        },
        fixLength:function(value,fixLength){
            if($.type(fixLength) == 'number'){
                return value.length == fixLength?{pass:true}:{pass:false,msg:'固定长度为 ' + fixLength};
            }else if($.type(fixLength) == 'array'){
                return !!~$.inArray(value.length ,fixLength)?{pass:true}:{pass:false,msg:'固定长度为 ' + fixLength};
            }
        },
        url:function(value){
            var reg =/^(http:|https:|telephone:|sdk:)\/\//ig;
            if(reg.test(value) && $.trim(value.replace(reg,''))===''){
                return {pass:false,msg:'请输入正确的url'};
            }else{
                return {pass:true};
            }
        }
    };
    var prevObj = errPrevObj?errPrevObj:obj,req = {pass:true},
    val = obj.val();
    if (val.indexOf('<')>-1||val.indexOf('>')>-1||val.indexOf('script')>-1||val.indexOf('eval')>-1){
        req = {
           pass : false,
           msg : '字符不符合规则'
        }
        
    }else{
        (function(){
            var validateList = ['isNul','isNumberic','isDigit','maxV','minV','maxLength','minLength','fixLength','url'];
            var index = 0;
            $.each(param,function(i,e){
                if( e!='no' && req.pass){
                    req=validate[validateList[index]](val,e);
                   
                }
                index++;
            });
        })()
    }
   if ( req.pass == false) {
        obj.parent().find(".err").remove();
        if (newline) {
            prevObj.after("<div class='err'>" + req.msg + "</div>");
        }
        else {
            prevObj.after("<span class='err'>" + req.msg + "</span>");
        }
        obj.focus();
        return false;
    } else {
        obj.parent().find(".err").remove();
        return true;
    }
}
function verify_file(obj,msg,type,newline,noerror){
    var patt=new RegExp(type,"gi");
       
    if (!patt.test(obj.val())) {
        // console.log(obj.val());
        if (obj.parent().find(".err").length == 0) {
            if(!noerror){
                if (newline) obj.after("<div class='err'>" + msg + "</div>");
                else obj.after("<span class='err'>" + msg + "</span>");
            }
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

            }
            
        }
        if(fileSizeTooLarge){
            if(!noerror){
                if (obj.parent().find(".err").html() == null) {
                if (newline) obj.after("<div class='err'>文件不得大于" + obj.attr('filesize') + "K</div>");
                else obj.after("<span class='err'>文件不得大于" + obj.attr('filesize') + "K</span>");
            }
            obj.focus();
            }
           
            return false;
        }else{
            obj.parent().find(".err").remove();
            return true;
        }
    }
}
//生成随机码
function getToken(){
    return Math.random().toString(16).substring(2);
}
$(function() {
    initUISelect();
    // umengRadioImitate();//radio_imitate
    // umengSelectIitate_withoutValue();//select_imitate
    $(window).resize(function(){
        adjustMsg();
    });
   //状态切换
    $('.part_operation dd a').click(function(){
        change('record_ch', $(this).attr('action')+'/changes?','status',$(this).attr('status'));
        change('adStatusChange', '/ad/changes?','status',$(this).attr('status'));
        return false;
    });
    //状态筛选
    $('#container').delegate('.state_panel li','click',function(e){
        e.stopPropagation();
        if($(this).find('input').val()=='all'){
            if($(this).find('input').prop('checked'))
                $('.state_panel ul li').not(':last').find('input[type="checkbox"]').prop('checked',!$(this).find('input').prop('checked'));
        }else{
            $(".state_panel li:last").find('input').prop('checked',false);
        }
    });
    //切换状态筛选栏
    $('#container').delegate(".state",'click',function() {
        if ($(this).find(".state_panel").is(":hidden")) {
            var width = parseInt($(this).width()) + 10;
            $(this).addClass("show").find(".state_panel").width(width).show();
                    
        }
        else {
            $(this).removeClass("show");
            $(this).find(".state_panel").hide();
        }
    });
    //
    $('#container').delegate(".btn_change_state",'click',function(e) {
        e.stopPropagation();
        // var  empty = 1,
        //4种筛选状态
        var status = [
        { name:'正常', query:'normal'}, //0
        { name:'应用暂停',query:'app_pause'}, //1
        { name:'暂停', query:'pause'}, //2
        { name:'到达预算',query:'limit'}, //3
        { name:'订单暂停',query:'adorder_pause'},//4
        { name:'投放完成',query:'finish'},//5
        { name:'订单投放完成',query:'adorder_finish'},//6
        { name:'尚未投放',query:'ready'},//7
        { name:'订单尚未投放',query:'adorder_ready'},//8
        { name:'iOS',query:'iOS'},//9
        { name:'Android',query:'android'}//10
        ],
        str = "";
        count = 0;
        url_status = "";
        $(this).closest('.state').find(".state_panel li").not(':last').find("input[type='checkbox']:checked").each(function() {
            // empty = 0;
            count++;
            // str += '<span class="'+$(this).siblings('label').attr('class')+'">'+status[$(this).val()].name+'</span>';
            if($(this).siblings('label').hasClass('platform')){
                url_status += "&platform=" + status[$(this).val()].query;
            }else{
                url_status += ("&status=" +($(this).attr('pausetype')?($(this).attr('pausetype')+'_'):'')+ status[$(this).val()].query);
            }

        });
        if (count === 0) {
            str = '<span class="none">未筛选</span>';
            url_status='';
        }else{
            str = '<span class="none">'+ count +'个筛选条件 </span>';
        }
        $(this).closest('.state').find(".state_info").html(str);
        $(this).closest('.state').removeClass("show");
        $(this).closest('.state').find(".state_panel").hide();
        loadList(1, url_status);
    });
})