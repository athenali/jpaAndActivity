var table = null;
$(function() {
			// 初始化表格
			initTable();

			// 搜索
			$('#searchBtn').click(refreshList);

			// 提交
			$('#startBtn').click(doStartBtn);
			$('#withdrawBtn').click(doWithdrawBtn);
			// 新增清理
			$('#addLink').click(preAdd);
			// 执行新增
			$('#addSaveBtn').click(newdoAdd);

			// 执行修改
			$('#editSaveBtn').click(doEdit);

			// 执行删除
			$('#delBtn').click(doDel);
			// 批量删除确认
			$('#delSelect').click(checkSelect);

			// 全选
			$('#selectAll').click(selectAll);

			// 日期控件
			layui.use('laydate', function() {
				var laydate = layui.laydate;
				// 查询
				laydate.render({
							elem : '#addStartTime' // 出差开始时间
						});
				laydate.render({
							elem : '#addEndTime' // 出差结束时间
						});
				laydate.render({
							elem : '#detailStartTime' // 明细开始时间
						});
				laydate.render({
							elem : '#detailEndTime' // 明细结束时间
						});
				laydate.render({
							elem : '#editStartTime' // 编辑明细开始时间
						});
				laydate.render({
							elem : '#editEndTime' // 编辑明细结束时间
						});
			});

			// 校验表单
			$.each($('#addModal form'), function(i, item) {
				$(item).validate({
							errorClass : 'validate-error'
						})
			})

			$("FORM#editForm").validate({
				errorClass : 'validate-error'
			});

})

function initTable() {
	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	table = $("#table").dataTable({
		searching : false,
		bLengthChange : false,
		serverSide : true,
		ordering : false,
		retrieve : true,
		ajax : {
			url : "../../proj/api/claiming/listQuery",
			dataSrc : "data"
		},
		serverParams : function(param) {
			param.reimNum = $('#reimNum').val();
			param.projectName = $('#projectName').val();
			param.status = $('#status').val();
		},
		columns : [{
			data : 'id',
			render : function(data, type, row) {
				return '<input type="checkbox" value="' + data
						+ '" class="selectedItem">'
			}
		}, {
			data : 'reimNum'
		}, {
			data : 'type'
		}, {
			data : 'projectName'
		}, {
			data : 'totalPrice'
		}, {
			data : 'startTime'
		}, {
			data : 'endTime'
		}, {
			data : 'createTime',
			render : function(data, type, row) {
				var data1 = new Date(data);
				var month = data1.getMonth() + 1;
				var minutes = data1.getMinutes();
				if (minutes < 10 && minutes != '0') {
					minutes = "0" + minutes;
				}
				var v = data1.getFullYear() + "-" + month + "-"
						+ data1.getDate() + " " + data1.getHours() + ":"
						+ minutes;
				return v;
			}
		}, {
			data : 'status',
			render : function(data, type, row) {
				var v = "";
				if (data == "finish") {
					v = "审核完成";
				}
				if (data == "draft") {
					v = "草稿";
				}
				if (data == "inProgress") {
					v = "审核中";
				}
				if (data == "withdraw") {
					v = "撤退";
				}
				if (data == "reject") {
					v = "驳回";
				}
				return v;
			}
		}, {
			data : 'id',
			render : function(data, type, row) {
				if (row.status == 'draft' || row.status == 'withdraw') {
					return '<a data-toggle="modal" data-target="#editModal" onclick="preEdit(this)" data-id="'
							+ data
							+ '">修改</a>'
							+ '<a data-toggle="modal" data-target="#delModal" onclick="preDel(this)" data-id="'
							+ data
							+ '">删除</a>'
							+ '<a data-toggle="modal" data-target="#startModal" onclick="preStart(this)" data-id="'
							+ data + '">提交</a>';
				} else if (row.status == 'inProgress') {
					return '<a data-toggle="modal" data-target="#withdrawModal" onclick="preWithdraw(this)"  data-id="'
							+ data
							+ '">撤退</a>'
							+ '<a data-toggle="modal"  onclick="findSelect(this)"  data-id="'
							+ data
							+ '">查看</a>'
							+ '<a data-toggle="modal" onclick="preGraph(this)" data-id="'
							+ data + '">查看流程图</a>';
				} else if (row.status == 'finish') {
					return '<a data-toggle="modal" onclick="findSelect(this)" data-id="'
							+ data
							+ '">查看</a>'
							+ '<a data-toggle="modal"  onclick="preComplete(this)"  data-id="'
							+ data + '">查看流程图</a>';
				} else if (row.status == 'reject') {
					return '<a data-toggle="modal" onclick="findSelect(this)" data-id="'
							+ data
							+ '">查看</a>'
							+ '<a data-toggle="modal" data-target="#editModal" onclick="preEdit(this)" data-id="'
							+ data
							+ '">修改</a>'
							+ '<a data-toggle="modal" data-target="#delModal" onclick="preDel(this)" data-id="'
							+ data
							+ '">删除</a>'
							+ '<a data-toggle="modal" data-target="#startModal" onclick="preStart(this)" data-id="'
							+ data + '">提交</a>'
				} else {
					return '<a data-toggle="modal" onclick="findSelect(this)" data-id="'
							+ data + '">查看</a>'
				}

			}
		}]
	});
}

function refreshList() {
	table.api().ajax.reload();
}

function preStart(obj) {
	$('#startModal').data('id', $(obj).data('id'));
}

function doStartBtn() {
	$.post('../../proj/api/claiming/startProcess', {
				id : $('#startModal').data('id')
			}, function(data) {
				$('#startModal').modal('hide');
				refreshList();
			});
}

function preAdd() {
	// 清空错误信息
	$("#formpart").empty();
	$('#FileText').empty();
	$('#addErrorMessage').html("");
	$('#addForm_base').validate().resetForm();
	$('.cost_detal').validate().resetForm();
	$('#addForm_count').validate().resetForm();
	$.each($('#addForm_base'), function(i, item) {
				item.reset();
			})
	$.each($('.cost_detal'), function(i, item) {
				item.reset();
			})
	$.each($('#addForm_count'), function(i, item) {
				item.reset();
			})

	// $('#addForm').validate().resetForm();

	$.post('../../proj/api/claiming/getAllProjects', {}, function(data) {
				var html = new Array();
				$(data.data).each(function(index, obj) {
							html.push("<option value=")
							html.push(obj.id);
							html.push(">");
							html.push(obj.name);
							html.push("</option>)");
						});
				$("#addProjId").html(html.join(""));
			});

	$.post('../../proj/api/claiming/findByCode', {}, function(data) {
				var html = new Array();
				$(data.data).each(function(index, obj) {
							html.push("<option value=")
							html.push(obj.value);
							html.push(">");
							html.push(obj.name);
							html.push("</option>)");
						});
				$("#addBasicType").html(html.join(""));
			});

	$.post('../../rs/proj/dict/findReimByCode', {}, function(data) {
				var html = new Array();
				$(data.data).each(function(index, obj) {
							html.push("<option value=")
							html.push(obj.value);
							html.push(">");
							html.push(obj.name);
							html.push("</option>)");
						});
				$("#addCostType").html(html.join(""));
			});
}
function newdoAdd() {
	$.each($('#addModal form'), function(i, item) {
				if ($(item).validate().form()) {
					return;
				}
			});
	var json = {};
	var baseinfo = $('#addForm_base').serializeObject();
	var basecount = $('#addForm_count').serializeObject();
	json = baseinfo;
	json.approval = basecount.approval;
	json.totalPrice = basecount.totalPrice;
	var forms = $('.cost_detal');
	json.costdetal = [];
	$.each(forms, function(i, item) {
				var costdetal = $(item).serializeObject();
				json.costdetal.push(costdetal);
			});
	$.post('../../proj/api/claiming/add', {
				costDetail : JSON.stringify(json)
			}, function(data) {
				$('#addErrorMessage').html("");
				if (data.code == 200) {
					$('#addModal').modal('hide');
					refreshList();
				} else {
					$('#addErrorMessage').append(data.message);
				}
			}, "json");
}

function doAdd() {
	var fileId = [];
	for (i = 0; i < $('.uploadfile').length; i++) {
		fileId[i] = $('.uploadfile')[i].id;
	}
	var json = {};
	var data = $('#addForm').serializeArray();
	var data2 = $('#addForm').serializeObject();
	// 基本信息
	json.claimType = data[0].value; // teimType
	json.projId = data[1].value; // projId
	json.type = data[2].value; // feeType
	json.startTime = data[3].value; // startDate
	json.endTime = data[4].value; // endDate
	json.totalDays = data[5].value; // day
	json.reason = data[6].value; // reason

	j = 7;// 费用明细从data第六个开始
	k = 0;// 第N个费用明细
	json.costdetal = [];
	// 费用明细
	while (j < data.length - 3) {
		// 五个一循环
		json.costdetal[k] = {};
		json.costdetal[k].type = data[j++].value; // feeType
		json.costdetal[k].startTime = data[j++].value; // startDate
		json.costdetal[k].endTime = data[j++].value; // endDate
		json.costdetal[k].costAmount = data[j++].value; // money
		json.costdetal[k].descn = data[j++].value; // reason
		while (data[j].name == 'docid') {// 跳过上传附件的data
			j++;
		}
		k++;
	}
	// 审批人
	json.approval = data[data.length - 1].value; // approval
	json.totalPrice = data[data.length - 2].value; // totalPrice
	$.post('../../proj/api/claiming/add', {
		costDetail : JSON.stringify(json),
		docid : getfileid(data)
			// 添加上传附件的id
		}, function(data) {
		$('#addErrorMessage').html("");
		if (data.code == 200) {
			$('#addModal').modal('hide');
			refreshList();
		} else {
			$('#addErrorMessage').append(data.message);
		}
	}, "json");
}
function computeMoney() {
	var eachMoney = $(".jine");
	var sumMoney = 0;
	for (i = 0; i < eachMoney.length; i++) {
		sumMoney = parseFloat(parseFloat(sumMoney)
				+ parseFloat(eachMoney[i].value));
	}
	$('#totalMoney').val(sumMoney);
}

var fileid = 0;
// TODO 生成表单
function addDetail() {

	fileid = parseInt(fileid) + 1;
	var add = new Array();
	add.push('<div class="form-box" id=addformbody' + fileid + '>');
	// 删除明细
	add.push("<button type=\"button\" class=\"btn btn-danger del\" style=\"float: right;\" aria-label=\"Right Align\" id=\"delDetail\" value=\""+ fileid + "\">");
	add.push("<span class=\"glyphicon glyphicon-minus\" aria-hidden=\"true\">");
	add.push("</span>");
	add.push("删除明细")
	add.push("</button>");
	add.push("<br>")
	add.push('<form class="cost_detal">');
	add.push('<span class="tit"><i class="icon fa fa-asterisk red smaller-70"></i>费用类型：</span> <select class="form-control" style="width: 99px;" name="type" id="addCosType'+ fileid + '" required>');
	$.post('../../rs/proj/dict/findByCode', {}, function(data) {
		var html = new Array();
		$(data.data).each(function(index, obj) {
					html.push("<option value=")
					html.push(obj.value);
					html.push(">");
					html.push(obj.name);
					html.push("</option>)");
				});
		$("#addCosType" + fileid).html(html.join(""));
			});
	add.push('</select> ');

	add.push('<span class="tit" style="width: 74px;"><i class="icon fa fa-asterisk red smaller-70"></i>发生时间：</span> ');
	add.push('<input type="text" class="form-control datepicker" id="detailStartTime'+fileid+'" name="startTime" placeholder="请输入开始时间" required maxlength="50" style="width: 125px; display: inline-block;" />');
	add.push(' 至 ');
	add.push('<input type="text" class="form-control datepicker" id="detailEndTime'+fileid+'" name="endTime" placeholder="请输入结束时间" required maxlength="50" style="width: auto; display: inline-block;" />');
	add.push('<br> <br>');
	add.push('<span class="tit"><i class="icon fa fa-asterisk red smaller-70"></i>费用金额：</span>');
	add.push('<input type="text" class="form-control jine" required name="costAmount" onblur="computeMoney()" onkeyup="onlyNumber(this)" onblur="onlyNumber(this)" onblur="this.v();" style="width: 490px;" />');
	add.push('<br> <br> ');
	add.push('<span class="tit"><i class="icon fa fa-asterisk red smaller-70"></i>费用说明：</span>');
	add.push('<textarea rows="2" class="form-control" name="descn"');
	add.push('placeholder="请输入费用说明" maxlength="200" required style="margin-left: 0%;width: 490px;"></textarea>');
	add.push('<br> <br> ');
	add.push('<!--文件上传需要添加 -->');
	add.push('<div class="form-box">');
	add.push('<span class="tit">上传附件：</span>');
	add.push('<a href="javascript:;" class="a-upload"><input id="File'+ fileid+ '" type="file" name="file" multiple onchange ="oneupload(null,null,\'File'+ fileid + '\',\'FileText' + fileid + '\')"/>点击上传文件</a>');
	add.push('</div>');
	add.push('<div id="FileText' + fileid + '">');
	add.push('</div>');
	add.push('<span id="addErrorMessage" style="color: red;">')
	add.push("</span>")
	add.push('</form>');
	add.push('</div>');

	$("#formpart").append(add.join(''));

	$(".del").click(function() {
			$('#addformbody' + this.value).remove();
	});

	$.each($('#addModal form'), function(i, item) {
			$(item).validate({
							errorClass : 'validate-error'
							})
	})
	layui.use('laydate', function() {
			var laydate = layui.laydate;
			// 查询
			laydate.render({
						elem : '#detailStartTime'+fileid // 明细开始时间
						});
			laydate.render({
						elem : '#detailEndTime'+fileid // 明细结束时间
						});
	});
}

function addDetail2() {
	var reimId = $('input[name=id]').val();
	$.post('../../proj/api/claiming/addSingleDetail', {
				id : reimId
			}, function(data) {
				fileid = parseInt(fileid) + 1;
				var add = new Array();
				add.push("<div class=\"form-box\" id=\"addeditformbody"+ fileid + "\">");
				add.push("<input name=\"id\" value=\"\" class=\"reimId\" type=\"hidden\" />");
				add.push("<input id=\"nullDetailId\" class=\"costId\" name=\"nullDetailId\" value=\"\" type=\"hidden\"/>");
				// 删除明细
				add.push("<button type=\"button\" class=\"btn btn-danger del\" style=\"float: right;\" name=\"test\" aria-label=\"Right Align\" id=\"delNullDetail\"  value=\""+ fileid+ "\" onclick=\"deleteNullDetail("+ data.data + "," + fileid + ")\">");
				add.push("<span class=\"glyphicon glyphicon-minus\" aria-hidden=\"true\">");
				add.push("</span>");
				add.push("删除明细")
				add.push("</button>")
				add.push("<br>");
				add.push("<span class=\"tit\"><i class=\"icon fa fa-asterisk red smaller-70\"></i>费用类型：</span>");
				add.push('<select class=\"form-control\" style=\"width: 113px;\" name=\"type\" id="feeType1'+ fileid + '" required>');
				$.post('../../rs/proj/dict/findByCode', {}, function(data) {
						var html = new Array();
						$(data.data).each(function(index, obj) {
									html.push("<option value=")
									html.push(obj.value);
									html.push(">");
									html.push(obj.name);
									html.push("</option>)");
								});
						$("#feeType1" + fileid).html(html.join(""));
						});
				add.push("</select>");
				add.push("<span class=\"tit\" style=\"width: 74px;\"><i class=\"icon fa fa-asterisk red smaller-70\"></i>发生时间：</span>");
				add.push("<input type=\"text\" class=\"form-control datepicker\"  id=\"editAddStartTime"+fileid+"\" name=\"startDate\" style=\"width: 125px;\" placeholder=\"请输入开始时间\" required maxlength=\"50\" display: inline-block;\" />");
				add.push(" 至 ");
				add.push("<input type=\"text\" class=\"form-control datepicker\" id=\"editAddEndTime"+fileid+"\" name=\"endDate\" placeholder=\"请输入结束时间\" required maxlength=\"50\" style=\"width: auto; display: inline-block;\" />");
				add.push('<br> <br>');
				add.push("<span class=\"tit\"><i class=\"icon fa fa-asterisk red smaller-70\"></i>费用金额：</span>");
				add.push("<input type=\"text\" class=\"form-control editjine\" required onblur=\"window.computeMoneyedit()\" onkeyup=\"onlyNumber(this)\" onblur=\"onlyNumber(this)\" name=\"money\" style=\"width: 490px;\" />");
				add.push("<br>");
				add.push("<br>");
				add.push("<span class=\"tit\"><i class=\"icon fa fa-asterisk red smaller-70\"></i>费用说明：</span>");
				add.push("<textarea rows=\"2\" class=\"form-control\" name=\"reason\" required  style=\"width: 490px;margin-left: 0%;\" placeholder=\"请输入费用说明\"  maxlength=\"200\">");
				add.push("</textarea>");
				add.push("<br>");
				add.push("<br>");
				add.push('<div class="form-box">');
				add.push('<span class="tit">上传附件：</span>');
				add.push('<a href="javascript:;" class="a-upload"><input id="File'+ fileid+ '" type="file" name="file" multiple onchange ="oneupload('+ data.data+ ',\'费用明细附件\',\'File'+ fileid+ '\',\'FileText' + fileid + '\')"/>点击上传文件</a>');
				add.push('</div>');
				add.push('<div id="FileText' + fileid + '">');
				add.push('</div>');

				$("#editAddCostDetail").append(add.join(''));

				layui.use('laydate', function() {
						var laydate = layui.laydate;
						// 查询
						laydate.render({
									elem : '#editAddStartTime'+fileid // 明细开始时间
								});
						laydate.render({
									elem : '#editAddEndTime'+fileid // 明细结束时间
								});

				});
	});
			
	$("FORM#editForm").validate({
				errorClass : 'validate-error'
			});

	$("#editcloseBtn").click(function() {
				for (var i = 0; i <= fileid; i++) {
					$("#addeditformbody" + i).remove();
				}
			});
	$("#editclose").click(function() {
				for (var i = 0; i <= fileid; i++) {
					$("#addeditformbody" + i).remove();
				}
			});

}

function deleteNullDetail(detailId, fileid) {
	$("input.reimId").show();
	$("input.costId").show();
	$("#addeditformbody" + fileid).remove();

	$.ajax({
				type : "POST",
				url : "../../proj/api/claiming/delDetail",
				data : {
					"detailId" : detailId
				},
				success : function() {
					console.log("删除成功");
				}

			});

}

function doRecal() {
	$.post('../../proj/api/claiming/recal', {
				id : $(this).data('id')
			}, function(data) {
				// $('#startModal').modal('hide');
				refreshList();
			});
}
function dateConvert(time) {
	var data1 = new Date(time);
	var month = data1.getMonth() + 1;
	var v = data1.getFullYear() + "-" + month + "-" + data1.getDate();
	return v;
}
function preEdit(obj) {
	$('#editForm').validate().resetForm();
	var id = $(obj).data('id');
	$.ajax({
				type : 'POST',
				url : '../../proj/api/claiming/getAllProjects',
				data : '',
				success : function(data) {
					var html = new Array();
					$(data.data).each(function(index, obj) {
								html.push("<option value=")
								html.push(obj.id);
								html.push(">");
								html.push(obj.name);
								html.push("</option>)");
							});
					$("#editProjId").html(html.join(""));
				},
				async : false
			});
	$.ajax({
				type : 'POST',
				url : '../../proj/api/claiming/findByCode',
				data : '',
				success : function(data) {
					var html = new Array();
					$(data.data).each(function(index, obj) {
								html.push("<option value=")
								html.push(obj.value);
								html.push(">");
								html.push(obj.name);
								html.push("</option>)");
							});
					$("#editBasicType").html(html.join(""));
				},
				async : false
			});

	$.get('../../proj/api/claiming/singleInfo', {
				id : id
			}, function(data) {
				var BasicInfo = data.data.data;
				var CostInfo = data.data.priceDetail;
				var files = data.data.docs;
				var editHtml = new Array();
				$("#editProjId").val(BasicInfo.projectId);
				$("#editBasicType").val(BasicInfo.type);
				$("#editStartTime").val(BasicInfo.startTime);
				$("#editEndTime").val(BasicInfo.endTime);
				$("#totalDays").val(BasicInfo.totalDays);
				$("#editTotalMoney").val(BasicInfo.totalPrice);
				$("#reimexplain").val(BasicInfo.reason);
				$('#editAddCostDetail').empty();
				$.each(CostInfo, function(i, cost) {
					editHtml.push("<div class=\"form-box\" id=\"editAddCostDetail"+ i + "\">");
					editHtml.push("<input name=\"id\" value=\"" + id+ "\" type=\"hidden\" />");
					editHtml.push("<input name=\"detailId\" value=\"" + cost.id+ "\" type=\"hidden\"/>")
					editHtml.push("<span class=\"tit\"><i class=\"icon fa fa-asterisk red smaller-70\"></i>费用类型：</span>");
					editHtml.push('<select class=\"form-control\" style=\"width: 112px;\" name=\"type\" id="feeType2'+ i + '" required>');

					$.post('../../rs/proj/dict/findByCode', {}, function(data) {
								var html = new Array();
								$(data.data).each(function(index, obj) {
											html.push("<option value=")
											html.push(obj.value);
											html.push(">");
											html.push(obj.name);
											html.push("</option>)");
											$("#feeType2" + i).html(html
													.join(""));
										});
								$("#feeType2" + i).val(cost.type);
							});
					editHtml.push("</select>");
					editHtml.push("<span class=\"tit\" style=\"width: 74px;\"><i class=\"icon fa fa-asterisk red smaller-70\"></i>发生时间：</span>");
					editHtml.push("<input type=\"text\" class=\"form-control datepicker\" name=\"startDate\" id=\"editStartTime"+i+"\"  placeholder=\"请输入开始时间\" required maxlength=\"50\" style=\"width: 125px; display: inline-block;\" value=\""+ dateConvert(cost.startTime) + "\" />");
					editHtml.push(" 至 ");
					editHtml.push("<input type=\"text\" class=\"form-control datepicker\" name=\"endDate\" id=\"editEndTime"+i+"\" placeholder=\"请输入结束时间\" required maxlength=\"50\" style=\"width: auto; display: inline-block;\" value=\""+ dateConvert(cost.endTime) + "\"/>");
					editHtml.push('<br> <br>');
					editHtml.push("<span class=\"tit\"><i class=\"icon fa fa-asterisk red smaller-70\"></i>费用金额：</span>");
					editHtml.push("<input type=\"text\"  class=\"form-control editjine\" name=\"money\" value=\""+ cost.costAmount+ "\" onblur=\"window.computeMoneyedit()\" required onkeyup=\"onlyNumber(this)\" onblur=\"onlyNumber(this)\" style=\"width: 490px;\" />");
					editHtml.push("<br>");
					editHtml.push("<br>");
					editHtml.push("<span class=\"tit\"><i class=\"icon fa fa-asterisk red smaller-70\"></i>费用说明：</span>");
					editHtml.push("<textarea rows=\"2\" class=\"form-control\" name=\"reason\" required placeholder=\"请输入费用说明\" maxlength=\"200\" style=\"margin-left: 0%;width: 490px;\">"+ cost.descn + "</textarea>");
					editHtml.push("<br>");
					editHtml.push("<br>");
					editHtml.push('<div class="form-box">');
					editHtml.push('<span class="tit">上传附件：</span>');
					editHtml.push('<a href="javascript:;" class="a-upload"><input id="File'+ i+ '" type="file" name="file" multiple onchange ="oneupload('+ cost.id+ ',\'费用明细附件\',\'File'+ i+ '\',\'FileText'+ cost.id+ '\')"/>点击上传文件</a>');
					editHtml.push('</div>');
					editHtml.push('<div id="FileText' + cost.id + '">');
					editHtml.push('</div>');
					if (i > 0) {
						editHtml.push("<button type=\"button\" class=\"btn btn-danger delCost\" style=\"float: right;\" aria-label=\"Right Align\" id=\"delDetail\" value=\""+ i + "\" onclick=\"deleteDetail()\">")
						editHtml.push("<span class=\"glyphicon glyphicon-minus\" aria-hidden=\"true\">");
						editHtml.push("</span>删除明细</button><br>");
					}

					editHtml.push("</div>");

				});
				$("#editAddCostDetail").append(editHtml.join(''));
				// 回显添加附件
				$.each(CostInfo, function(i, cost) {
							$.each(files[cost.id], function(i, item) {
										addFileInput(item, 'FileText' + cost.id);
									});
						});
				$(".delCost").click(function() {
							$("#editAddCostDetail" + this.value).empty();
						});

				layui.use('laydate', function() {
						var laydate = layui.laydate;
						// 查询
						laydate.render({
									elem : '#editStartTime'+i // 明细开始时间
								});
						laydate.render({
									elem : '#editEndTime'+i // 明细结束时间
								});

					});

			});

}
function computeMoneyedit() {
	var eachMoney = $(".editjine");
	var sumMoney = 0;
	for (i = 0; i < eachMoney.length; i++) {
		sumMoney = parseFloat(parseFloat(sumMoney)
				+ parseFloat(eachMoney[i].value));
	}
	$('#editTotalMoney').val(sumMoney);
}

function deleteDetail() {
	var detailId = $('input[name=detailId]').val();
	$.ajax({
				type : "POST",
				url : "../../proj/api/claiming/delDetail",
				data : {
					"detailId" : detailId
				},
				success : function() {
					console.log("删除成功");
				}

			});

}
function doEdit() {
	var isok = true;
	$.each($('#editModal textarea'), function(i, item) {
				if (!$('#editForm').validate().element($(item))) {
					isok = false;
					return false;
				}
			})
	if (!isok) {
		return false
	}
	var reimId = $('input[name=id]').val();
	var fileId = [];
	for (i = 0; i < $('.uploadfile').length; i++) {
		fileId[i] = $('.uploadfile')[i].id;
	}
	var json = {};
	var data = $('#editForm').serializeArray();
	// 基本信息
	json.claimType = data[0].value; // teimType
	json.projId = data[1].value; // projId
	json.type = data[2].value; // feeType
	json.startTime = data[3].value; // startDate
	json.endTime = data[4].value; // endDate
	json.totalDays = data[5].value; // day
	json.reason = data[6].value; // reason

	j = 7;// 费用明细
	k = 0;// 第N个费用明细
	json.costdetal = [];
	// 费用明细
	while (j <= data.length - 3) {
		j = j + 2;
		// 五个一循环
		json.costdetal[k] = {};
		json.costdetal[k].type = data[j++].value; // feeType
		json.costdetal[k].startTime = data[j++].value; // startDate
		json.costdetal[k].endTime = data[j++].value; // endDate
		json.costdetal[k].costAmount = data[j++].value; // money
		json.costdetal[k].descn = data[j++].value; // reason
		while (data[j].name == 'docid[]') {// 跳过上传附件的data
			j++;
		}
		k++;
	}
	// 审批人
	json.approval = data[data.length - 1].value; // approval
	json.totalPrice = data[data.length - 2].value; // totalPrice

	$.ajaxFileUpload({

				url : '../../proj/api/claiming/update', // 用于文件上传的服务器端请求地址
				data : {
					reimId : reimId,
					costDetail : JSON.stringify(json)
				},
				secureuri : false, // 是否需要安全协议，一般设置为false
				fileElementId : fileId, // 文件上传域的ID []
				dataType : 'json', // 返回值类型 一般设置为json
				success : function(data, status) {
					$('#addErrorMessage').html("");
					if (data.code == 200) {
						$('#editModal').modal('hide');
						refreshList();
					} else {
						$('#addErrorMessage').append(data.message);
					}
				},
				error : function(data, status, e) {// 服务器响应失败处理函数
					console.info(data, status, e);
				}
			})
}

function preDel(obj) {
	var id = $(obj).data('id');
	$('input.selectedItem').prop('checked', false);
	$('input[value=' + id + '].selectedItem').prop('checked', true);
}

function checkSelect() {
	if ($('input.selectedItem:checked').length == 0) {
		$('#alertModal').modal('show');
	} else {
		$('#delModal').modal('show');
	}
}

function doDel() {
	var array = [];
	$.each($('input.selectedItem:checked'), function() {
				array.push(this.value);
			});
	$.post('../../proj/api/claiming/delete', {
				ids : array
			}, function(result) {
				if (result.data.length > 0) {
					var html = new Array();
					$(result.data).each(function(index, obj) {
								html.push('<p style="margin-left: 109px;">')
								html.push(obj);
								html.push('<p/>')
							});
					$("#tbody").html(html.join(""));
					$('#delModal').modal('hide');
					$('#errorModal').modal('show');
				} else {
					$('#delModal').modal('hide');
				}
				refreshList();
			});
}

function selectAll() {
	$('input.selectedItem').prop('checked', $(this).prop('checked'));
}

function preGraph(obj) {
	var reimId = $(obj).data('id');
	sessionStorage.setItem("reimId", reimId);
	$("#content").load("../proj/reim-graph.html");

}

function findSelect(obj) {
	var id = $(obj).data('id');
	sessionStorage.setItem("id", id);
	$("#content").load("../proj/reim-find.html");
}

function preWithdraw(obj) {
	$('#withdrawModal').data('id', $(obj).data('id'));
}
function doWithdrawBtn() {
	$.post('../../proj/api/claiming/withdraw', {
				id : $('#withdrawModal').data('id')
			}, function(data) {
				var html = new Array();
				if (data.data == "流程不能撤销") {
					html.push('<p style="margin-left: 155px;">')
					html.push(data.data);
					html.push('<p/>')
					$("#tbody").html(html.join(""));
					$('#withdrawModal').modal('hide');
					$('#errorModal').modal('show');
				} else {
					$('#withdrawModal').modal('hide');
				}
				refreshList();
			});
}
function preComplete(obj) {
	var id = $(obj).data('id');
	sessionStorage.setItem("id", id);
	$("#content").load("../proj/reim-complete.html");
}
function onlyNumber(obj) {
	// 得到第一个字符是否为负号
	var t = obj.value.charAt(0);
	// 先把非数字的都替换掉，除了数字和.
	obj.value = obj.value.replace(/[^\d\.]/g, '');
	// 必须保证第一个为数字而不是.
	obj.value = obj.value.replace(/^\./g, '');
	// 保证只有出现一个.而没有多个.
	obj.value = obj.value.replace(/\.{2,}/g, '.');
	// 保证.只出现一次，而不能出现两次以上
	obj.value = obj.value.replace('.', '$#$').replace(/\./g, '').replace('$#$',
			'.');
	// 如果第一位是负号，则允许添加
	if (t == '-') {
		obj.value = '-' + obj.value;
	}
}
