//默认加载主界面
$(function(){
	
	initCurrentUser();
	
	left_menu_attach_click();
});
/**
 * JS获取浏览器版本
 */
var Sys = {};
var ua = navigator.userAgent.toLowerCase();
var s;
(s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
//    if (Sys.ie) $('span').text('IE: ' + Sys.ie);
//    if (Sys.firefox) $('span').text('Firefox: ' + Sys.firefox);
//    if (Sys.chrome) $('span').text('Chrome: ' + Sys.chrome);
//    if (Sys.opera) $('span').text('Opera: ' + Sys.opera);
//    if (Sys.safari) $('span').text('Safari: ' + Sys.safari);


//左侧菜单绑定点击事件
function left_menu_attach_click(){
    var $doc=$(document);
    $doc.on('click', '.m-menu dl dt', function () {
        var $this = $(this);
        var $parent = $this.parent();
        var $siblings = $parent.siblings();
        //存储上次点击过的menu class
//        sessionStorage.setItem("menu-class", $parent.attr('class'));
        
        $parent.toggleClass('active');
        $siblings.removeClass('active');
    });
    $doc.on('click','.m-menu dl dd',function(){
        var $this = $(this);
        $this.addClass('active').siblings('dd').removeClass('active');
        $this.parent().siblings('dl').find('dd').removeClass('active');
        $("#content").load($this.data('href'));
    })
}


function initCurrentUser() {
	// 获取当前用户信息加权限
	$.post('../../rs/proj/user/getUser',{},function(result){
		sessionStorage.setItem("currentUserId",result.data.userInfo.id);
		sessionStorage.setItem("currentUser",result.data.userInfo);
		sessionStorage.setItem("currentUserDisplayName",result.data.userInfo.displayName);
		$('#userDisplayName').html(result.data.userInfo.displayName);
		sessionStorage.setItem("currentUserAndRole",JSON.stringify(result.data));
	})
}

// 把json绑定到form中
$.fn.setForm = function(jsonValue) {  
    var obj=this;  
    $.each(jsonValue, function (name, ival) {  
        var $oinput = obj.find("input[name=" + name + "]");   
        if ($oinput.attr("type")== "radio" || $oinput.attr("type")== "checkbox"){  
             $oinput.each(function(){  
                 if(Object.prototype.toString.apply(ival) == '[object Array]'){//是复选框，并且是数组  
                      for(var i=0;i<ival.length;i++){
                          if($(this).val()==ival[i])
                             $(this).prop("checked", "checked");  
                      }  
                 }else{  
                     if($(this).val()==ival)
                        $(this).prop("checked", "checked");  
                 }  
             });  
        }else if($oinput.attr("type")== "textarea"){//多行文本框  
            obj.find("[name="+name+"]").html(ival);  
        }else{  
             obj.find("[name="+name+"]").val(ival);   
        }  
   });  
};
	
Date.prototype.format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// 渲染时间
function dateTimeRenderer(value) {
	return new Date(value).format("yyyy-MM-dd hh:mm:ss");
}

function forwardTo(targetUrl) {
	window.location = targetUrl;
}

function confirmTo(promptMsg, targetUrl) {
	if (confirm(promptMsg)) {
		forwardTo(targetUrl);
	}
}

function clearNull(obj){
	if(obj == undefined || obj == null || obj == "" || obj == "null" || obj == "NULL"){
		return "";
	}else{
		return obj;
	}
}

/**
 * json to String
 * 
 * @param jsonObj
 * @returns jsonStr
 */
function jsonToString(json) {
	return JSON.stringify(json).replace(',', ', ').replace('[', '').replace(
			']', '');
};

//BootstrapDialog I18N
BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_DEFAULT] = '消息提示';
BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_INFO] = '消息提示';
BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_PRIMARY] = '消息提示';
BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_SUCCESS] = '成功提示';
BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_WARNING] = '警告提示';
BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_DANGER] = '危险提示';
BootstrapDialog.DEFAULT_TEXTS['OK'] = '确定';
BootstrapDialog.DEFAULT_TEXTS['CANCEL'] = '取消';
BootstrapDialog.DEFAULT_TEXTS['CONFIRM'] = '确定';
/**
 * 使用方式如：
 * 1、 alert("***提示信息*****");
 * 2、 alert("***提示信息*****",'',"error");
 * 3、 alert("***提示信息*****",submitForm,"info");
 * 4、 alert("***提示信息*****",function(){
	   							$.ajax({
	    			        		type:'post',
	    			        		url:'${ctx}/workplan/work-plan!delWorkPlan.action',
	    			        		data:{"paramMap.planId" : planId},
	    			        		success:function(data){
	    			        			submitForm();
	    			        		}
	    			        	});
  					},"success");
 * alert提示 
 * @message 提示信息
 * @callback function函数名称 或 function(){}
 * @type 消息类型 默认 info
 */
function alertMessage(message,callback,type) {
	var title = "";
	if(type == "info"){
		title = "消息提示";
		type = BootstrapDialog.TYPE_DEFAULT
	}else if(type == "warning"){
		title = "警告提示";
		type = BootstrapDialog.TYPE_WARNING
	}else if(type == "success"){
		title = "成功提示";
		type = BootstrapDialog.TYPE_SUCCESS
	}else if(type =="error"){
		title = "失败提示";
		type = BootstrapDialog.TYPE_DANGER
	}else{
		title = "消息提示";
		type = BootstrapDialog.TYPE_DEFAULT
	}
	
	BootstrapDialog.show({
		title: title,
		size: BootstrapDialog.SIZE_SMALL,
        message: message,
        type: type, 
        closable: true,		
        closeByBackdrop: false,
        closeByKeyboard: false, 
        draggable: true,
        buttons: [{
            label: '确定',
            action: function(dialog) {
            	if(callback){
            		callback.call();
            	}
            	dialog.close();
            }
        }]
	});
}
/**
 * 使用方式如：
 * confirm("您确定将xxxx？",function(){
        	$.ajax({
    	    	type:'post',
    	    	url:'${ctx}/workplan/work-plan!createQXReportDate.action',
    	    	data:{"paramMap.ZXReportId" : ZXReportId},
    	    	success:function(res){
    	    		if(res.result = "success"){
    	    			alert("xxxxxxx",submitForm,"info");
    	    		}else{
    	    			alert("xxx原因如下：<br>"+obj.result,"","error");
    	    		}
    	    	}
    		});
        });
 * confirm 确认提示
 * @message 提示信息
 * @callback function函数名称 或 function(){}
 */
function confirmMessage(message,callback) {
	BootstrapDialog.confirm({
		title: '确认提示',
        message: message,
        type: BootstrapDialog.TYPE_WARNING, 
        size: BootstrapDialog.SIZE_SMALL,
        closable: true,	
        closeByBackdrop: false,
        closeByKeyboard: false, 
        draggable: true, 
        callback: function(result){
        	if(result){
        		if(callback){
            		callback.call();
            	}
        	}
        }
	});
}
/**
 * 使用方式：参见：standardChoose.js 代码行30 -->showDialog 
 * showDialog 没有特殊业务处理的showDialog通用此方法
 * @param title
 * @param url_message
 * @param callback
 * @param cssClass
 */
function showDialog(title,url_message,callback,cssClass) {
	if(title == "" || title == undefined){
		title = "消息窗口";
	}if(cssClass == "" || cssClass == undefined){
		cssClass = "";
	}
	BootstrapDialog.show({
		title: title,
		type: BootstrapDialog.TYPE_INFO,
		message: url_message,
		closable: true,	
        closeByBackdrop: false,
        closeByKeyboard: false, 
        cssClass: cssClass,
        draggable: true,
        buttons: [{
            label: '确 定',
            cssClass: 'btn-primary',
            icon: 'ace-icon fa fa-save',
            action: function(dialog) {
            	if(callback){
            		callback.call();
            	}
            	dialog.close();
            }
        }, {
            label: '关 闭',
            icon: 'ace-icon fa fa-times',
            cssClass: 'btn-danger',
            action: function(dialogRef){
            	dialogRef.close();
            }
        }]
	});
}
$(function() {
	window.alert = alertMessage;
	window.confirm = confirmMessage;
});
/**
 * 
 * @param String
 *            data 需要展示的内容
 * @param String
 *            width 控制显示的宽度
 * @param function
 *            click 点击事件 传递的是个字符串
 * @param String
 *            other 其他的标签内属性 比如说data-id
 * @return String 返回html字符串
 * 
 * @example
 * 调用： getTableRow(data,'100px','show(this)', 'data-id="123"');
 * 返回值：<a style="display: block;width:100px;word-break: keep-all;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" title="北京宝武钢铁集团公司 项目规划部门 张总" onclick="show(this)" data-id="123">北京宝武钢铁集团公司 项目规划部门 张总</a>
 * 
 */
function getTableRow(data, width, click, other) {
	var html = '';
	html += '<div ';
	// 添加控制宽度
	if (width != null) {
		html += 'style="display: block;width:'
				+ width
				+ ';word-break: keep-all;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" '
	}
	// 添加鼠标悬浮
	if (data != null) {
		html += 'title = "' + data + '" '
	}
	// 可点击 修改div为a
	if (click != null) {
		html = html.replace('<div ', '<a ');
		html += 'onclick = ' + click + ' ';
	}
	// 添加自定义信息 比如 data-id=123
	if (other != null) {
		html += other;
	}
	// 添加结束标签
	if (click != null) {
		html += '></a>'
	} else {
		html += '></div>'
	}
	// 添加显示
	if (data != null) {
		html = html.replace('></', '>' + data + '</');
	}
	return html;
}
//查询项目类型
function findPosition() {
	var projectTypeField = $('#projectType');
	$.post('../../rs/proj/dict/findByTypeCode', {
		typeCode : 'projectType'
	}, function(result) {
		projectTypeField.html('<option value="">请选择</option>');
		var list = result.data;
		$.each(list,
				function(index, item) {
					projectTypeField.append("<option value='" + item.value
							+ "' data-id='" + item.id + "'>" + item.name
							+ "</option>");
				});
	});
}