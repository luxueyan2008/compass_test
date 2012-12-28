var target = 'campaign';
function in_array(id_array, e) {
	for (i = 0; i < id_array.length; i++) {
		if (id_array[i] == e)
			return true;
	}
	return false;
}

//Array.prototype.clear = function() {
//	this.length = 0;
//}
//Array.prototype.insertAt = function(index, obj) {
//	this.splice(index, 0, obj);
//}
//Array.prototype.removeAt = function(index) {
//	this.splice(index, 1);
//}
//Array.prototype.remove = function(obj) {
//	var index = this.indexOf(obj);
//	if (index >= 0) {
//		this.removeAt(index);
//	}
//}
//
//Array.prototype.getIndexByValue= function(value)  
//{
//    var index = -1;  
//    for (var i = 0; i < this.length; i++)  
//    {  
//        if (this[i] == value)  
//        {  
//            index = i;  
//            break;  
//        }  
//    }  
//    return index;  
//}
function GetCookieVal(offset)//后面有调用
//获得Cookie解码后的值
{
	var endstr = document.cookie.indexOf (";", offset);
	if (endstr == -1)
		endstr = document.cookie.length;
	return unescape(document.cookie.substring(offset, endstr));
}
/**
* 写Cookie
*/
function SetCookie(name, value)
//设定Cookie值
{
	var expdate = new Date("June 3, 2999");
	var path = '/';
	var domain = null;
	var secure = false;
	var cookiestr = name + "=" + escape (value) +"; expires="+ expdate.toGMTString()
	+((path == null) ? "" : ("; path=" + path)) +((domain == null) ? "" : ("; domain=" + domain))
	+((secure == true) ? "; secure" : "");
	document.cookie = cookiestr;
}
/**
* 读Cookie
*/
function GetCookie(name)
//获得Cookie的原始值
{
	var arg = name + "=";
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;
	while (i < clen)
	{
		var j = i + alen;
		if (document.cookie.substring(i, j) == arg)
			return GetCookieVal (j);
		i = document.cookie.indexOf(" ", i) + 1;
		if (i == 0) 
			break;
	}
	return null;
}
//单个checkbox onchange
function checkSing(id){
	var id_array = $("#ids").val().split(",");
	if(in_array(id_array,id)){
		for(var i=0;i<id_array.length;i++){
			if(id==id_array[i]){
				id_array.removeAt(i);
			}
		}
	}else{
		id_array.push(id);
	}
	$("#ids").val(id_array.join(","));
	display();
}
function display() {
	var ids = $("#ids").val();
	if(ids==""){
	  	$(".fl.operate").find('a:not(:last)').attr("class",'btn_down');
	}else{
		$(".fl.operate").find('a:not(:last)').attr("class",'btn_hover');
	}
}

//全选
function check(){
    var str="";
    if($('#checkedAll').attr("checked")=='checked'){
        $("input[name='cb']").each(function(){str+=$(this).val()+","; $(this).attr("checked",true);});
    }else{
        $("input[name='cb']").each(function(){$(this).attr("checked",false);});
    }
    $("#ids").val(str);
    display();
}
//单个操作

/*
function domainControl(ids,paramName,value){
		var id_array = ids.split(",");
		//修改状态值或者删除
		if("status"==paramName){
			for(var i=0;i<id_array.length;i++){
				var id = id_array[i];
				var td_dis_id = "#td_dis_" + id;
				var status_a_id = "#status_a_" + id;
				if(0==value){
					$(td_dis_id).html("有效");
					$(status_a_id).html("<a href=\"javascript:void(0);\" onclick=\"change('"+target+"',"+id+",'status',1);return false;\">暂停</a>")
				}else{
					$(td_dis_id).html("暂停");
					$(status_a_id).html("<a href=\"javascript:void(0);\" onclick=\"change('"+target+"',"+id+",'status',0);return false;\">启用</a>")
				}
			}
		}else{
			for(var i=0;i<id_array.length;i++){
				var tr_id = "#tr_"+id_array[i];
				$(tr_id).hide();
			}
		}
	}

*/

function get_ids(){
	var ids = "";
    $(".tr_pv").each(function() {
    	var id = $(this).attr("id").replace('tr_','');
        ids += id + ",";
    });
    return ids;
}



function load_report(report_name){
	var report_name = report_name;
	var ids = get_ids();
	var date_type = $("#dateType").val();
	var start_time = $("#startDate").val();
	var end_time = $("#endDate").val();
	if(ids.length > 1){
		get_report(report_name,ids,date_type,start_time,end_time);
	}
}

/**
 * 加载统计报告数据统计信息
 * @param report_name
 * @return
 */
function load_report_statistic(report_name){
	var report_name = report_name;
	var date_type = $("#dateType").val();
	var start_time = $("#startDate").val();
	var end_time = $("#endDate").val();
	clear_statistic();
	$.ajax({
		url:"/jsonreport/statistic",
		contentType :"application/json",
		cache:false,
		type:"GET",
		data:{reportName:report_name,dateType:date_type,startTime:start_time,endTime:end_time},
		dataType:"json",
		success: function(data){
			var show = data['show'];
			$('#show_statistic').html(show);
			var click = data['click'];
			$('#click_statistic').html(click);
			var consume = data['consume'];
			if(consume){
				consume=consume/1000000
			}
			$('#consume_statistic').html(consume);
			if (show>0){
				var ctr = Math.round(click/show*10000)/10000;
				$('#ctr_statistic').html(ctr);
			}
			if(click>0){
				var ppc = Math.round(consume/click*10000)/10000;
				$('#ppc_statistic').html(ppc);
			}			
		},
		error:function(){
			$("#info").html("加载pv失败！");
            $("#info").show();
		}
	 });
}
/**
 * 
 * @return
 */
/**
 * 表格中报告数据
 */
function get_report(report_name,ids,date_type,start_time,end_time){
	$.ajax({
		url:"/jsonreport/report",
		contentType :"application/json",
		cache:false,
		type:"GET",
		data:{reportName:report_name,ids:ids,dateType:date_type,startTime:start_time,endTime:end_time},
		dataType:"json",
		success: function(data){
			if(data.length>0){
				var id;
				for(var i=0;i<data.length;i++){					
					var obj = (data[i]);
					var id = obj['id'];
					var show = obj['show'];
					if(show){
						$('#show_'+id).html(show);
					}
					var click = obj['click'];
					if(click){
						$('#click_'+id).html(click);
					}					
					var download = obj['download'];
					if(download){
						$('#download_'+id).html(download);
					}					
					var consume = obj['consume']/1000000;
					if(consume){
						$('#consume_'+id).html('￥'+consume);
					}					
					var income = obj['income']/1000000;
					if(income){
						$('#income_'+id).html('￥'+income);
					}
					if (show>0){
						if(click>0){
							var ctr = Math.round(click/show*10000)/100;
							$('#ctr_'+id).html(ctr+"%");
						}
						if(download>0){
							var dtr = Math.round(download/show*10000)/100;
							$('#dtr_'+id).html(dtr+"%");							
						}
						if(income){
							var cpm = Math.round(income*1000/show*100)/100;
							$('#cpm_'+id).html('￥'+cpm);
						}						
					}
					if(click>0){
						if(consume){
							var ppc = Math.round(consume/click*100)/100;
							$('#ppc_'+id).html('￥'+ppc);
						}						
					}
				}
			}else{
				clear_report();
			}
		},
		error:function(){
			$("#info").html("加载pv失败！");
            $("#info").show();
		}
	 });
}
/**
 * 清除表格中统计报告数据
 * @return
 */
function clear_report(){
    $(".tr_pv").each(function() {
    	var id = $(this).attr("id").replace('tr_','');
    	var originalId = id;
    	if($("#in_"+id).val()){
    		originalId = $("#in_"+id).val();
    	}
		$('#show_'+originalId).html("--");
		$('#click_'+originalId).html("--");
		$('#download_'+originalId).html("--");
		$('#consume_'+originalId).html("--");
		$('#ctr_'+originalId).html("--");
		$('#dtr_'+originalId).html("--");
		$('#ppc_'+originalId).html("--");
		$('#income_'+originalId).html("--");		
		$('#cpm_'+originalId).html("--");
    });
}
/**
 * 清除汇总的统计信息数据
 * @return
 */
function clear_statistic(){
	$('#show_statistic').html("--");
	$('#click_statistic').html("--");
	$('#consume_statistic').html("--");
	$('#ctr_statistic').html("--");
	$('#ppc_statistic').html("--");
}
/**
 * 检查字符串是否是数字。
 */
function checkNumber(value){
    var patrn=/^[0-9]*(\.[0-9]{0,2})?$/; 
    if (!patrn.exec(value)){
    	return false;
    }
    var zeroFlag =/^[0]*(\.[0]{2})?$/ ;
    if (zeroFlag.exec(value)){
    	return false;
    }
    return true;
} 

/**
 * 对页面表单进行非空验证，传入的参数为2个数组，第一个数组是表单控件名，第二个数组是对应的控件的中文名称，用来进行提示
 * 第三个数组对应控件，置为1表明需要进行数字验证，0为不需要进行任何验证
 */
function checkNullByName(objNameArray, textAlertArray, numCheckArray){
	var message = "";
	for(var i=0;i<objNameArray.length;i++){
		if($.trim($("#"+objNameArray[i]).val()) == ""){
			message+=textAlertArray[i]+"不能为空\r\n";
		}else if(numCheckArray[i] == "1"){
			if(!checkNumber($("#"+objNameArray[i]).val())){
				message+="请输入正确的"+textAlertArray[i]+"\r\n";
			}
		}
	}
	if(message != ""){
		alert(message);
		return false;
	}
	return true;
}

function formatdate(date, fmt) {        
    var o = {        
    "M+" : date.getMonth()+1, //月份        
    "d+" : date.getDate(), //日        
    "h+" : date.getHours()%12 == 0 ? 12 : date.getHours()%12, //小时        
    "H+" : date.getHours(), //小时        
    "m+" : date.getMinutes(), //分        
    "s+" : date.getSeconds(), //秒        
    "q+" : Math.floor((date.getMonth()+3)/3), //季度        
    "S" : date.getMilliseconds() //毫秒        
    };        
    var week = {        
    "0" : "\u65e5",        
    "1" : "\u4e00",        
    "2" : "\u4e8c",        
    "3" : "\u4e09",        
    "4" : "\u56db",        
    "5" : "\u4e94",        
    "6" : "\u516d"       
    };        
    if(/(y+)/.test(fmt)){        
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));        
    }        
    if(/(E+)/.test(fmt)){        
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[date.getDay()+""]);        
    }        
    for(var k in o){        
        if(new RegExp("("+ k +")").test(fmt)){        
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));        
        }        
    }        
    return fmt;        
}  

var patrn=/^[0-9]*(\.[0-9]{0,2})?$/; 
var zeroFlag =/^[0]*(\.[0]{0,2})?$/;
$(function() {
   	 $(".not_null").bind('blur',null_bind);
	 $(".number").bind('blur',function(){
	     if(this.value != ""){
	    	 if (!patrn.test(this.value) || zeroFlag.test(this.value)){
	    		 $("#"+this.id+"_warning").attr("class","tips_week_warning warning");
	             $("#"+this.id+"_warning").html("输入类型不正确！");
	         }else{
	        	 $("#"+this.id+"_warning").attr("class","warning");
	             $("#"+this.id+"_warning").html("");
	         }
	     }
	 });
});
function null_bind(){
	if($.trim(this.value) != ""){
        $("#"+this.id+"_warning").attr("class","warning");
        $("#"+this.id+"_warning").html("");
    }else{
        $("#"+this.id+"_warning").attr("class","tips_week_warning warning");
        $("#"+this.id+"_warning").html("不能为空！");
    }
}
function checkSubmit(){
	$(".not_null").each(function(){
        if($.trim(this.value) != ""){
            $("#"+this.id+"_warning").attr("class","warning");
            $("#"+this.id+"_warning").html("");
        }else{
            $("#"+this.id+"_warning").attr("class","tips_week_warning warning");
            $("#"+this.id+"_warning").html("不能为空！");
        }
    });
    $(".number").each(function(){
        if(this.value != ""){
     	    if (!patrn.test(this.value) || zeroFlag.test(this.value)){
     	  	   $("#"+this.id+"_warning").attr("class","tips_week_warning warning");
               $("#"+this.id+"_warning").html("输入类型不正确！");
            }else{
         	    $("#"+this.id+"_warning").attr("class","warning");
                $("#"+this.id+"_warning").html("");
            }
        }
    });
    $(".file_not_null").each(function(){
        if($.trim(this.value) != ""){
            $("#"+this.id+"_warning").attr("class","warning");
            $("#"+this.id+"_warning").html("");
        }else{
            $("#"+this.id+"_warning").attr("class","tips_week_warning warning");
            $("#"+this.id+"_warning").html("请上传文件！");
        }
    });
    var null_flag = false;
   	$(".warning").each(function(){
       	if($.trim(this.innerHTML) != ""){
       		null_flag = true;
	    }
    });
    if(null_flag){
        alert("请正确填写相关内容！");
        return false;
    }
    return true;
}



function showAdgroup(campaignId){
	$.ajax({
		url:"/advertiser/campaign/adgroupList",
		contentType :"application/json",
		cache:false,
		type:"GET",
		data:{campaignId:campaignId}, 
		dataType:"json",
		success: function(data){
			$('#specifyAdgroup').val('0');
			var count = data.length;
			if(count>0){
				$('#select_adgroup_imitate').removeClass('disableShow');
				$('#select_adgroup_imitate').attr('onclick',"");
				var adgroupList = "";
				for(var i=0;i<count;i++){
					var adgroup = data[i];
					var name = adgroup.name;
					if(name.length>7){
						name = name.substring(0,7)+"..";
					}
					adgroupList+="<li><a href=\"#\" onclick=\"$('#adgroup_text').html('"+name
					+"');$('#specifyAdgroup').val('"+adgroup.id+"');\">"
					+name+"</a></li>";
				}
				$('#adgroupList_show').html(adgroupList);
			}else{
				$('#select_adgroup_imitate').addClass('disableShow');
				$('#select_adgroup_imitate').attr('onclick',"alert('当前选中的计划下没有广告组！');");
			}
		},
		error: function (XMLHttpRequest,textStatus,errorThrown){
			alert("请求失败XMLHttpRequest:"+XMLHttpRequest);//throw error
			alert("请求失败textStatus:"+textStatus);//throw error
			alert("请求失败errorThrown:"+errorThrown);//throw error
		} 
	 });
}

function doDirection(){
	var campaignId= $('#specifyCampaign').val();
	var adgroupId= $('#specifyAdgroup').val();
	if(campaignId == '0' && adgroupId == "0"){
		alert("请至少选择一个计划！");
		return;
	}
	if(adgroupId=="0"){
		window.location="/advertiser/adgroup/"+campaignId+"/index";
		return;
	}
	window.location="/advertiser/creative/"+adgroupId+"/index";
}

//if($(this).hasClass('radio_imitate_checked')){
//	alert('111111');
//	$('.text_ad').each(function(){
//		alert($(this));
//		$(this).show();
//	});
//	$('.banner_ad').each(function(){
//		$(this).hide();
//	});
//}
