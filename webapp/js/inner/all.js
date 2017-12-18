var demandInfoId = 0;
var type;

var projectId = 0;

var projectName;
var projectType;
var customerId;
var customerName;//客户名
var telephone;

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

var URL_DOC_FINDLISTBYBUSINESSID = '../../rs/proj/doc/findByBusinessId';
var URL_DOC_UPDATEOTHERBYID = '../../rs/proj/doc/updateOtherById'
	
//回款
var URL_BABK = '../../projectmanage/api/salesBack/detailListQuery';

$(function(){
	
	//获得session的参数DemandInfoId
	demandInfoId = sessionStorage.getItem("demandInfoId");
	//获取session中的需要显示标签的类型
	type = sessionStorage.getItem("type");
	var num = 0;
	if(type == 'bid'){
		num = 1;
	}else if(type == 'contract'){
		num = 2;
	}
	//初始化tabs
	$( "#tabs" ).tabs({active : num});
	//回显
	viewInfo(demandInfoId);
	
	//客户名自动补全
	$("#bid_customerName").autocomplete({
		source : "../../rs/proj/customer/findList",
		minLength : 1,
		select : function(event, ui) { // ui.item.id:123456
		}
	});
	
	//时间控件
    layui.use('laydate', function(){
		var laydate = layui.laydate;
		lay('.datepicker').each(function(){
	    laydate.render({
	      elem: this
	    });
	  });
	});
    $("FORM#bidForm").validate({
        errorClass: 'validate-error'
    });
    $("FORM#contractForm").validate({
    	errorClass: 'validate-error',
    	rules: {
            name: {
                remote: {
                    url: '../../rs/proj/contract/checkName',
                    data: {
                        id: function() {
                            return $('#contractForm input[name=id]').val();
                        }
                    }
                }
            },
            contractNumber : {
            	remote:{
            		url: '../../rs/proj/contract/checkNumber',
            		data:{
            			id: function(){
            				return $('#contractForm input[name=id]').val();
            			}
            		}
            	}
            }
        },
        messages: {
            name: {
                remote: "存在重复合同名"
            },
        	contractNumber: {
        		remote: "存在重复合编号"
        	}
        }
    });
});

//回显基本信息
function viewInfo(id){
//回显机会
	initViewDemandInfo(id);
//回显机会跟踪
	initViewDemandRecord(id);
//回显投标
	initViewBid(id);
//回显合同
	initViewContract(id);
}
//回显机会
function initViewDemandInfo(demandInfoId){
	var projectTypeField = $('#demandInfoForm select[name=projectType]');
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
		
		$.get(URL_DEMAND_INFO_VIEW, {
			id: demandInfoId
		}, function(result) {
			projectName = result.data.projectName;
			customerId = result.data.customerId;
			customerName = result.data.customerName;
			telephone = result.data.telephone;
			projectType = result.data.projectType;
			$('#demandInfoTable tbody').html(
					'<tr>'
					+'<td>'+result.data.projectName+'</td>'
					+'<td>'+result.data.customerName+'</td>'
					+'<td>'+result.data.projectType+'</td>'
					+'<td>'+result.data.status+'</td>'
					+'<td><a href="Javascript:void(0)" style="color:#337ab7" data-toggle="modal" data-target="#demandInfoModal" onclick="viewDemandInfo('+ result.data.id +',\'view\')">查看</a></td>'
					+'</tr>');
		});
		
		
	});
}
//回显机会进展
function initViewDemandRecord(demandInfoId){
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
}
//回显投标
function initViewBid(demandInfoId){
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
						+' <a href="Javascript:void(0)" style="color:#337ab7" data-toggle="modal" data-target="#bidModal" onclick="preEdit_bid('+ this.id +')">修改</a>'
						+' <a href="Javascript:void(0)" style="color:#337ab7" data-toggle="modal" data-target="#delModal" onclick="preDel('+ this.id +',\'bid\')">删除</a></td>'
					+'</tr>');
		});
	});
}
//回显合同
function initViewContract(demandInfoId){
	$('#contractTable tbody').html("");
	$.get(URL_CONTRACT_FINDBYDEMANDINFOID, {
		id: demandInfoId
	}, function(result) {
		var contracts = result.data;
		$.each(contracts,function(index,element){
			$('#contractTable tbody').append(
					'<tr>'
					+'<td>'+this.contractNumber+'</td>'
					+'<td>'+this.name+'</td>'
					+'<td>'+this.contractAmount+'元</td>'
					+'<td>'+this.payDateOne+'</td>'
					+'<td>'+this.payDateTwo+'</td>'
					+'<td>'+this.payDateThree+'</td>'
					+'<td>'+this.registerDate+'</td>'
					+'<td><a href="Javascript:void(0)" style="color:#337ab7" data-toggle="modal" data-target="#contractModal" onclick="viewContract('+ this.id +',\'view\')">查看</a>'
					+' <a href="Javascript:void(0)" style="color:#337ab7" data-toggle="modal" data-target="#contractModal" onclick="preEdit_contract('+ this.id +')">修改</a>'
					+' <a href="Javascript:void(0)" style="color:#337ab7" data-toggle="modal" data-target="#delModal" onclick="preDel('+ this.id +',\'contract\')">删除</a>'
					+' <a href="Javascript:void(0)" style="color:#337ab7" onclick="viewSalesBack('+ this.id +')">查看回款</a></td>'
					+'</td>'
					+'</tr>');
			if(index == 0){//默认展示第一个合同的回款
				viewSalesBack(element.id);
			}
		});
	});
}

//回显回款
function viewSalesBack(contractId){
	//根据合同Id查询项目Id
	$.get('../../rs/proj/info/findByContractId', {
		contractId: contractId
	}, function(result) {
		if(result.code == '200'){
			var projects = result.data;
			var arr=[];
			$.each(projects , function(idx , project){
				arr.push(project.id);//合同对应的项目
			});
			showSalesBack(arr);
		}else{
			$('#salesBackTable tbody').html("");
			$('#salesBackTable tbody').append(
					'<tr>'
					+'<td>未建立项目</td>'
					+'<td></td>'
					+'<td></td>'
					+'<td></td>'
					+'<td></td>'
					+'<td></td>'
					+'<td></td>'
					+'</tr>');
		}
	});
}
//展示回款--将回款展示到回款table下面
function showSalesBack(arr){
	$('#salesBackTable tbody').html("");
	$.get('../../projectmanage/api/salesBack/detailListQuery_contract', {
		projectIds: arr
	}, function(result) {
		var salesBacks = result.data;
		if(salesBacks.length == 0){//这个执行不到
			$('#salesBackTable tbody').append(
					'<tr>'
					+'<td>无记录</td>'
					+'<td>无记录</td>'
					+'<td>无记录</td>'
					+'<td>无记录</td>'
					+'<td>无记录</td>'
					+'<td>无记录</td>'
					+'<td>无记录</td>'
					+'</tr>');
			return;
		}
		$.each(salesBacks,function(){
		$('#salesBackTable tbody').append(
				'<tr>'
				+'<td>'+this.proName+'</td>'
				+'<td>'+this.proLader+'</td>'
				+'<td>'+this.startDate+'</td>'
				+'<td>'+this.endDate+'</td>'
				+'<td>'+(this.salesBackTime == null ? '无' : this.salesBackTime) +'</td>'
				+'<td>'+(this.salesBackPrice == null ? '无' : this.salesBackPrice+'元') +'</td>'
				+'<td>'+(this.description == null ? '无' : this.description) +'</td>'
				+'</tr>');
		});
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
	$('#demandRecordFiles').html('');
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
//添加投标前清理
function preAdd_bid(){
	$('#errorMessage_bid').html("");
	$('#bidForm')[0].reset();
	$('#bidForm').validate().resetForm();
	$('#bidModal #bidTitle').html("添加投标信息");
	//让选择文件域初始化
	$('#bidFiles').empty();
	$('#bidForm input[name=id]').val("");
	$('#bidForm input[name=createTime]').val("");
	$('#bidForm input[name=projectName]').val(projectName);
	$('#bidForm input[name=customerName]').val(customerName);
	
}
//添加投标
function saveBid(){
	if (!$('#bidForm').validate().form()) {
		return;
	}
	$('#bidForm input[name=demandInfoId]').val(demandInfoId);
	var data = $('#bidForm').serialize();
	var url;
	if($('#bidForm input[name=id]').val()==""){//判断Id是否为空啊,空-保存，不空-修改
		url = URL_BID_SAVE;
	}else{
		url = URL_BID_SAVE+"?id="+$('#bidForm input[name=id]').val();
	}
	$.post(url, data, function(result) {
		if(result.code==200){//保存成功后，返回bidId，用于保存文件
			var businessId = result.data.id;
			$.each($('#bidFiles').children(),function(){
				var id = $(this).find('input').val();
				var businessName="投标文件";
				var catalog = "投标文件";
				$.get(URL_DOC_UPDATEOTHERBYID, {
					id: id,
					businessId:businessId,
					businessName:businessName,
					catalog:catalog
				}, function(result) {
				});
			});
			$('#bidModal').modal('hide');
			//重新加载页面
			viewInfo(demandInfoId);
		}else{
			$('#errorMessage_bid').append(result.message);
		}
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
//回显投标，准备修改
function preEdit_bid(bidId){
	$('#errorMessage_bid').html("");
	$('#bidForm')[0].reset();
	$('#bidForm').validate().resetForm();
	viewBid(bidId,'edit');
}
//准备添加合同
function preAdd_contract(){
	$('#errorMessage_contract').html("");
	$('#contractForm')[0].reset();
	$('#contractForm').validate().resetForm();
	$('#contractModal #contractTitle').html("添加合同信息");
	$("#contractModal #contract_saveBtn").show();
	$("#contractModal #contract_cancel").show();
	//普通类型合同
	$('#contractT').attr("style","");
	$('#contractP').attr("style","");
	$('#redioP').prop('checked','true');
	$('#approver_div').attr('style',"display:none;");
	$('#contractForm input[name=approver]').val("");
	//让选择文件域初始化
	$('#contractFiles').empty();
	$('#reviewFiles').empty();
	$('#contractForm input[name=id]').val("");
	$('#contractForm input[name=createTime]').val("");
	//回显审批人
	$.get("../../rs/proj/user/findByPositionNameOrPositionName", {
		positionName1: "院长",
		positionName2:"副院长"
	}, function(result) {
		var infos = result.data;
		$('#contractForm select[name=approver]').html("<option value=''>请选择</option>");
		$.each(infos , function(index , item){
			$('#contractForm select[name=approver]').append(
					"<option value='"+item.displayName+"' data-id='"+item.id+"'>"+item.displayName+"</option>");
		});
	});
	$('#contractForm select[name=approver]').removeAttr("disabled");
}

//添加合同
function saveContract(){
	if (!$('#contractForm').validate().form()) {
		return;
	}
	if ($('#contractForm input[name=contractAmount]').val() == '0') {
		alert("合同金额不能为0");
		return;
	}
	if($('#contractForm #contractFiles').children().length <1 ){
		alert("请上传合同文件");
		return;
	}
	$('#contractForm input[name=demandInfoId]').val(demandInfoId);
	//让审批人可以提交
	$('#contractForm select[name=approver]').removeAttr("disabled");
	var data = $('#contractForm').serialize();
	var url;
	if($('#contractForm input[name=id]').val()==""){//判断Id是否为空,空-保存，不空-修改
		url = URL_CONTRACT_SAVE;
	}else{
		url = URL_CONTRACT_SAVE+"?id="+$('#contractForm input[name=id]').val();
	}
	$.post(url, data, function(result) {
		if(result.code==200){//保存成功后，返回contractId，用于保存文件
			var businessId = result.data.id;
			$.each($('#contractFiles').children(),function(){
				var id = $(this).find('input').val();
				var businessName="合同文件";
				var catalog = "合同评审文件";
				$.get(URL_DOC_UPDATEOTHERBYID, {
					id: id,
					businessId:businessId,
					businessName:businessName,
					catalog:catalog
				}, function(result) {
				});
			});
			$.each($('#reviewFiles').children(),function(){
				var id = $(this).find('input').val();
				var businessName="评审文件";
				var catalog = "合同评审文件";
				$.get(URL_DOC_UPDATEOTHERBYID, {
					id: id,
					businessId:businessId,
					businessName:businessName,
					catalog:catalog
				}, function(result) {
				});
			});
			$('#contractModal').modal('hide');
			//重新加载页面
			viewInfo(demandInfoId);
			//查询代办任务个数
			backlogTask();
			
		}else{
			$('#errorMessage_contract').html(result.message);
		}
	});
}

//选择特殊合同
function selectContractType(contractType){
	if(contractType == "特殊合同"){//点击需要
		$('#approver_div').attr("style","");
		$('#contractForm input[name=approver]').val("");
	}else{//
		$('#approver_div').attr("style","display:none");
		$('#contractForm input[name=approver]').val("");
	}
}
function setApproverId(){
	var approverId = $('#contractForm select[name=approver] option:selected').data('id');
	$('#contractForm input[name=approverId]').val(approverId);
}

//查看合同
function viewContract(contractId,status){
	$('#contractForm')[0].reset();
	$('#contractForm').validate().resetForm();
	$('#contractFiles').empty();
	$('#reviewFiles').empty();
	$('#errorMessage_contract').html("");
	//回显审批人----------------------------------------------------------------************
	$.get("../../rs/proj/user/findByPositionNameOrPositionName", {
		positionName1: "院长",
		positionName2:"副院长"
	}, function(result) {
		var infos = result.data;
		$('#contractForm select[name=approver]').html("<option value=''>请选择</option>");
		$.each(infos , function(index , item){
			$('#contractForm select[name=approver]').append(
					"<option value='"+item.displayName+"' data-id='"+item.id+"'>"+item.displayName+"</option>");
		});
		//审批人只读
		$('#contractForm select[name=approver]').attr("disabled","disabled");
			//回显基本信息
			$.get(URL_CONTRACT_VIEW, {
				id: contractId
			}, function(result) {
				$('#contractForm').setForm(result.data);
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
				//合同类型
				if(result.data.type =='普通合同'){
					$('#redioP').prop('checked','true');
					$('#approver_div').attr('style',"display:none;");
					$('#contractForm input[name=approver]').val("");
					$('#contractP').attr("style","");
					$('#contractT').attr("style","display:none;");
				}else{
					$('#redioT').prop('checked','true');
					$('#approver_div').attr("style","");
					$('#contractP').attr("style","display:none;");
					$('#contractT').attr("style","");
				}
			});
		
		
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
//回显合同，准备修改
function preEdit_contract(contractId){
	$('#errorMessage_contract').html("");
	$('#contractForm')[0].reset();
	$('#contractForm').validate().resetForm();
	viewContract(contractId,'edit');
}

function preDel(id,type) {//删除的类型（机会，投标，合同）
	$('#delModal #delBtn').attr("onclick","doDel('"+id+"','"+type+"')");
}
function doDel(id , type) {
	var array = [];
	array.push(id); 
	var url;
	if(type=='bid'){
		url = URL_BID_REMOVE;
	}else if(type=='contract'){
		url = URL_CONTRACT_REMOVE;
	}
	$.post(url, {
		ids: array
	}, function(result) {
		if(result.code==200){
			$('#delModal').modal('hide');
			viewInfo(demandInfoId);
		}else{
			alert(result.message);
			$('#delModal').modal('hide');
		}
	});
}


function back(toWhere){
	if(toWhere == "toBid"){
		$("#content").load("../proj/bid-list.html");
	}
}

