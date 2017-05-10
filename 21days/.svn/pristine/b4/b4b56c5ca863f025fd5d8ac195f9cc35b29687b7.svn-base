
//放弃正在进行的计划
//算法：将planing置为False，清空plan,plandate,写入tblLog
function stop(){

	//修改用户表
	var uid=$api.getStorage('userid');
	var _plan=$api.getStorage('plan');
	var _cancelCnt=0;
	_cancelCnt=parseInt($api.getStorage('cancelCnt'))+1;
	
	
	//添加到日志文件
    var postUrl='/tblLog';
    var bodyParam={
    	user:uid,
    	plan:_plan,
    	status:'放弃',
    	date:Date.now()	
    }	
    //TODO:错误处理
    ajaxRequest(postUrl, 'post', JSON.stringify(bodyParam), function (ret, err){});
	
	var putUserUrl = '/user/'+uid;
	var _urlParam = {
		planning:false,
		cancelCnt:_cancelCnt,
		plan:''
	};
	ajaxRequest(putUserUrl, 'put', JSON.stringify(_urlParam), function (ret, err) {
		if(err){
			alert(err.msg);
			}else{
				$api.setStorage('cancelCnt',_cancelCnt);
			}
		    })	
	
					//关闭用户界面，引导用户到主页开始新计划页
  	api.execScript({
			name:'root',
    		script:'showNoPlan1()',
    	});
 
    setTimeout(function () {
        api.closeWin();
    }, 100);
}


function close(){
			var obj = api.require('imageClip');
			//关闭功能Frame
			api.closeFrame({name: 'save'});
			api.closeFrame({name: 'close'});

			//关闭图片剪裁功能
			obj.close();
		}

		//保存剪裁图像并替换头像
		function save(){
			var obj = api.require('imageClip');
			//该方法可以可以自定义保存地址，注意看文档
			obj.save(function(ret, err){
    			if(ret){
		  		auiCompress(ret.savePath,{
		                    width:300,
		                    quantity:1,
		            // 压缩成功
		            success: function (ret) {
						
						$api.byId('img').src=ret.base64;
			 			//$("#img").attr('src',ret.base64); 
			 			//更新主页头像
			 			api.execScript({name: 'root',script: "refreshUser('"+ret.base64+"');"});
						var uid=$api.getStorage('userid');
			 			var putUserUrl = '/user/'+uid;
				    	var _urlParam = {
							img:ret.base64
				    	};
			 			ajaxRequest(putUserUrl, 'put', JSON.stringify(_urlParam), function (ret, err) {
							if(err){
								alert(err.msg);
								}
							    })
			 			
			 			
		            }
		            });
        		close();
    		}else{
        		api.alert({msg:err.msg});
    		}
			});
		}

function ensurePic(){

	//识别android系统与IOS系统
	var u = navigator.userAgent, app = navigator.appVersion;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

//test only==============================================
/*
 		api.getPicture({
                    sourceType: 'album',
                    encodingType: 'png',
                    mediaValue: 'pic',
                    destinationType: 'base64',
                    allowEdit: true,
                    quality: 10,
                    targetWidth:540,
                    targetHeight:540,
                    saveToPhotoAlbum: false
                }, function(ret, err){ 
                    if (ret) {				
						$api.byId('img').src=ret.base64Data;
						alert( ret.base64Data);
						
												$api.byId('img').src=ret.base64Data;
			 			//更新主页头像
			 			api.execScript({name: 'root',script: "refreshUser('"+ret.base64Data+"');"});
						var uid=$api.getStorage('userid');
			 			var putUserUrl = '/user/'+uid;
				    	var _urlParam = {
							img:ret.base64Data
				    	};
			 			ajaxRequest(putUserUrl, 'put', JSON.stringify(_urlParam), function (ret, err) {
							if(err){
								alert(err.msg);
								}
							    })

					}})
 			return;
 	*/		
 //==========================================================================
	if(isiOS){
 		api.getPicture({
                    sourceType: 'album',
                    encodingType: 'png',
                    mediaValue: 'pic',
                    destinationType: 'base64',
                    allowEdit: true,
                    quality: 20,
                    targetWidth:540,
                    //targetHeight:540,
                    saveToPhotoAlbum: false
                }, function(ret, err){ 
                    if (ret) {
					
						$api.byId('img').src=ret.base64Data;
			 			//更新主页头像
			 			api.execScript({name: 'root',script: "refreshUser('"+ret.base64Data+"');"});
						var uid=$api.getStorage('userid');
			 			var putUserUrl = '/user/'+uid;
				    	var _urlParam = {
							img:ret.base64Data
				    	};
			 			ajaxRequest(putUserUrl, 'put', JSON.stringify(_urlParam), function (ret, err) {
							if(err){
								alert(err.msg);
								}
							    })

                	}
                   });
        }
	if(isAndroid){
	 		api.getPicture({
                    sourceType: 'album',
                    encodingType: 'png',
                    mediaValue: 'pic',
                    destinationType: 'url',
                    allowEdit: false,
                    quality: 20,
                    targetWidth:540,
                    //targetHeight:540,
                    saveToPhotoAlbum: false
                }, function(ret, err){ 
                    if (ret) {

                    	var obj = api.require('imageClip');
                		obj.open({
                       		path : ret.data,
                        x : 0,
                        y : 0,
                        w : api.winWidth ,
                        h : api.winHeght-70,
	                        clipRect : {
	                                x : 150,
	                                y : 300,
	                                w : 100,
	                                h : 100
	                        },
                        	layerColor : 'rgba(0, 255, 0, 0.5)'
		                }, function(ret, err) {
		                	if (ret.status) {
								//功能frame控制保存和关闭功能
								api.openFrame({
									name : 'save',
									url : 'save.html',
									rect : {
										x : 20,
										y : api.winHeght-70,
										w : 60,
										h : 35
									},
									bounces : false,
									pageParam:{name:'frm_userCenter'},
									opaque : false,
									bgColor : 'rgba(0,0,0,0.0)'
								});
			
								api.openFrame({
									name : 'close',
									url : 'close.html',
									rect : {
										x : window.innerWidth-80,
										y : api.winHeght-70,
										w : 60,
										h : 35
									},
									bounces : false,
									pageParam:{name:'frm_userCenter'},
									opaque : false,
									bgColor : 'rgba(0,0,0,0.0)'
								});
							}
		                
		                });                   	

                	}
                   });
        }

	}
	
	
	function loadData(){
		var uid=$api.getStorage('userid');

		if(!uid){return;}

	    var getUserUrl = '/user?filter=';
    	var _urlParam = {
	        where: {
	            id: uid
	       		 },
	       	fields:['username','img','planCnt','doneCnt','cancelCnt','plan','planning','plandate']
    	};
	    ajaxRequest(getUserUrl + JSON.stringify(_urlParam), 'GET', '', function (ret, err) {
			if(ret){
				$api.setStorage('plan', ret[0].plan);
				$api.setStorage('cancelCnt', ret[0].cancelCnt);
				var ret1=ret;
				if(ret[0].planning){
					var now = Date.now();
						
					var plandays=Math.ceil((now-Date.parse(ret[0].plandate))/ 3600000 / 24);
					ret1[0].plandays=plandays;
					if (plandays>21){
						ret1[0].status=2;
					}else{
						ret1[0].status=1;
					}
					
				}else{
					ret1[0].status=0;
					ret1[0].plandays=0;
					ret1[0].plan='';
				}
				var content = $api.byId('user-center');
	            var tpl = $api.byId('user-template').text;
				
	            
	            var tempFn = doT.template(tpl);
	            content.innerHTML = tempFn(ret1[0]);

			    getUserUrl = '/tblLog?filter=';
		    	_urlParam = {
			        where: {
			            user: uid
			       		 }
		    	};
		    	

				
				ajaxRequest(getUserUrl + JSON.stringify(_urlParam),'GET', '', function (ret, err) {
			        if (ret) {
			        	
			        	//pathArr=ret.PicUrl;
			        	//titleArr=ret.PicTitle;
						var ret1=ret;
			        	for(var i=0,j=ret.length;i<j;i++){
							
						    //ret1[i].placeHoldImg="widget://image/info.png"; 
						    //ret1[i].img=imgs[ret[i].eventtype];
						    
						    //ret1[i].titleColor='#000';
						    //ret1[i].subTitleColor='#999'; 
						    ret1[i].date=ret[i].date.substr(0,10);
						    //ret1[i].subTitle=ret[i].content.title;
		
						}
			        	var content1 = $api.byId('user-history');
					    var tpl1 = $api.byId('msg-template').text;
					    var tempFn1 = doT.template(tpl1);
					    content1.innerHTML = tempFn1(ret1);
		

			        } else {
			            api.alert({
			                msg: err.msg
			            });
			        }
		
		    	})	
		    	

			} else {
	            api.toast({msg: err.msg, location: 'middle'})
	            //api.hideProgress();
	        }

	    })
	};

	apiready=function(){
		var userid=$api.getStorage('userid');
		if(!userid){

			api.openWin({
			    name: 'userLogin',
			    url: 'userLogin.html'
		    });
		    return;

		}
		loadData();

	}