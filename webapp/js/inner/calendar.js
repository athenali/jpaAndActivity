var user = '';//用户名
var initialLocaleCode = 'zh-cn';//汉化
$(function(){
	//initCurrentUser();//获取当前登录用户
	user = JSON.parse(sessionStorage.getItem("currentUserAndRole")).userInfo.username;
	//初始化日历便签
	initCalendar();
});
function initCalendar(){
	$('#calendar').fullCalendar('destroy');
	$('#calendar').fullCalendar({
		locale : initialLocaleCode,
		theme : true,
//		handleWindowResize : false,
		aspectRatio : 1.6,
		timezone : 'local',
		header : {
			left : 'prev,next today',
			center : 'title',
			right : 'month,agendaWeek,agendaDay'
		},
		navLinks : true,
		selectable : true,
		selectHelper : true,
		select : function(startDate, endDate) {
			var allDay = startDate._ambigTime;//是否全天
			BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                closeByBackdrop: false,
                closeByKeyboard: false, 
                draggable: true,
                title: '新建事件',
                message: 
                '<div>'+
                '<span class="tit">日程类型：</span> '+
                '<select class="form-control"style="width: 200px;display: inline-block;">'+
        		'<option value="#3f51b5" style="background: #3f51b5;color: #fff;">普通</option>'+
        		'<option value="#e51c23" style="background: #e51c23;color: #fff;">紧急</option>'+
        		'<option value="#ffc107" style="background: #ffc107;color: #fff;">代办</option>'+
        		'<option value="#259b24" style="background: #259b24;color: #fff;">任务</option>'+
        		'<option value="#9c27b0" style="background: #9c27b0;color: #fff;">灵感</option>'+
        		'</select>'+
        		'</div>'+
        		'<div>'+
        		'<span class="tit">日程内容：</span> '+
                '<textarea class="form-control" placeholder="记录你将要做的一件事" style="height: 300px;"></textarea>'+
                '</div>'
        		,
                onshown: function(dialogRef){
                	dialogRef.getModalBody().find('textarea').focus()
                },
                buttons: [{
                    label: '保存',
                    cssClass: 'btn-primary',
                    action: function(dialogRef){
                        var text = dialogRef.getModalBody().find('textarea').val();
                        var color = dialogRef.getModalBody().find('select').val();
                        $.post('../../projectmanage/api/calendar/add',{
                        	title : text,
        					start : startDate._d.getTime(),
        					end : endDate._d.getTime(),
        					allDay : allDay,
        					user : user,
        					color : color
                        },function(data){
                        	console.log(data);
                        	data.data.className = 'rilitext';
                        	//添加之前删除旧的
              				$('#calendar2').fullCalendar('refetchEvents');
                        	$('#calendar').fullCalendar('refetchEvents');
              				$('#calendar').fullCalendar('unselect');
              				dialogRef.close();
                        });
                    }
                }, {
                    label: '关闭',
                    action: function(dialogRef){
                        dialogRef.close();
                    }
                }]
            }); 
		},
		editable : true,
		eventLimit : true, // allow "more" link when too many events
		events : function(start, end, timezone, callback) {
	        $.ajax({
	            url: '../../projectmanage/api/calendar/get',
	            data: {
	                start: start._d.getTime(),
	                end: end._d.getTime(),
	                user : user
	            },
	            dataType: 'json',
	            success: function(data) {
	            	$.each(data.data,function(i,item){
	            		item.className = 'rilitext';
	            	})
	                callback(data.data);//官方用法 重新加载
	                changeRC(data.data,(start+end)/2); //加载页面
	            }
	        });
	    },
	    //点击查看修改
		eventClick: function(event, jsEvent, view) {
			var end = null;
    		if(event.end!=null)
    			end = event.end._d.getTime();
			BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                closeByBackdrop: false,
                closeByKeyboard: false, 
                draggable: true,
                title: '修改事件',
                message: 
	            	'<div>'+
	                '<span class="tit">日程类型：</span> '+
	                '<select class="form-control"style="width: 200px;display: inline-block;">'+
             		'<option value="#3f51b5" style="background: #3f51b5;color: #fff;">普通</option>'+
             		'<option value="#e51c23" style="background: #e51c23;color: #fff;">紧急</option>'+
             		'<option value="#ffc107" style="background: #ffc107;color: #fff;">代办</option>'+
             		'<option value="#259b24" style="background: #259b24;color: #fff;">任务</option>'+
             		'<option value="#9c27b0" style="background: #9c27b0;color: #fff;">灵感</option>'+
             		'</select>'+
             		'</div>'+                	
            		'日程内容 <textarea class="form-control" placeholder="记录你将要做的一件事" style="height: 300px;"></textarea>'+
            		'开始时间<input name="starttime" class="form-control" readonly/>'+
            		'结束时间<input name="endtime" class="form-control" readonly/>'
                	,
                onshow: function(dialogRef){
                	dialogRef.getModalBody().find('textarea').val(event.title);
                	dialogRef.getModalBody().find('select').val(event.color);
                	if(event.allDay){
                		//结束日期是下一天的早上8点 不显示时分秒 和最后一天减一
                		event.end._d.setDate(event.end._d.getDate()-1);
                		dialogRef.getModalBody().find('input[name="starttime"]').val(event.start._d.format('yyyy-MM-dd'))
                		dialogRef.getModalBody().find('input[name="endtime"]').val(event.end._d.format('yyyy-MM-dd'))
                	}else{
	                	dialogRef.getModalBody().find('input[name="starttime"]').val(event.start._d.format('yyyy-MM-dd hh:mm:ss'))
	                	dialogRef.getModalBody().find('input[name="endtime"]').val(event.end._d.format('yyyy-MM-dd hh:mm:ss'))
                	}
                },
                onshown: function(dialogRef){
                	dialogRef.getModalBody().find('textarea').focus()
                },
                buttons: [{
                    label: '修改',
                    cssClass: 'btn-primary',
                    action: function(dialogRef){
                    	event.title = dialogRef.getModalBody().find('textarea').val();
                    	event.color = dialogRef.getModalBody().find('select').val();
                        $.post('../../projectmanage/api/calendar/update',{
                			id : event.id,
            				title : event.title,
            				start : event.start._d.getTime(),
            				end : end,
            				allDay :event.allDay,
            				color : event.color
                        },function(data){
                        	console.log(data);
                        	//删除之前的event否则会多出来两个
                        	$('#calendar').fullCalendar('removeEvents',event.id);
                        	$('#calendar').fullCalendar('refetchEvents');
                        	dialogRef.close();
                        });
                    }
                }, {
                    label: '删除',
                    cssClass: 'btn-warning',
                    action: function(dialogRef){
                    	$.post('../../projectmanage/api/calendar/delete',{
                			id : event.id,
                        },function(data){
                        	console.log(data);
                        	$('#calendar').fullCalendar('removeEvents',event.id);
                        	$('#calendar2').fullCalendar('removeEvents',event.id);
                        	dialogRef.close();
                        });
                    }
                }, {
                    label: '关闭',
                    action: function(dialogRef){
                        dialogRef.close();
                    }
                }]
            }); 
    	},
    	//拖拽修改
    	eventDrop :function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
    		var end = null;
    		if(event.end!=null)
    			end = event.end._d.getTime();
    		$.post('../../projectmanage/api/calendar/update',{
    			id : event.id,
				start : event.start._d.getTime(),
				end : end,
				allDay :event.allDay
            },function(data){
            	$('#calendar2').fullCalendar('removeEvents',data.data.id);
            	$('#calendar2').fullCalendar('renderEvent',data.data, true);
            	console.log(data);
            });
    	},
    	//拉伸修改
    	eventResize:function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view){
    		var end = null;
    		if(event.end!=null)
    			end = event.end._d.getTime();
    		$.post('../../projectmanage/api/calendar/update',{
    			id : event.id,
				start : event.start._d.getTime(),
				end : end,
				allDay :event.allDay
            },function(data){
            	$('#calendar2').fullCalendar('removeEvents',data.data.id);
            	$('#calendar2').fullCalendar('renderEvent',data.data, true);
            	console.log(data);
            });
    	}
	});
}

function changeRC(events,date){
	$('#calendar2').fullCalendar('destroy');
	$('#calendar2').fullCalendar({
		locale : initialLocaleCode,
		theme : true,
		header : {
			left : '',
			center : 'title',
			right : ''
		},
		selectable : false,
		editable : false,
		//每次加载前进行判断，如果不是需要view则进行跳转
		eventRender : function(calEvent, element, view){
			var view = $('#calendar2').fullCalendar('getView');
			if(view.name!='listMonth'){
				$('#calendar2').fullCalendar('changeView','listMonth');
			}
		},
		aspectRatio : 0.4,
		defaultDate :date,
		timezone : 'local',
		defaultView : 'listMonth',
		navLinks : true,
		eventLimit : true, // allow "more" link when too many events
		events : events,
		 //点击查看修改
		eventClick: function(event, jsEvent, view) {
			var end = null;
    		if(event.end!=null)
    			end = event.end._d.getTime();
			BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DEFAULT,
                closeByBackdrop: false,
                closeByKeyboard: false, 
                draggable: true,
                title: '修改事件',
                message: 
	            	'<div>'+
	                '<span class="tit">日程类型：</span> '+
	                '<select class="form-control"style="width: 200px;display: inline-block;">'+
             		'<option value="#3f51b5" style="background: #3f51b5;color: #fff;">普通</option>'+
             		'<option value="#e51c23" style="background: #e51c23;color: #fff;">紧急</option>'+
             		'<option value="#ffc107" style="background: #ffc107;color: #fff;">代办</option>'+
             		'<option value="#259b24" style="background: #259b24;color: #fff;">任务</option>'+
             		'<option value="#9c27b0" style="background: #9c27b0;color: #fff;">灵感</option>'+
             		'</select>'+
             		'</div>'+                	
            		'日程内容 <textarea class="form-control" placeholder="记录你将要做的一件事" style="height: 300px;"></textarea>'+
            		'开始时间<input name="starttime" class="form-control" readonly/>'+
            		'结束时间<input name="endtime" class="form-control" readonly/>'
                	,
                onshow: function(dialogRef){
                	dialogRef.getModalBody().find('textarea').val(event.title);
                	dialogRef.getModalBody().find('select').val(event.color);
                	if(event.allDay){
                		//结束日期是下一天的早上8点 不显示时分秒 和最后一天减一
                		event.end._d.setDate(event.end._d.getDate()-1);
                		dialogRef.getModalBody().find('input[name="starttime"]').val(event.start._d.format('yyyy-MM-dd'))
                		dialogRef.getModalBody().find('input[name="endtime"]').val(event.end._d.format('yyyy-MM-dd'))
                	}else{
	                	dialogRef.getModalBody().find('input[name="starttime"]').val(event.start._d.format('yyyy-MM-dd hh:mm:ss'))
	                	dialogRef.getModalBody().find('input[name="endtime"]').val(event.end._d.format('yyyy-MM-dd hh:mm:ss'))
                	}
                },
                onshown: function(dialogRef){
                	dialogRef.getModalBody().find('textarea').focus()
                },
                buttons: [{
                    label: '修改',
                    cssClass: 'btn-primary',
                    action: function(dialogRef){
                    	event.title = dialogRef.getModalBody().find('textarea').val();
                    	event.color = dialogRef.getModalBody().find('select').val();
                        $.post('../../projectmanage/api/calendar/update',{
                			id : event.id,
            				title : event.title,
            				start : event.start._d.getTime(),
            				end : end,
            				allDay :event.allDay,
            				color : event.color
                        },function(data){
                        	console.log(data);
                        	//删除之前的event否则会多出来两个
                        	$('#calendar').fullCalendar('removeEvents',event.id);
                        	$('#calendar').fullCalendar('refetchEvents');
                        	dialogRef.close();
                        });
                    }
                }, {
                    label: '删除',
                    cssClass: 'btn-warning',
                    action: function(dialogRef){
                    	$.post('../../projectmanage/api/calendar/delete',{
                			id : event.id,
                        },function(data){
                        	console.log(data);
                        	$('#calendar').fullCalendar('removeEvents',event.id);
                        	$('#calendar2').fullCalendar('removeEvents',event.id);
                        	dialogRef.close();
                        });
                    }
                }, {
                    label: '关闭',
                    action: function(dialogRef){
                        dialogRef.close();
                    }
                }]
            }); 
    	}
	});
}