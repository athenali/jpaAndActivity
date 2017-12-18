var table = null;
var projid;
var costdetal;
$(function(){
    // 日期控件
//    $('.form_datetime').datetimepicker({
//		language: 'zh-CN',
//		format: 'yyyy-mm-dd hh:ii',
//		autoclose:true,//选中关闭
//        todayBtn: true,
//        //pickerPosition: "bottom-left"
//	});
	layui.use('laydate', function(){
		var laydate = layui.laydate;
		lay('.form_datetime').each(function(){
	    laydate.render({
	      elem: this
	      ,type: 'datetime'
	    });
	  });
	});
    projid = sessionStorage.getItem("id");
	// 初始化表格
	initTable();
	//初始化下拉菜单
	initselect();

	// 搜索
	$('#searchBtn').click(refreshList);

	// 新增清理
	$('#addLink').click(preAdd);
	// 执行新增
	$('#addSaveBtn').click(doAdd);
	
	$('#backLink').click(function(){
		$("#content").load("../proj/cost-list.html");
//		$('#iframe', window.parent.document).attr('src',"../proj/cost-list.html");	
	})
	// 校验表单
	 $("FORM#addForm").validate({
	        errorClass: 'validate-error'
    });
	 $("FORM#editForm").validate({
	        errorClass: 'validate-error'
    });
})

function initselect(){
	$.ajax({
	  type: 'POST',
	  url: '../../proj/api/claiming/findByCode',
	  data:'',
	  success: function(data){
		  $('#addForm select[name="type"]').empty();
		  $.each(data.data,function(i,item){
			  $('#addForm select[name="type"]').append('<option value="'+item.value+'">'+item.name+'</option>');
		  });
	  },
	  async: false
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
		retrieve: true,
		searching: false,
		serverSide: true,
		ordering: false,
		bLengthChange: false,
		iDisplayLength : 10,
		ajax: {
			url: "../../projectmanage/api/cost/detailListQuery",
			dataSrc: "data.list"
		},
		serverParams: function (param) {
			param.id = projid;
        },  
		columns: [{
			data : 'id',
			render: function(data, type, row ,meta) {
				// 返回table序号	
				return meta.row + 1
			}
		}, {
			data : 'type'
		}, {
			data : 'price'
		}, {
			data : 'time'
		}, {
			data : 'writerPeople'
		}, {
			data : 'files',
			render: function(data, type, row) {
				var add = '';
				for(var key in data){
					add += '<a href="../../projectmanage/api/file/download?path='+key +'&name='+data[key]+'">' + data[key] + '</a>';
				}
				return add;
			}
		}, {
			data : 'description'
		},{
			data : 'id',
			render: function(data, type, row) {
				return '<a data-toggle="modal" data-target="#editModal" onclick="preEdit(this)" data-id="' + data + '">查看</a>';
			}
		}]
	});
}

function refreshList() {
	table.api().ajax.reload();
}

function preAdd() {
	//清楚错误信息
	$('#FileText').empty();
	$('#addErrorMessage').html("");
	$('#addForm')[0].reset();
	$('#addForm').validate().resetForm();
}

function doAdd() {
	if (!$('#addForm').validate().form()) {
		return;
	}
	var data = $('#addForm').serializeArray();
	$.post('../../projectmanage/api/cost/detailListQueryAdd',
		{
			type : data[0].value,
			price : data[1].value,
			time : data[2].value,
			description : data[3].value,
			docid : getfileid(data),
			id : projid 
		},
		function(data){
			$('#addErrorMessage').html("");
			if(data.code==200){
				$('#addModal').modal('hide');
				refreshList();
			}else{
				$('#addErrorMessage').append(data.message);
			}
		},
		"json"
	);
	
}

function preEdit(obj) {
	var id = $(obj).data('id');
	//清空之前的附件表
	$('#FileText1').empty();
	$.get('../../projectmanage/api/cost/detailListQueryInfo', {
		id: Request.id,
		costId: id
	}, function(result) {
		$('#editForm').setForm(result.data);
		$.each(result.data.docs, function(i , item) {
			addFileInput(item,"FileText1");
		});
		//取消删除按钮
		$('.deleteedittenderFile').remove();
	});
}
