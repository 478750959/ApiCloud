function Base64() {

	// private property
	_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	// public method for encoding
	this.encode = function(input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = _utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	}
	// public method for decoding
	this.decode = function(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = _keyStr.indexOf(input.charAt(i++));
			enc2 = _keyStr.indexOf(input.charAt(i++));
			enc3 = _keyStr.indexOf(input.charAt(i++));
			enc4 = _keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = _utf8_decode(output);
		return output;
	}
	// private method for UTF-8 encoding
	_utf8_encode = function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}
		return utftext;
	}
	// private method for UTF-8 decoding
	_utf8_decode = function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while (i < utftext.length) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}

//SHA1加密算法
function SHA1(msg) {
	function rotate_left(n, s) {
		var t4 = (n << s ) | (n >>> (32 - s));
		return t4;
	};

	function lsb_hex(val) {
		var str = "";
		var i;
		var vh;
		var vl;

		for ( i = 0; i <= 6; i += 2) {
			vh = (val >>> (i * 4 + 4)) & 0x0f;
			vl = (val >>> (i * 4)) & 0x0f;
			str += vh.toString(16) + vl.toString(16);
		}
		return str;
	};

	function cvt_hex(val) {
		var str = "";
		var i;
		var v;

		for ( i = 7; i >= 0; i--) {
			v = (val >>> (i * 4)) & 0x0f;
			str += v.toString(16);
		}
		return str;
	};

	function Utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	};

	var blockstart;
	var i, j;
	var W = new Array(80);
	var H0 = 0x67452301;
	var H1 = 0xEFCDAB89;
	var H2 = 0x98BADCFE;
	var H3 = 0x10325476;
	var H4 = 0xC3D2E1F0;
	var A, B, C, D, E;
	var temp;

	msg = Utf8Encode(msg);

	var msg_len = msg.length;

	var word_array = new Array();
	for ( i = 0; i < msg_len - 3; i += 4) {
		j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
		word_array.push(j);
	}

	switch (msg_len % 4) {
		case 0:
			i = 0x080000000;
			break;
		case 1:
			i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
			break;

		case 2:
			i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
			break;

		case 3:
			i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
			break;
	}

	word_array.push(i);

	while ((word_array.length % 16) != 14)
	word_array.push(0);

	word_array.push(msg_len >>> 29);
	word_array.push((msg_len << 3) & 0x0ffffffff);

	for ( blockstart = 0; blockstart < word_array.length; blockstart += 16) {

		for ( i = 0; i < 16; i++)
			W[i] = word_array[blockstart + i];
		for ( i = 16; i <= 79; i++)
			W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

		A = H0;
		B = H1;
		C = H2;
		D = H3;
		E = H4;

		for ( i = 0; i <= 19; i++) {
			temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for ( i = 20; i <= 39; i++) {
			temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for ( i = 40; i <= 59; i++) {
			temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for ( i = 60; i <= 79; i++) {
			temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		H0 = (H0 + A) & 0x0ffffffff;
		H1 = (H1 + B) & 0x0ffffffff;
		H2 = (H2 + C) & 0x0ffffffff;
		H3 = (H3 + D) & 0x0ffffffff;
		H4 = (H4 + E) & 0x0ffffffff;

	}

	var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

	return temp.toLowerCase();
}

//常量配置
//var common_url = 'http://app151.vliang.com';    //vming请求专用地址
var common_url = 'http://app185.vliang.com';
//vming请求专用地址
function getstor(key) {
	var val = get_loc_val('mine', key);
	if (val) {
		return val;
	} else {
		return false;
	}
}

//SESSION控制
//获取session ID 每次请求 传回
function getsid() {
	return true;
	//	$api.clearStorage ()
	var sid = $api.getStorage('sid');
	if (sid == null || sid == 'undefined' || sid == undefined) {
		var appId = 'VMING';
		var key = 'HAOHAOXUEXI1510';
		var now = Date.now();
		var appKey = SHA1(appId + "VMING" + key + "VMING" + now) + "." + now;
		var headers = {
			'X-Requested-With' : 'XMLHttpRequest',
			'X-Token-With' : appKey,
			'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
		};
		api.ajax({
			url : common_url + '/api/getsid',
			method : 'post',
			cache : false,
			headers : headers
		}, function(ret, err) {
			$api.setStorage('sid', ret.info.sid);
			sid = ret.info.sid;
		});
	}
	return sid;
}

//ajax重写
function ajaxRequest(url, method, bodyParam, callBack) {
	if (!getsid()) {
		getsid();
	}
	bodyParam.is_new=1;
//	api.addEventListener({
//	    name:'offline'
//  },function(ret,err){
//  	api.toast({
//		    msg:'网络已断开,请检查您的网络配置'
//	    });
//	    return false;
//  });
	//	var push=$api.getStorage('push');
	//	api.alert({msg:bodyParam});
	//	api.alert({msg:push});
	var appId = 'VMING';
	var key = 'HAOHAOXUEXI1510';
	var now = Date.now();
	var appKey = SHA1(appId + "VMING" + key + "VMING" + now) + "." + now;
	var headers = {
		'X-Requested-With' : 'XMLHttpRequest',
		'X-Token-With' : appKey,
		'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
	};
	api.ajax({
		//		url : common_url + '/' + url+'?sid='+ $api.getStorage('sid'),
		url : common_url + '/' + url,
		method : method,
		cache : false,
		timeout: 120,
		headers : headers,
		data : {
			values : bodyParam
		}
	}, function(ret, err) {
		api.hideProgress();
		callBack(ret, err);
	});
}

//upload
function upload(img, bodyParam, callBack) {
	upload_img('user/upload_headimg',img,bodyParam,callBack);
}
//upload
function upload_img(url, img, bodyParam, callBack) {
	if (!getsid()) {
		getsid();
	}
	var appId = 'VMING';
	var key = 'HAOHAOXUEXI1510';
	var now = Date.now();
	var appKey = SHA1(appId + "VMING" + key + "VMING" + now) + "." + now;
	var headers = {
		'X-Requested-With' : 'XMLHttpRequest',
		'X-Token-With' : appKey
	};
	api.ajax({
		url : common_url + '/' + url,
		method : 'post',
		headers : headers,
		data : {
			values : bodyParam,
			files : img
		}
	}, function(ret, err) {
		api.hideProgress();
		if (err) {
			api.toast({
				msg : err.msg
			});
			return false;
		}
		callBack(ret, err);
	});
}
//判断是否登录
function is_login(param) {
	var last_api = getstor('last_api');	
	if (!last_api) {
		return false;
	} else {	
		last_api='1';
		var now = Date.now();
		switch(last_api) {
			case '1':
				//普通手机登录
				var token = getstor('token'), expire = getstor('expire');
				if (!token || !expire) {
					return false;
				}
				//计算时间，判断是否过期
				if (now / 1000 > expire - 120) {
					//alert('com_expire');
					if (param == 'mine') {
						return false;
					}//过期
					return {
						'token' : token,
						'last_api' : last_api
					};
					//过期
				} else {
					var token = SHA1('not_expire' + '-' + now) + '.' + now + '.' + getstor('id');
					var b = new Base64();
					var str = b.encode(token);
					return {
						'token' : str,
						'last_api' : last_api
					};
					//没有过期
				}
				break;
			case '2':
				//微信登录
				var wx_openid = getstor('wx_openid');
				if (!wx_openid) {
					api.toast({
						msg : '授权异常！'
					});
					return false;
				}
				var wx_token = get_loc_val('wx', 'token');
				var wx_expire = get_loc_val('wx', 'wx_expire');
				if (isEmpty(wx_token) || isEmpty(wx_expire)) {
					return false;
				}
				var obj = {
					'wx_openid' : wx_openid,
					'wx_token' : wx_token,
					'last_api' : last_api
				};
				//计算时间，判断是否过期
				if (now / 1000 > wx_expire - 120) {//刷新token
					if (param == 'mine') {
						return false;
					}//过期
					return obj;
				} else {
					return obj;
				}
				break;

			case '3':
				//新浪登录
				var sina_uid = getstor('sina_uid');
				if (!sina_uid) {
					api.toast({
						msg : '授权异常！'
					});
					return false;
				}
				var sina_token = get_loc_val('sina', 'sina_token');
				var sina_expire = get_loc_val('sina', 'sina_expire');
				if (isEmpty(sina_token) || isEmpty(sina_expire)) {
					return false;
				}
				var obj = {
					'sina_uid' : sina_uid,
					'sina_token' : sina_token,
					'last_api' : last_api
				};
				if (now / 1000 > sina_expire - 120) {//刷新token
					if (param == 'mine') {
						return false;
					}//过期
					return obj;
				} else {
					return obj;
				}
				break;
			default:
				return false;
				break;
		}
	}
}

//时间戳转成对应日期时间，格式为：2009-03-23
function timetoDate(tm) {
	var date = new Date(parseInt(tm) * 1000);
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (month < 10)
		month = "0" + month;
	if (day < 10)
		day = "0" + day;

	return date.getFullYear() + "-" + month + "-" + day;
}

//时间戳转日期
function formatDate(now) {
	var date = new Date(now);
	Y = date.getFullYear();
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
	D = date.getDate();
	h = date.getHours();
	m = date.getMinutes();
	s = date.getSeconds();
	return Y + M + D;
}

//对应图片缓存
function imgStor(url) {
	var url = url;
	api.imageCache({
		url : url
	}, function(ret, err) {
		//			alert("AA");
		if (ret) {
			var path = ret.url;
			$api.setStorage("img", {
				"url" : url,
				"thumb" : path
			});
		}
	});
}			       
//判断是否为空
function isEmpty(data) {
	if (isEmpty1(data) || isEmpty2(data)) {
		return true;
	}
	return false;
}

function isEmpty1(data) {
	if (data == undefined || data == null || data == "" || data=='NULL' || data==false || data=='false') {
		return true;
	}
	return false;
}

function isEmpty2(v) {
	switch (typeof v) {
		case 'undefined' :
			return true;
		case 'string' :
			if ($api.trim(v).length == 0)
				return true;
			break;
		case 'boolean' :
			if (!v)
				return true;
			break;
		case 'number' :
			if (0 === v)
				return true;
			break;
		case 'object' :
			if (null === v)
				return true;
			if (undefined !== v.length && v.length == 0)
				return true;
			for (var k in v) {
				return false;
			}
			return true;
			break;
	}
	return false;
}

//open tab
//跳转到登录页面
function to_login() {
	
	$api.rmStorage('mine');
	$api.rmStorage('sina');
	$api.rmStorage('wx');
	$api.rmStorage('addr');
	$api.rmStorage('c_c');
	$api.setStorage("yxoutlogin", 2);
//	从
	
	api.openWin({
		name : 'login_head_w',
		url : 'login_head_w.html',
		opaque : true,
		reload : true,
		vScrollBarEnabled : false
	});
	
}

function get_loc_val(key, index) {
	var val = $api.getStorage(key);
	if (isEmpty(val)) {
		return false;
	}
	if (isEmpty(val[index])) {
		return false;
	}
	return val[index];
}

function open_alert(title, content, m,src) {
	var width = api.winWidth;
	var height = api.winHeight;
	api.openFrame({
		name : 'mask_f',
		url : 'mask_f.html',
		bounces : false,
		opaque : true,
		reload : true,
		vScrollBarEnabled : false,
		pageParam : {
			headerHeight : 0,
			title : title,
			content : content,
			m : m,
			src:src,
		},
		rect : {
			x : 0,
			y : 0,
			w : width,
			h : height
		}
	});
}
function app_installed(appBundle,callback){
	api.appInstalled({
		    appBundle: appBundle
		},function(ret,err){
		    if (ret.installed) {
				callback(true);	
		    } else {
				callback(false);
		    }
		});	
}