/*******************************************************
 * DESC:系统公共常量。
 * @author solotiger
 * @since	2014-12-18
 *******************************************************/

var RESULT_CODE_SUCCESS = 100;
var RESULT_CODE_FAILED = 200;

var HOST_URL = 'http://hicnjsp.gnjsp.xzbiz.cn/ETongServer/client/';

//测试

var USER_URL = HOST_URL + "clientUserCtl.action";


var MORE_URL = HOST_URL + "clientMoreCtl.action";


var DEP_URL = HOST_URL + "clientDepCtl.action";

var ORDER_URL = HOST_URL + "clientOrderCtl.action";

var HEALTH_URL = HOST_URL + "clientHealthCtl.action";

var IMAGE_URL = "http://hicnjsp.gnjsp.xzbiz.cn/ETongServer/uploadfile/";

/**
 * 确认登录
 */
function CHECK_LOGIN() {
	if (!$api.getStorage('user')) {
		api.openWin({
			name : 'login',
			url : 'framework.html',
			pageParam : {
				'index' : 0,
				'depName' : '登录',
				'type' : 'login'
			},
		});
		return false;
	}else{
		var user = $api.getStorage('user');
		if(user.realName && user.realName != ''){
			return true;
		}else{
			api.openWin({
				name : 'addinfo',
				url : 'framework.html',
				pageParam : {
					'index' : 0,
					'depName' : '完善信息',
					'type' : 'addinfo'
				},
			});
			return false;
		}
	}
	return true;
}

/**
 * 表单数据转成JSON
 * @param {Object} form
 */
function FROM_TO_JSON(formid) {
	var values = {};
	$("#" + formid).find('input[type=text],input[type=hidden],input[type=password]').each(function(index) {
		values[$(this).attr('id')] = $(this).val();
	});
	return values;
}

/**
 * 表单数据转成JSON
 * @param {Object} form
 */
function FROM_NOT_NULL(formid) {
	var ret = true;
	$("#" + formid).find('input[type=text],input[type=password]').each(function(index) {
		if($(this).attr('nonull')){
			if($api.trimAll($(this).val()) == ''){
				api.alert({
					msg : $(this).attr('nonull')
				});
				ret = false;
				return false;
			}
		}
	});
	
	return ret;
}