var demandInfoId = 0;
var contractId = 0;
var projectId = 0;

var type;

var projectName;
var customerName;
var customerId;

var URL_DEMAND_INFO_LIST = "../../rs/proj/demandinfo/list";
var URL_DEMAND_INFO_SAVE = "../../rs/proj/demandinfo/save";
var URL_DEMAND_INFO_VIEW = '../../rs/proj/demandinfo/view';
var URL_DEMAND_INFO_REMOVE = '../../rs/proj/demandinfo/removeById';

var URL_DEMAND_RECORD_LIST = "../../rs/proj/demandrecord/list";
var URL_DEMAND_RECORD_SAVE = "../../rs/proj/demandrecord/save";
var URL_DEMAND_RECORD_VIEW = '../../rs/proj/demandrecord/view';
var URL_DEMAND_RECORD_REMOVE = '../../rs/proj/demandrecord/removeById';
var URL_DEMAND_RECORD_FINDBYDEMANDINFOID = '../../rs/proj/demandrecord/findByDemandInfoId';

var URL_BID_SAVE='../../rs/proj/bid/save';
var URL_BID_VIEW='../../rs/proj/bid/view';
var URL_BID_REMOVE = '../../rs/proj/bid/removeById';
var URL_BID_FINDBYDEMANDINFOID='../../rs/proj/bid/findByDemandInfoId';

var URL_CONTRACT_SAVE='../../rs/proj/contract/save';
var URL_CONTRACT_VIEW='../../rs/proj/contract/view';
var URL_CONTRACT_REMOVE = '../../rs/proj/contract/removeById';
var URL_CONTRACT_FINDBYDEMANDINFOID='../../rs/proj/contract/findByDemandInfoId';

var URL_INFO_VIEW='../../rs/proj/info/view';


var URL_DOC_FINDLISTBYBUSINESSID = '../../rs/proj/doc/findByBusinessId';
var URL_DOC_UPDATEOTHERBYID = '../../rs/proj/doc/updateOtherById'
	

$(function(){
	
	//获得session的参数合同Id
	contractId = sessionStorage.getItem("contractId");
	demandInfoId = sessionStorage.getItem("demandInfoId");
	projectId = sessionStorage.getItem("projectId");
	//获取session中的需要显示标签的类型
	//type = sessionStorage.getItem("type");
	//初始化tabs
	$( "#tabs" ).tabs({active : 2});
	$( "#tabs_info").tabs();
	//回显(机会，投标，合同)
	viewInfo(contractId);
	//回显(项目基本信息，人员，计划)
	viewProjInfo(projectId);
	
	//时间控件
    layui.use('laydate', function(){
		var laydate = layui.laydate;
		lay('.datepicker').each(function(){
	    laydate.render({
	      elem: this
	    });
	  });
	});
});

//回显基本信息
function viewInfo(){
	
//回显机会
	$.get(URL_DEMAND_INFO_VIEW, {
		id: demandInfoId
	}, function(result) {
		projectName = result.data.projectName;
		customerName = result.data.customerName;
		customerId = result.data.customerId;
		$('#demandInfoTable tbody').html(
				 '<tr>'
				+'<td>'+result.data.projectName+'</td>'
				+'<td>'+result.data.customerName+'</td>'
				+'<td>'+result.data.projectType+'</td>'
				+'<td>'+result.data.status+'</td>'
				+'<td><a href="Javascript:void(0)" style="color:#337ab7" data-toggle="modal" data-target="#demandInfoModal" onclick="viewDemandInfo('+ result.data.id +',\'view\')">查看</a></td>'
				+'</tr>');
		
	});
//回显机会跟踪
	$('#demandRecordTable tbody').html("");
	$.get(URL_DEMAND_RECORD_FINDBYDEMANDINFOID, {
		id: demandInfoId
	}, function(result) {
		var demanRecords = result.data;
		$.each(demanRecords,function(){
			$('#demandRecordTable tbody').append(
					 '<tr>'
					+'<td>'+this.partyaPerson+'</td>'
					+'<td>'+this.partybPerson+'</td>'
					+'<td>'+this.startTime+'</td>'
					+'<td>'+this.endTime+'</td>'
					+'<td>'+this.communicationType+'</td>'
					+'<td>'+this.meetingAdress+'</td>'
					+'<td>'+this.status+'</td>'
					+'<td><a href="Javascript:void(0)" style="color:#337ab7" data-toggle="modal" data-target="#demandRecordModal" onclick="viewDemandRecord('+ this.id +',\'view\')">查看</a></td>'
					+'</tr>');
		});
	});
//回显投标
	$('#bidTable tbody').html("");
	$.get(URL_BID_FINDBYDEMANDINFOID, {
		id: demandInfoId
	}, function(result) {
		var bids = result.data;
		$.each(bids,function(index,element){
			var needReturn ="是";
			if(this.needReturn == '0'){
				needReturn = "否";
			}
			$('#bidTable tbody').append(
					 '<tr>'
					+'<td>'+this.customerName+'</td>'
					+'<td>'+this.bidDate+'</td>'
					+'<td>'+this.winBidDate+'</td>'
					+'<td>'+needReturn+'</td>'
					+'<td>'+this.deposit+'元</td>'
					+'<td><a href="Javascript:void(0)" style="color:#337ab7" data-toggle="modal" data-target="#bidModal" onclick="viewBid('+ this.id +',\'view\')">查看</a>'
					+'</tr>');
		});
	});
	
//回显合同
	$('#contractTable tbody').html("");
	$.get(URL_CONTRACT_VIEW, {
		id: contractId
	}, function(result) {
		var contract = result.data;
		$('#contractTable tbody').append(
				'<tr>'
				+'<td>'+contract.contractNumber+'</td>'
				+'<td>'+contract.name+'</td>'
				+'<td>'+contract.contractAmount+'</td>'
				+'<td>'+contract.payDateOne+'</td>'
				+'<td>'+contract.payDateTwo+'</td>'
				+'<td>'+contract.payDateThree+'</td>'
				+'<td>'+contract.registerDate+'</td>'
				+'<td><a href="Javascript:void(0)" style="color:#337ab7" data-toggle="modal" data-target="#contractModal" onclick="viewContract('+ contract.id +',\'view\')">查看</a>'
				+'</tr>');
	});
	
	//回显回款
	$('#salesBackTable tbody').html("");
	$.get('../../projectmanage/api/salesBack/detailListQuery', {
		id: projectId,
		start : 1,
		length : 100
	}, function(result) {
		var contract = result.data.list;
		if(contract.length < 1){
			$('#salesBackTable tbody').append(
					'<tr>'
					+'<td>无</td>'
					+'<td>无</td>'
					+'<td>无</td>'
					+'</tr>');
		}else{
			$.each(contract,function(){
				$('#salesBackTable tbody').append(
						'<tr>'
						+'<td>'+this.salesBackTime+'</td>'
						+'<td>'+this.salesBackPrice+'元</td>'
						+'<td>'+(this.description == null ? '无' : this.description)+'</td>'
						+'</tr>');
			});
		}
	});
	
}
//回显基本信息
function viewProjInfo(projectId){
	$.get(URL_INFO_VIEW, {
		id: projectId
	}, function(result) {
		var info = result.data;
		var needExpert = info.needExpert;
		var managerAssistant = info.managerAssistant;
		if(needExpert == '0' || needExpert == null){
			needExpert = "无";
		}
		if(managerAssistant == '0' || managerAssistant == null){
			managerAssistant = "无";
		}
		$('#infoTab #name').html(" "+info.name);
		$('#infoTab #projectType').html(" "+info.projectType);
		$('#infoTab #customerName').html(getTableRow(" "+info.customerName,'200px'));
		$('#infoTab #telephone').html(" "+info.telephone);
		$('#infoTab #managerName').html(" "+info.managerName);
		$('#infoTab #managerAssistant').html(" "+managerAssistant);
		$('#infoTab #needExpert').html(" "+needExpert);
		$('#infoTab #startDate').html(" "+info.startDate);
		$('#infoTab #endDate').html(" "+info.endDate);
		$('#infoTab #status').html(" "+info.status);
		//文件域
		$.get(URL_DOC_FINDLISTBYBUSINESSID, {
			businessId: projectId
		}, function(result) {
				$.each(result.data,function(){
					if((this).businessName=='需求大纲文件'){
						addFileInput(this,'demandFiles');
					}else{
						addFileInput(this,'taskFiles');
					}
				});
				$('.deleteedittenderFile').remove();
		});
		
		viewMemberInfo();
		viewPlan();
	});
	
}
//回显成员
function viewMemberInfo(){
	var jsonFilter = {
	};
		jsonFilter.EQ_projectId = projectId;
	jsonFilter = JSON.stringify(jsonFilter);
	$.get('../../rs/proj/memberinfo/viewByInfoId', {
		jsonFilter: jsonFilter
	}, function(result) {
		var member = result.data.result;
		for(var i = 0; i<member.length;i++){
			var leader = member[i].leader;
			if(leader=='是'){
				$('#memberTable tbody').append(
						'<tr>'+
						'<td>'+member[i].userName+'</td>'+
						'<td>组长</td>'+
						'</tr>');
			}else{
				$('#memberTable tbody').append(
						'<tr>'+
						'<td>'+member[i].userName+'</td>'+
						'<td></td>'+
						'</tr>');
			}
		}
	});
}

//回显计划
function viewPlan(){
	var jsonFilter = {};
	jsonFilter.EQ_projectId = projectId;
	jsonFilter = JSON.stringify(jsonFilter);
	$.get('../../rs/proj/planinfo/viewByInfoId', {
		jsonFilter: jsonFilter
	}, function(result) {
		var plan = result.data.result;
		for(var i = 0; i<plan.length;i++){
			$('#planTable tbody').append(
					"<tr >"+
						"<td>"+plan[i].name+"</td>"+
						"<td><input class=\"form-control\" value="+plan[i].startTime+" disabled type=\"text\"></td>"+
						"<td><input class=\"form-control\" value="+plan[i].endTime+" disabled type=\"text\"></td>"+
						"<td><input class=\"form-control\" value="+plan[i].memberName+" type=\"text\"></td>"+
					"</tr>");
		}
	});
}




//查看机会
function viewDemandInfo(demandInfoId,status){
	$.get(URL_DEMAND_INFO_VIEW, {
		id: demandInfoId
	}, function(result) {
		$('#demandInfoForm').setForm(result.data);
		//隐藏（保存,取消）按钮
		if(status == "edit"){
			$('#demandInfoModal #demandRecordTitle').html("修改机会信息");
			$("#demandInfoModal #demandInfo_saveBtn").show();
			$("#demandInfoModal #demandInfo_cancel").show();
		}else{
			$('#demandInfoModal #demandRecordTitle').html("查看机会信息");
			$("#demandInfoModal #demandInfo_saveBtn").hide();
			$("#demandInfoModal #demandInfo_cancel").hide();
		}
	});
}
//查看机会追踪
function viewDemandRecord(demandRecordId,status){
	$.get(URL_DEMAND_RECORD_VIEW, {
		id: demandRecordId
	}, function(result) {
		//回显基本信息
		$('#demandRecordForm').setForm(result.data);
		if(status == "edit"){
			$('#demandRecordModal #demandRecordTitle').html("修改机会进展信息");
			$("#demandRecordModal #demandRecord_saveBtn").show();
			$("#demandRecordModal #demandRecord_cancel").show();
		}else{
			$('#demandRecordModal #demandRecordTitle').html("查看机会进展信息");
			$("#demandRecordModal #demandRecord_saveBtn").hide();
			$("#demandRecordModal #demandRecord_cancel").hide();
		}
	});
	
	//回显机会进展文件
	$.get(URL_DOC_FINDLISTBYBUSINESSID, {
		businessId: demandRecordId
	}, function(result) {
		$.each(result.data,function(){
			addFileInput(this,'demandRecordFiles');
		});
		$('.deleteedittenderFile').remove();
	});
}

//查看投标
function viewBid(bidId,status){
	$('#bidFiles').empty();
	$.get(URL_BID_VIEW, {
		id: bidId
	}, function(result) {
		$('#bidForm').setForm(result.data);
		//隐藏/显示（保存,取消）按钮
		if(status == "edit"){
			$('#bidModal #bidTitle').html("修改投标信息");
			$("#bidModal #bid_saveBtn").show();
			$("#bidModal #bid_cancel").show();
		}else{
			$('#bidModal #bidTitle').html("查看投标信息");
			$("#bidModal #bid_saveBtn").hide();
			$("#bidModal #bid_cancel").hide();
		}
	});
	
	//回显投标文件
	$.get(URL_DOC_FINDLISTBYBUSINESSID, {
		businessId: bidId
	}, function(result) {
			$.each(result.data,function(){
				addFileInput(this,'bidFiles');
			});
			if(status == "edit"){
				return ;
			}
			$('.deleteedittenderFile').remove();
	});
}
//查看合同
function viewContract(contractId,status){
	$('#contractFiles').empty();
	$('#reviewFiles').empty();
	$.get(URL_CONTRACT_VIEW, {
		id: contractId
	}, function(result) {
		$('#contractForm').setForm(result.data);
		//合同类型
		if(result.data.type =='普通合同'){
			$('#approver_div').attr('style',"display:none;");
		}else{
			$('#approver_div').attr("style","");
		}
		//隐藏/显示（保存,取消）按钮
		if(status == "edit"){
			$('#contractModal #contractTitle').html("修改合同信息");
			$("#contractModal #contract_saveBtn").show();
			$("#contractModal #contract_cancel").show();
		}else{
			$('#contractModal #contractTitle').html("查看合同信息");
			$("#contractModal #contract_saveBtn").hide();
			$("#contractModal #contract_cancel").hide();
		}
	});
	
	//回显合同文件
	$.get(URL_DOC_FINDLISTBYBUSINESSID, {
		businessId: contractId
	}, function(result) {
			$.each(result.data,function(){
				if((this).businessName=='合同文件'){
					addFileInput(this,'contractFiles');
				}else{
					addFileInput(this,'reviewFiles');
				}
			});
			if(status == "edit"){
				return ;
			}
			$('.deleteedittenderFile').remove();
	});
}

