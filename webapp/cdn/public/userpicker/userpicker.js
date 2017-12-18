
UserPicker = function() {
}

UserPicker.prototype.init = function(conf) {
	conf = conf ? conf : {};
	this.conf = conf;

	var defaults = {
		modalId: 'userPicker',
		multiple: false,
		searchUrl: '/mossle-web-user/default/rs/user/search',
		treeUrl: '/mossle-app-lemon/rs/party/tree?partyStructTypeId=1',
		callback: 'callbackUserPicker'
	};
	conf.userPickerTable = null;
	conf.userDeptId = null;

	for (var key in defaults) {
		if (!conf[key]) {
			conf[key] = defaults[key];
		}
	}

    if ($('#' + conf.modalId).length == 0) {
        $(document.body).append(
'<div id="' + conf.modalId + '" class="modal fade">'
+'  <div class="modal-dialog" style="width:80%;">'
+'    <div class="modal-content">'
+'      <div class="modal-header">'
+'        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
+'        <h3>选择用户</h3>'
+'      </div>'
+'      <div class="modal-body">'
+'					<div class="container-fluid">'
+'						<div class="col-md-2">'
+'							<div class="ztree" id="userPicker_tree"></div>'
+'						</div>'
+'						<div class="table-box col-md-10">'
+'							<table class="table table-bordered" id="userPicker_table">'
+'								<thead>'
+'									<tr>'
+'										<th style="width:50px;"></th>'
+'										<th style="">成员名称</th>'
+'										<th style="">负责项目</th>'
+'										<th style="">参与项目</th>'
+'										<th style="">是否休假</th>'
+'										<th style="">是否出差</th>'
+'										<th style="">出差地点</th>'
+'										<th style="">出差周期时间</th>'
+'									</tr>'
+'								</thead>'
+'								<tbody></tbody>'
+'							</table>'
+'						</div>'
+'					</div>'
+'      </div>'
+'      <div class="modal-footer">'
+'        <span id="' + conf.modalId + '_result" style="float:left;"></span>'
+'        <a id="' + conf.modalId + '_close" href="#" class="btn" data-dismiss="modal">关闭</a>'
+'        <a id="' + conf.modalId + '_select" href="#" class="btn btn-primary">选择</a>'
+'      </div>'
+'    </div>'
+'  </div>'
+'</div>');

    }

	var self = this;
	$(document).delegate('.userPicker', 'click', function(e) {
		self.showModal(e);
	});
    $(document).delegate('INPUT.selectedItem', 'click', function(e) {
		self.onUserPickerClickCheckboxOrRadio(e)
	});

	$(document).delegate('.glyphicon-remove', 'click', function(e) {
		var id = $(this).parent().attr('id');
		$('#' + conf.modalId + '_item_' + id).prop('checked', false);
		$(this).parent().remove();
	});

	$(document).delegate('#' + conf.modalId + '_search', 'click', function(e) {
		doSearch($('#' + conf.modalId + '_username').val());
	});

	$(document).delegate('#' + conf.modalId + '_username', 'keypress', function(e) {
		if (e.which == 13) {
			doSearch($('#' + conf.modalId + '_username').val());
		}
	});

	$(document).delegate('#' + conf.modalId + '_select', 'click', function(e) {
		self.onSelect(e);
	});

	UserPicker.userPicker = this;
}

UserPicker.prototype.doSearch = function(username) {
	$.ajax({
		url: conf.searchUrl,
		data: {
			username: username
		},
		success: function(data) {
			var html = '';
			for (var i = 0; i < data.length; i++) {
				var item = data[i];
				html +=
				  '<tr>'
					+'<td><input id="' + conf.modalId + '_item_' + i + '" type="' + (conf.multiple ? 'checkbox' : 'radio')
					+ '" class="selectedItem" name="name" value="'
					+ item.id + '" title="' + item.displayName + '"></td>'
					+'<td><label for="' + conf.modalId + '_item_' + i + '">' + item.displayName + '</label></td>'
				  +'</tr>'
			}
			$('#' + conf.modalId + '_body').html(html);
		}
	});
}

UserPicker.prototype.doSearchChild = function(parentId) {
	$.ajax({
		url: conf.childUrl,
		data: {
			parentId: parentId
		},
		success: function(data) {
			var html = '';
			for (var i = 0; i < data.length; i++) {
				var item = data[i];
				html +=
				  '<tr>'
					+'<td><input id="' + conf.modalId + '_item_' + i + '" type="' + (conf.multiple ? 'checkbox' : 'radio')
					+ '" class="selectedItem" name="name" value="'
					+ item.id + '" title="' + item.displayName + '"></td>'
					+'<td><label for="' + conf.modalId + '_item_' + i + '">' + item.displayName + '</label></td>'
				  +'</tr>'
			}
			$('#' + conf.modalId + '_body').html(html);
		}
	});
}

UserPicker.prototype.onUserPickerClickCheckboxOrRadio = function(e) {
	var conf = this.conf;

	var el = $(e.target ? e.target : e.srcElement);
	if (conf.multiple) {
		if (el.prop('checked')) {
			var html = '&nbsp;<span class="label label-default" id="' + el.val() + '" title="' + el.attr('title') + '" data-telephone="' + el.data('telephone') + '">'
				+ el.attr('title')
				+ '<i class="glyphicon glyphicon-remove" style="cursor:pointer;"></i>'
				+ '</span>';
			$('#' + conf.modalId + '_result').append(html);
		} else {
			$('#' + conf.modalId + '_result #' + el.val()).remove();
		}
	} else {
		var html = '<span class="label label-default" id="' + el.val() + '" title="' + el.attr('title') + '">' + el.attr('title') + '<i class="glyphicon glyphicon-remove" style="cursor:pointer;"></i></span>';
		$('#' + conf.modalId + '_result').html(html);
	}
}

UserPicker.prototype.initTree = function() {
	//清除上次信息
	$('#userPicker_table tbody').html('');
	var conf = this.conf;

	var setting = {
		async: {
			enable: true,
			url: "../../rs/proj/dept/tree"
		},
		callback: {
			onClick: function(event, treeId, treeNode) {
				if (treeNode.id == '0') {
					conf.userDeptId = null;
				} else {
					conf.userDeptId = treeNode.id;
				}
				conf.userPickerTable.api().ajax.reload();
			}
		}
	};

	var zNodes = [];

	$.fn.zTree.init($("#userPicker_tree"), setting, zNodes);
}

UserPicker.prototype.initTable = function() {
	var conf = this.conf;

	$.extend(true, $.fn.dataTable.defaults, {
		"language": {
			"url": "../../cdn/public/datatable/Chinese.txt"
		}
	});

	conf.userPickerTable = $("#userPicker_table").dataTable({
		retrieve: true,
		searching: false,
		serverSide: true,
		ordering: false,
		bAutoWidth:false,//让自定义表格宽度生效
		bLengthChange:false,//隐藏显示多少条
		ajax: {
			url: "../../rs/proj/user/infos",
			dataSrc: "data.result"
		},
		serverParams: function (param) {
			var jsonFilter = {
			};
			if (conf.userDeptId != null) {
				jsonFilter.EQ_deptId = conf.userDeptId
			}
			param.jsonFilter = JSON.stringify(jsonFilter);
		},  
		columns: [{
			data : 'id',
			render: function(data, type, row) {
				if (conf.multiple) {
					return '<input type="checkbox" value="' + data + '" class="selectedItem" title="' + row.displayName + '" data-telephone="' + row.telephone + '">'
						+ '<input type="hidden" name="userId" value="'+data+'">';
				} else {
					return '<input type="radio" value="' + data + '" class="selectedItem" title="' + row.displayName + '" data-telephone="' + row.telephone + '" name="selectedItem">'
						+ '<input type="hidden" name="userId" value="'+data+'">';
				}
			}
		},{
			data : 'displayName'
		},{
			data : 'projectManager',
			render:function(data){
				var html = '';
				if (data.idle === true) {
					html = '无';
				} else {
					if (data.investigationCount != 0) {
						html += '调研(' + data.investigationCount + ')<br>'
					}
					if (data.firstDraftCount != 0) {
						html += '初稿(' + data.firstDraftCount + ')<br>'
					}
					if (data.finalDraftCount != 0) {
						html += '终稿(' + data.finalDraftCount + ')'
					}
				}
				return html;
			}
		}, {
			data: 'projectRelationship',
			render: function(data) {
				var html = '';
				if (data.idle === true) {
					html = '空闲';
				} else {
					if (data.investigationCount != 0) {
						html += '调研(' + data.investigationCount + ')<br>'
					}
					if (data.firstDraftCount != 0) {
						html += '初稿(' + data.firstDraftCount + ')<br>'
					}
					if (data.finalDraftCount != 0) {
						html += '终稿(' + data.finalDraftCount + ')'
					}
				}
				return html;
			}
		}, {
			data: 'leave',
			render: function(data){
				if(data=='是'){
					return "<span style='color: #1cd11d;'>是</span>";
				}else{
					return "否";
				}
			}
		}, {
			data: 'travel',
			render: function(data){
				if(data=='是'){
					return "<span style='color: #1cd11d;'>是</span>";
				}else{
					return "否";
				}
			}
		}, {
			data: 'travelAddress'
		}, {
			data: 'travel',
			render: function(data, type, row) {
				if (row.travel == '否') {
					return '';
				} else {
					return row.travelStartDate + '至' + row.travelEndDate;
				}
			}
		}]
	});
}

UserPicker.prototype.showModal = function(e) {
	var conf = this.conf;
	var el = $(e.target ? e.target : e.srcElement);

	var multiple = el.data('multiple');
	if (multiple) {
		conf.multiple = true;
	} else {
		conf.multiple = false;
	}
	var callback = el.data('callback');
	if (callback) {
		conf.callback = callback;
	}

	try {
		conf.userDeptId = null;

		this.initTree();
	} catch(e) {
		console.error(e);
	}

	try {
		conf.userPickerTable = null;
		this.initTable();
	} catch(e) {
		console.error(e);
	}


	$('INPUT.selectedItem:checked').each(function(index, item) {
		$(item).prop('checked', false);
	});
	$('#' + conf.modalId + '_result').html('');

	$('#' + conf.modalId).data('userPicker', el.parent());
	$('#' + conf.modalId).modal();

	// doSearch('');
}

UserPicker.prototype.onSelect = function(e) {
	var conf = this.conf;
	$('#' + conf.modalId).modal('hide');

	if (conf.callback == 'callbackUserPicker_add') {//机会追踪
		userPicker_addUser_add(e, conf);
	} else if(conf.callback == 'callbackUserPicker_edit'){
		userPicker_addUser_edit(e, conf);
	}else if (conf.callback == 'memberAdd') {//项目列表-项目成员
		userPicker_addMember(e, conf);
	}else if(conf.callback == 'callbackApprover'){//合同-审批人
		userPicker_addApprover(e, conf);
	}else if(conf.callback == 'callbackLeader_add'){//机会-负责人
		userPicker_addLeader_add(e, conf);
	}else if(conf.callback == 'callbackLeader_edit'){
		userPicker_addLeader_edit(e, conf);
	}else if(conf.callback == 'callbackManager'){//项目列表-项目负责人
		userPicker_addManager(e, conf);
	}else if(conf.callback == 'callbackManagerAssistant'){//项目列表-项目助理
		userPicker_addManagerAssistant(e, conf);
	}
}
//机会追踪-添加
function userPicker_addUser_add(e, conf) {
	var userPickerElement = $('#' + conf.modalId).data('userPicker');
	var el = $('#' + conf.modalId + '_result .label');
	var names = [];
	el.each(function(index, item) {
		names.push($(item).attr('title'));
	});
	$('#addModal').find('input[name=partyaPerson]').val(names.join(','));
}
//机会追踪-修改
function userPicker_addUser_edit(e, conf) {
	var userPickerElement = $('#' + conf.modalId).data('userPicker');
	var el = $('#' + conf.modalId + '_result .label');
	var names = [];
	el.each(function(index, item) {
		names.push($(item).attr('title'));
	});
	$('#editModal').find('input[name=partyaPerson]').val(names.join(','));
}

//合同中特殊合同-审批人
function userPicker_addApprover(e, conf) {
	var userPickerElement = $('#' + conf.modalId).data('userPicker');
	var el = $('#' + conf.modalId + '_result .label');
	$('#contractForm').find('input[name=approverId]').val(el.attr('id'));
	$('#contractForm').find('input[name=approver]').val(el.attr('title'));
}
//机会中，项目负责人-添加
function userPicker_addLeader_add(e, conf) {
	var userPickerElement = $('#' + conf.modalId).data('userPicker');
	var el = $('#' + conf.modalId + '_result .label');
	$('#addForm').find('input[name=leaderId]').val(el.attr('id'));
	$('#addForm').find('input[name=leader]').val(el.attr('title'));
}
//机会中，项目负责人-修改
function userPicker_addLeader_edit(e, conf) {
	var userPickerElement = $('#' + conf.modalId).data('userPicker');
	var el = $('#' + conf.modalId + '_result .label');
	$('#editForm').find('input[name=leaderId]').val(el.attr('id'));
	$('#editForm').find('input[name=leader]').val(el.attr('title'));
}
//项目中，项目负责人
function userPicker_addManager(e, conf) {
	var userPickerElement = $('#' + conf.modalId).data('userPicker');
	var el = $('#' + conf.modalId + '_result .label');
	$('#infoForm').find('input[name=managerId]').val(el.attr('id'));
	$('#infoForm').find('input[name=managerName]').val(el.attr('title'));
}
//项目中，项目助理
function userPicker_addManagerAssistant(e, conf) {
	var userPickerElement = $('#' + conf.modalId).data('userPicker');
	var el = $('#' + conf.modalId + '_result .label');
	$('#infoForm').find('input[name=managerAssistant]').val(el.attr('title'));
}


function userPicker_addMember(e, conf) {
	var el = $('#' + conf.modalId + '_result .label');
	var userArray = [];

	el.each(function(index, item) {
		userArray.push({
			id: $(item).attr('id'),
			displayName: $(item).attr('title'),
			//telephone: $(item).data('telephone')
		});
	});

	//将选中的人员，append到项目成员下面展示
	$.each(userArray, function(index, item) {
		var userId = item.id;
		if ($('#memberInfoForm #selectedMember input[name=userId][value=' + userId + ']').length > 0) {
			return true;
		}
		$('#selectedMember tbody').append('<tr>'
			+ '<td>'
				+ '<input type="hidden" name="userId" value="' + userId + '">'
				+ '<input type="text" class="form-control" name="userName" value="' + item.displayName + '" readonly>'
			+ '</td>'
			//+ '<td><input type="text" class="form-control" name="telephone" value="' + (item.telephone !=null ? item.telephone : '' ) + '" readonly ></td>'
			+ '<td><input type="checkbox" onclick="updateLeader(this)" name="leader" value="' + userId + '"></td>'
			+ '<td><input type="button" onclick="delMember(this)" class="btn btn-default" value="删除"></td>'
			+ '</tr>');
	});
	//将成员遍历到计划中选成员select下option中
	setOptions();
}


$(function() {
	new UserPicker().init();
});
