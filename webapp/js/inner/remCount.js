var table = null;
var projid;
$(function(){
	// 自定补全项目名称
	$("#proName").autocomplete({
		source : "../../rs/proj/info/findList",
		minLength :1,
		select : function(event, ui) {
			$('#select input[name=proName]').val(ui.item.lable);
			
		}
	});
	// 初始化表格
	initTable();
	findPosition();
	// 搜索
	$('#searchBtn').click(refreshList);
	// 校验表单
	$("FORM#addForm").validate({
    	errorClass: 'validate-error'
	});
	$("FORM#editForm").validate({
        errorClass: 'validate-error'
    });
})
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
function initTable() {
	//配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
		"language": {
			"url": "../../cdn/public/datatable/Chinese.txt"
		}
	});
	table = $("#table").dataTable({
		searching: false,
		retrieve: true,
		serverSide: true,
		ordering : true,
		bLengthChange: false, 
		order : [[2, "desc"]],//默认排序字段的索引
		ajax: {
			url: "../../rs/proj/seo/remiSelect",
			dataSrc: "data"
		},
		serverParams: function (param) {
			var jsonFilter = {};
			if ($('#proName').val() != '') {
				param.proName = $('#proName')
						.val();
			}
			if ($('#ProLeader').val() != '') {
				param.proLeader = $('#ProLeader')
				.val();
			}
			if ($('#projectType').val() != '') {
				param.projectType = $('#projectType')
				.val();
			}
			if ($('#remiType').val() != '') {
				param.remiType=$('#remiType').val();
			}
			
        }, 
        columnDefs: [{ 
        	"orderable": false, "targets": [0,3,5,6,7,8] //设置tab索引0，11 列不排序
		}],
		columns: [{
			data : 'id',
			render : function(data, type, row) {
				return '<input type="checkbox" value="'
						+ data
						+ '" class="selectedItem"  name="selectedItem">'
			}
		},{
			data : 'id',
			render: function(data, type, row, meta) {
				//	返回table序号			
				return meta.row + 1;
			}
		}, {
			data : 'proName',
				render : function (data , type , row){
					return getTableRow(data,'130px')
					}
		}, {
			data : 'proLader',
		}, {
			data : 'customerName',
				render : function (data , type , row){
					return getTableRow(data,'100px')
					}
		}, {
			data : 'projectType',
		}, {
			data : 'time',
		}, {
			data : 'contractAmount'
		},{
			data : 'remiCount'
		},{
			data : 'noRemiCount'
		}]
	});
}
function refreshList() {
	table.api().ajax.reload();
}

function exportBtn(){
	var orderColumn = "startDate";
	var orderDir = "desc"
	// 排序的列
	var order = table.api().order();
	var orderNum = order[0][0];
	orderDir = order[0][1];
	switch (orderNum) {
	case 1:
		orderColumn = "proName";
		break;
	case 2:
		orderColumn = "proLader";
		break;
	case 4:
		orderColumn = "projectType";
		break;
	default:	
	}
	var array = [];
	$.each($('input.selectedItem:checked'), function() {
		array.push(this.value);
	});
	var proName = $('#proName').val();
	var projectType = $('#projectType').val();	
	var proLeader=$('#ProLeader').val();
	var remiType=$('#remiType').val();
forwardTo('../../rs/proj/seo/remiexcel?proName='+proName+'&projectType='+projectType+'&proLeader='+proLeader+'&remiType='+remiType+"&orderDir=" + orderDir + "&orderColumn=" +orderColumn+ "&projectIds=" +array);
}

