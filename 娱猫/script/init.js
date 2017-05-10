function init(){
//	dropTable('user');
	//用户信息表
	var sql1 = "CREATE TABLE IF NOT EXISTS user ("+
		  "`id` int PRIMARY KEY,"+
		  "`gid` int(10),"+
		  "`headimg` varchar(128),"+
		  "`nickname` varchar(64),"+
		  "`sex` tinyint(1),"+
		  "`phone` varchar(15),"+
		  "`password` varchar(128),"+
		  "`token` varchar(128),"+
		  "`expire` int(11),"+
		  "`sina_uid` varchar(32),"+
		  "`sina_btime` int(10),"+
		  "`wx_openid` varchar(128),"+
		  "`wx_btime` int(11),"+
		  "`start_num` int(10),"+
		  "`last_time` int(10),"+
		  "`lastip` int(11),"+
		  "`last_api` tinyint(1),"+
		  "`status` smallint(1),"+
		  "`reg_date` int(11),"+
		  "`type` tinyint(1),"+
		  "`alias` varchar(128)"+		  		  
	")";
	//初始化用户表
//		execute(sql1,function(ret){
////			if(!ret.status){
////				api.toast({
////		            msg:ret.msg
////	            });
////	             return false;
////			}
////			api.alert({msg:'用户信息表初始成功'});
//		});
	//新浪用户信息表
	var sql2="CREATE TABLE IF NOT EXISTS `sinaif` ("+
			  "`sina_uid` varchar(16) PRIMARY KEY,"+
			  "`sina_token` varchar(256),"+
			  "`sina_nick` varchar(64),"+
			  "`location` varchar(64),"+
			  "`avatar_large` varchar(128),"+
			  "`profile_image_url` varchar(128),"+
			  "`uptime` int(11),"+
			  "`sina_expire` int(11)"+
			")";
	//初始化新浪信息表
//		execute(sql2,function(ret){
////			if(!ret.status){
////				api.toast({
////		            msg:ret.msg
////	            });
////	            return false;
////			}
////			 api.alert({msg:'新浪用户信息表初始成功'});
//		});
	//微信用户信息表
	var sql3="CREATE TABLE IF NOT EXISTS `wxif` ("+
			  "`openid` varchar(100) PRIMARY KEY,"+
			  "`token` varchar(256),"+
			  "`nickname` varchar(100),"+
			  "`sex` tinyint(1),"+
			  "`city` varchar(32),"+
			  "`province` varchar(32),"+
			  "`country` varchar(32),"+
			  "`headimgurl` varchar(500),"+
			  "`uptime` int(11),"+
			  "`wx_expire` int(11)"+			 
			")";
	//初始化微信用户表
//		execute(sql3,function(ret){	
////			if(!ret.status){
////				api.toast({
////		            msg:ret.msg
////	            });
////	            return false;
////			}
////			api.alert({msg:'微信用户信息表初始成功'});
//		});			
}
function push(){
		var ajpush = api.require('ajpush');

ajpush.init(function(ret) {
    if (ret && ret.status){
    }
});
ajpush.setListener(
    function(ret) {
         var id = ret.id;
         var title = ret.title;
         var content = ret.content;
         var extra = ret.extra;
    }
);
var baiduLocation = api.require('baiduLocation');
	baiduLocation.startLocation({
	    accuracy: '100m',
	    filter:1,
	    autoStop: true,
	}, function(ret, err){
		var map = api.require('baiduMap');
	    map.getNameFromLocation({
    	lon:ret.longitude,
    	lat:ret.latitude
		},function(ret,err){
	    if (ret.status){        
	        var arr=[];
	        arr[0]=ret.province;
	        arr[1]=ret.city;	       
	    var param = {alias:api.deviceId,tags:arr};	   
//	    $api.setStorage('push',param);	    
		ajpush.bindAliasAndTags(param,function(ret) {			
		        var statusCode = ret.statusCode;
		});
    } 
	});	    	        
});
//在iOS平台，当应用在后台时，使用极光推送发送通知时（消息只有应用在前台才能收到），系统会往设备发送通知。
//当通知被点击后，若应用已启动，则通过上面的setListener回调给开发者；若应用未启动，APICloud会将本次推送的内容通过事件监听回调的方式交给开发者。具体使用如下：
api.addEventListener({name:'noticeclicked'}, function(ret,err) {
    if(ret && ret.value){
//  	api.alert({msg:ret});
        var ajpush = ret.value;
        var content = ajpush.content;
        var extra = ajpush.extra;
    }
})
//在Android平台，使用极光推送发送通知、消息等类型推送时，极光推送模块会往设备状态栏上发送通知，当通知被点击后，APICloud会将本次推送的内容通过事件监听回调的方式交给开发者。具体使用如下：
api.addEventListener({name:'appintent'}, function(ret,err) {
    if(ret && ret.appParam.ajpush){
//  	api.alert({msg:ret});
        var ajpush = ret.appParam.ajpush;
        var id = ajpush.id;
        var title = ajpush.title;
        var content = ajpush.content;
        var extra = ajpush.extra;
    }
}) 
	
}