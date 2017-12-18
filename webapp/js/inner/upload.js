var oneupload_fileElementId = 'File';//文件上传域的ID

var oneupload_url = '../../projectmanage/api/file/fileupload';//用于文件上传的服务器端请求地址
var download_href = '../../projectmanage/api/file/download'; //下载href
var delete_url = '../../projectmanage/api/file/deleteFile';//删除的url 需要文件path参数

/**
 * 单文件上传
 * @param id 业务id
 * @param name 业务name
 * @param file_id 上传文件的id
 * @param file_text 上传回显时候的div id
 * @returns
 */
function oneupload(id, name ,file_id ,file_text) {
	var files = [];
	files[0] = file_id;
	if(id==''||id==undefined||id=='undefined'){
		id = null;
	}
	if(name==''||name==undefined||name=='undefined'){
		name = null;
	}
	if(file_id==null||file_id==undefined||file_id=='undefined'){
		file_id=oneupload_fileElementId;
		files[0]=oneupload_fileElementId;
	}
	$.ajaxFileUpload({
		url: oneupload_url,
		type: 'post',
		data:{
			businessId : id,
			businessName : name
        },
		secureuri: false, //是否需要安全协议，一般设置为false
		fileElementId: files, //文件上传域的ID
		dataType: 'json', //返回值类型 一般设置为json
		success: function (data, status){
			if(data.code == "200"){
				$.each(data.data,function(i,item){
					addFileInput(item,file_text);
				})
				changeButton(id, name ,file_id ,file_text ,'点击上传文件');
			}else{
				changeButton(id, name ,file_id ,file_text ,'上传失败！！请重新上传');
			}
		},
		error: function (data, status, e){//服务器响应失败处理函数
			changeButton(id, name ,file_id ,file_text ,'上传失败！！请重新上传');
			console.info(data, status, e);
		}
	})
	changeButton(id, name ,file_id ,file_text ,'上传中');
}

/**
 * 上传时候更换按钮
 * @param id 业务id
 * @param name 业务name
 * @param file_id 上传文件的id
 * @param file_text 上传回显时候的div id
 * @param text 按钮上面提示
 * 之前是通过class获取，所有按钮会更换，现在通过id获取具体的按钮然后替换父元素
 */
function changeButton(id, name ,file_id ,file_text ,text){
	var add ='';
	add+='<a href="javascript:;" class="a-upload">';
	add+='<input id="'+file_id+'" type="file" name="file" multiple onchange ="oneupload('+id+', \''+name+'\' ,\''+file_id+'\',\''+file_text+'\')"/>';
	add+=text+'</a>';
	$('#' + file_id).parent().replaceWith(add);
}

/**
 * 添加上传成功的展示列表
 * @param data projdoc实体
 * @param file_text 上传回显时候的div id
 * @returns
 */
function addFileInput(data ,file_text){
	if(file_text==null||file_text==undefined||file_text=='undefined'){
		file_text = 'FileText';
	}
	var add = new Array();
	add.push('<div id="file'+data.id+'" style="width: 100%;text-align: left;">');
	add.push('<a style="text-decoration: none;margin-left: 10%;" href="'+download_href+'?path='+data.path+'&name='+encodeURI(data.fileName)+'">'+data.fileName+'</a>');
	add.push('<input type="hidden" name="docid[]" value="'+data.id+'">');
	add.push('<a class="deleteedittenderFile" style="float: right;margin-right: 10%;" href="javascript:deleteFile(\''+data.path+'\',\''+data.id+'\');">删除</a>');
	add.push('<hr style=" width: 80%;height: 1px;margin: auto;"/>');
	add.push('</div>');
	$('#'+file_text).append(add.join(''));
}
/**
 * 
 * @param path 删除的path
 * @param id projdoc的id
 * @returns
 */
function deleteFile(path,id){
	$.post(delete_url,{ path:path,id:id },function(data){
		if(data.status == "success"){
			$('#file'+id).remove();
		}
	},"json");
}
/**
 * 根据序列化后的from 结果集进行遍历 返回数组
 * @param data
 * @returns
 */
function getfileid(data){
	var fileid = [];
	var j = 0;
	for(i=0;i<data.length;i++){
		if(data[i].name == 'docid[]'){
			fileid.push(data[i].value);
			j++;
		}
	}
	return fileid;
}
/**
 * 格式化数字
 * @param obj
 * @returns
 */
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