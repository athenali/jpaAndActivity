var table = null;
$(function(){	
	var id = sessionStorage.getItem("id"); 
	$.get('../../rs/proj/evection/singleInfo', {
		id: id
	}, function(data) {
		var evection=data.data.list;
		$("#projName").html(evection.projectName);
		var v;
		if(evection.type=="001"){
			v="项目出差";
		}if(evection.type=="002"){
			v="会议出差";
		}
		$("#type").html(v);
		$("#reason").html(evection.reason);
		$("#departure").html(evection.departure);
		$("#destination").html(evection.destination);
		$("#userName").html(evection.userName);
		$("#evectionUsers").html(evection.evectionUsers);
		$("#startDate").html(evection.startDate);
		$("#endDate").html(evection.endDate);
		$("#evectionUsers").html(evection.evectionUserNames);
		$("#descn").html(evection.descn);
		var organ=evection.organ;
		if(organ=='personal'){
			$("#organ").html('个人');
		}else{
			$("#organ").html('团体');
		}
		var html = new Array();
		$(data.data.approval).each(function(index,obj){
			html.push("<tr><td>"+obj.assignee+"</td><td>"+obj.name+"</td><td>");
			if(obj.status=="completed"){
				html.push("完成");
			}if(obj.status==null){
				html.push("审核中");
			}if(obj.status=="withdraw"){
				html.push(data.data.list.userName+"撤销申请");
			}
			html.push("</td><td>");
			html.push(obj.approvalOpinion[0]);
			html.push("</td><td>");
			var approvalTime=obj.approvalTime;
			if(null!=approvalTime){
				html.push(approvalTime);
			}else{
				html.push("")
			}
			html.push("</td></tr>");
			console.log(html.join(""));		
		});
		$("#tbody").html(html.join(""));
	});
	//执行返回
	$('#returnBtn').click(returnBtn);
})

function returnBtn(){
	$("#content").load("../proj/record-list.html");
}
function refreshList() {
	table.api().ajax.reload();
}

