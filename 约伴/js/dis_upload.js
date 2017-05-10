/*Creat at 2012-08-02 for discuz v3.0 by JetCheung*/

/*上传图片*/
var ulopid = 2000;
var ulObj = null;
var disUpload = function(ulUrl, type, actCb, susCb){
	this.url = ulUrl;
	this.type = type;
	this.actCb = actCb;
	this.susCb = susCb;
	ulObj = this;
	return this;
}

disUpload.prototype = {
	upSelect:function(cmd){
		var self = this;
		uexWindow.cbActionSheet = function(opId, dataType, data){
			var cmd = Int(data);
			if(cmd<2) self.upMethod(cmd);
		}
		
		var value = ["拍照上传","本地上传"];
		uexWindow.actionSheet('严禁色情暴力图片，欢迎举报', '取消', value);
	},
/**
 * 外部调用接口，cmd：拍照或图片
 */
upMethod:function(cmd){
		var self = this;
		if(cmd==1){
			uexImageBrowser.cbPick = function(opCode, dataType, data) {
                //console.log('cbopen:' + data);
                self.uploadImg(data);
			};
			uexImageBrowser.pick();
		}
		else{
			uexCamera.cbOpen = function(opCode, dataType, data) {
                //console.log('cbopen:' + data);
				self.uploadImg(data);
			};
			uexCamera.open();
		}
	},
	uploadImg:function(src){
        if(!src) return;
		var self = this;
		var opid = ulopid + '';
		self.src = src;
		if(self.actCb) self.actCb(false);
		uexWindow.toast('1', '5', '正在上传...', "1");//最后的“1”保持进度显示
		uexUploaderMgr.cbCreateUploader = cbCreateUploader;
		uexUploaderMgr.createUploader(opid, self.url);
		ulopid++;
	}
}

function cbCreateUploader(opCode, dataType, data) {
	var self = ulObj;
	if (Int(data) == 0) {
		var flag = 'attach';
		if (self.type=='thread' || self.type=='reply' || self.type=='avatar') flag = 'Filedata';
		uexUploaderMgr.onStatus = onUploadStatus;
		
		var inCompress = '2';
		var icp = getstorage('picupcompr');
		if(icp) inCompress=icp;
		logs('cbCreateUploader()-->inCompress1='+inCompress);
		uexUploaderMgr.uploadFile(opCode, self.src, flag, inCompress);
	} else {
		uexWindow.toast('0', '5', "上传失败", 2000);
		if(self.actCb) self.actCb(true);
		uexUploaderMgr.closeUploader(opCode);
	}
}

function onUploadStatus(opCode, fileSize, percent, serverPath, status) {
	var str = '';
	var self = ulObj;
    uexWindow.closeToast();
	switch (parseInt(status)) {
	case 0:
		break;
	case 1:
		uexUploaderMgr.closeUploader(opCode);
		logs('onUploadStatus()-->serverPath='+serverPath);
		if(self.type=='thread' || self.type=='reply') {
			var arr = serverPath.split('|');
			if (arr[0] == '-3') {
				str = '请登录';
			} else if (arr[0] == '-2') {
				str = '图片太大';
			} else if (arr[0] == '-1') {
				str = '非图片格式';
			} else if (arr[0] == '0') {
				str = '上传失败';
			} else if (arr[0] == '1') {
				str = '上传成功';
				if(self.susCb) self.susCb(arr[1]);
			} else {
				str = '上传失败';
			}
		}
		else if(self.type=='avatar'){
			if(serverPath == 'Success')
			{
				str = '上传成功';
				if(self.susCb) self.susCb(self.src);
			}
			else if (serverPath == 'Failed')
			{
				str = '上传失败';//
			}
			else if (serverPath == 'Toosmall')
			{
				str = '上传图片太小 (至少200*200)';
			}
			else
			{
				str = '上传失败';
				var str1 = serverPath.substr(2,serverPath.length-3);
				if(str1){
					var json = JSON.parse(str1);
					if(json) str = json.message;
				}
			}
		}
		else {
			var arr = int(serverPath);
			if (arr == -1) {
				str = '没有权限上传图片';
			} else if (arr == 0) {
				str = '上传失败';//
			} else if (arr > 0) {
				str = '上传成功';
				if(self.susCb) self.susCb(serverPath);
			} else {
				str = '上传失败';
				var str1 = serverPath.substr(2,serverPath.length-3);
				if(str1){
					var json = JSON.parse(str1);
					if(json) str = json.message;
				}
			}
		}
		if(self.actCb) self.actCb(true);
		break;
	default:
		str = '上传失败';
		uexUploaderMgr.closeUploader(opCode);
		if(self.actCb) self.actCb(true);
		break;
	}
	if(str) uexWindow.toast('0', '5', str, 2000);
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */