var table = null;
var currentUserId;
var userId,projId;
$(function(){
	//获取当前用户
	initCurrentUser();
	currentUserId = sessionStorage.getItem("currentUserId");
	projId = sessionStorage.getItem("projId");
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		lay('.datepicker').each(function() {
			laydate.render({
				elem : this
//				type : 'date'
			});
		});
	});
	initTable();
	addFile();
	// 搜索
	$('#searchBtn').click(refreshList);
	
	// 新增清理
	$('#addLink').click(preAdd);
	// 执行新增
	$('#addSaveBtn').click(doAdd);

	// 执行修改
	$('#editSaveBtn').click(doEdit);
	// 执行删除
	$('#delBtn').click(doDel);
	// 校验表单
    $("FORM#addForm").validate({
        errorClass: 'validate-error'
    });
    $("FORM#editForm").validate({
        errorClass: 'validate-error'
    });
})
//添加任务附件
function addFile(){
	$.post('../../projectmanage/api/file/findlist2',{
		businessId : projId,
		businessName : '任务文件'
	},function(data){
		$('#RwFile').empty();
		$.each(data.data,function(i,item){
			addFileInput(item,'RwFile');
		})
		//取消删除按钮
		$('.deleteedittenderFile').empty();
	})
}
function initProj(){
	$.ajax({
		url : '../../rs/proj/info/view',
		data : {
			id : projId
		},
		async : false,
		success : function(result) {
			console.log(result);
			$('#addForm input[name=projectId]').val(result.data.id);
			$('#addForm input[name=projectName]').val(result.data.name);
			$('#addForm input[name=projectStatus]').val(result.data.status);
			$('#addForm input[name=userId]').val(result.data.managerId);
			$('#addForm input[name=userName]').val(result.data.managerName);
		}
	});
	var users;
	$.ajax({
		url : '../../rs/proj/memberinfo/listByInfoId',
		data : {
			infoId : projId
		},
		async : false,
		success : function(data) {
			users = data.data;
			$("#executorSelecte").html('');
			var html = new Array();
			html.push("<option value="+$('#addForm input[name=userId]').val()+">"+$('#addForm input[name=userName]').val()+"</option>");
			for (var i = 0; i < users.length; i++) {
	 			html.push("<option value="+users[i].userId+">"+users[i].userName+"</option>");
			}
			$("#executorSelecte").html(html);
			$('#executorSelecte').multipleSelect();
			$("#executorSelecte").multipleSelect("uncheckAll");
		}
	});
}

function initTable() {
	//配置DataTables默认参数,初始化表格写在获取用户Id的回调函数中
	$.extend(true, $.fn.dataTable.defaults, {
		"language": {
			"url": "../../cdn/public/datatable/Chinese.txt"
		}
	});
	table = $("#table").dataTable({
		searching: false,
		serverSide: true,
		ordering: false,
		bLengthChange: false,
		autoWidth: false,
		ajax: {
			url: "../../rs/proj/task/list",
			dataSrc: "data"
		},
		serverParams: function (param) {
			var jsonFilter = {
			};
			//代办中查询创建人的是当前用户
			jsonFilter.EQ_projectId = projId;
			jsonFilter.LIKE_executorId = currentUserId;
			if ($('#projectName').val() != '') {
				jsonFilter.LIKE_projectName = $('#projectName').val();
			}
			if ($('#projectStatus').val() != '') {
				jsonFilter.LIKE_projectStatus = $('#projectStatus').val();
			}
			if ($('#projectManager').val() != '') {
				jsonFilter.LIKE_projectManager = $('#projectManager').val();
			}
			if ($('#name').val() != '') {
				jsonFilter.LIKE_name = $('#name').val();
			}
			if ($('#status').val() != '') {
				jsonFilter.LIKE_status = $('#status').val();
			}
			if ($('#type').val() != '') {
				jsonFilter.LIKE_type = $('#type').val();
			}
			if ($('#executorName').val() != '') {
				jsonFilter.LIKE_executor = $('#executorName').val();
			}
			param.jsonFilter = JSON.stringify(jsonFilter);
        },  
		columns: [{
			data : 'id',
			render : function(data, type, row,meta){
				return meta.row + 1
			}
		},{
			data : 'name',
			render : function(data ,type, row){
				return getTableRow(data,'150px','show(this)','data-id="'+ row.id +'"');
			}
		}, {
			data : 'type'
		},{
			data : 'projectName',
			render : function(data){
				return getTableRow(data,'150px');
			}
		}, {
			data : 'status'
		}, {
			data : 'startDate'
		} ,{
			data : 'updateTime',
			render : function(data ,type ,row){
				if(data==null || data==0){
					return '无';
				}
				return data;
			}
		}, {
			data : 'endDate'
		} ,{
			data : 'id',
			render: function(data, type, row) {
				var html = '';
				html = '<a onclick="show(this)" data-id="' + data + '">查看进度</a>'
				;
				if(currentUserId==row.userId){
					$('#addLink').css('display','inline'); 
					html += '<a onclick="preEdit(this)" data-toggle="modal" data-target="#editModal" data-id="' + data + '">修改</a>'
					+'<a onclick="doDel(this)" data-id="' + data + '">删除</a>'
				;}
				return html; 
			}
		}]
	});
}

function show(obj) {
	var id = $(obj).data('id');
	sessionStorage.setItem("taskId", id);
	$('#content').load('../proj/task-record.html');
}
function back() {
	$('#content').load('../proj/info-new-task.html');
}

function refreshList() {
	table.api().ajax.reload();
}

function preAdd() {
	//清空错误信息
	$('#addErrorMessage').html("");
	//清空客户信息
//	$('#addForm')[0].reset();
	$('#addForm').validate().resetForm();
	//让选择文件域初始化
	$('#addTaskFiles').empty();
	$('#addForm select[name = "type"]').change(function(){
		if($('#addForm select[name = "type"]').val()=='出差调研'){
			$('.diaoyan').css('display','');
		}else{
			$('.diaoyan').css('display','none');
		}
	});
	initProj();
}

function doAdd() {
	if (!$('#addForm').validate().form()) {
		return;
	}
	//将下拉框的id赋值到input中并且添加projManager
	$('#addForm input[name=executorId]').val($("#executorSelecte").multipleSelect("getSelects"));
	$('#addForm input[name=executorName]').val($("#executorSelecte").multipleSelect("getSelects", "text"));
	//给选中的人添加任务
	var data = $('#addForm').serialize();
	$.post('../../rs/proj/task/save', data, function(result) {
		$('#addErrorMessage').html("");
		if(result.code==200){
			$('#addModal').modal('hide');
			refreshList();
		}else{
			$('#addErrorMessage').append(result.message);
		}
	});
	
}

function preEdit(obj) {
	$('#editErrorMessage').html("");
	$('#editForm')[0].reset();
	$('#editForm').validate().resetForm();
	//清空选择文件域
	$('#editTaskFiles').empty();
	$('#editForm select[name = "type"]').change(function(){
		if($('#editForm select[name = "type"]').val()=='出差调研'){
			$('.diaoyan').css('display','');
		}else{
			$('.diaoyan').css('display','none');
		}
	});
	var id =$(obj).data('id');
		//回显所有数据
		$.get('../../rs/proj/task/view', {
			id: id
		}, function(result) {
			if(result.data.type=='出差调研'){
				$('.diaoyan').css('display','');
			}else{
				$('.diaoyan').css('display','none');
			}
			var data = result;
			$.get('../../rs/proj/memberinfo/listByInfoId', {
				infoId: projId
			}, function(result) {
				$('#executorSelecte2').html('');
				$('#executorSelecte2').append("<option value="+$('#editForm input[name=userId]').val()+">"+$('#editForm input[name=userName]').val()+"</option>");
				$.each(result.data,function(){
					$('#executorSelecte2').append('<option value='+this.userId+'>'+this.userName+'</option>');
				});
				$('#executorSelecte2').multipleSelect();
				$('#executorSelecte2').multipleSelect("uncheckAll");
				$('#executorSelecte2').multipleSelect("setSelects", data.data.executorId.split(','));
			});
			$('#editForm').setForm(result.data);
		});
}
function doEdit() {
	if (!$('#editForm').validate().form()) {
		return;
	}
	//将下拉框的id赋值到input中并且添加projManager
	$('#editForm input[name=executorId]').val($("#executorSelecte2").multipleSelect("getSelects"));
	$('#editForm input[name=executorName]').val($("#executorSelecte2").multipleSelect("getSelects", "text"));
	var id = $('#editForm input[name=id]').val();
	var data = $('#editForm').serialize();
	$.post('../../rs/proj/task/save?id='+id,data, function(result) {
		$('#editErrorMessage').html("");
		if(result.code==200){
			$('#editModal').modal('hide');
			refreshList();
		}else{
			$('#editErrorMessage').append(result.message);
		}
	});
}

function preDel(obj) {
	var id =$(obj).data('id');
	$('input.selectedItem').prop('checked', false);
	$('input[value=' + id + '].selectedItem').prop('checked', true);
}

function doDel(obj) {
	var array = [];
	array.push($(obj).data('id'));
	$.post('../../rs/proj/task/removeById', {//删除的时候把任务追踪也删了,判断该任务是否有终稿文件，有终稿文件先清空终稿文件
		ids: array
	}, function(result) {
		if(result.code==200){
			$('#delModal').modal('hide');
			refreshList();
		}else{
			alert("请先清空终稿文件再删除");
			$('#delModal').modal('hide');
			refreshList();
		}
	});
}