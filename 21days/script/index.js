//Alex
//2015-07-29
//简洁精致的界面
var _loaded=false;
function gotoPlan(){
	//设置进入用户界面
	
		//设置进入用户界面
        //用户如果是登录状态
        var uid=$api.getStorage('userid');
		if(uid){
			api.openWin({
			    name: 'frm_plan',
			    url: './html/frm_plan.html',
			    pageParam:{done:false}
		    });
		}else{
	      		api.openWin({
	                  name: 'userLogin',
	                  url: './html/userLogin.html'
                  });		
		}
}
//由完成状态转立志
function gotoPlan1(){
	//设置进入用户界面
	
		//设置进入用户界面
        //用户如果是登录状态
        var uid=$api.getStorage('userid');
		if(uid){
			api.openWin({
			    name: 'frm_plan',
			    url: './html/frm_plan.html',
			    pageParam:{done:true}
		    });
		}else{
	      		api.openWin({
	                  name: 'userLogin',
	                  url: './html/userLogin.html'
                  });		
		}
}

function shareWX(){
/*
var obj = api.require('screenClip');

obj.screenShot(
	{album:true,
	imgPath: api.fsDir,
	imgName:'test.png'},function(ret, err){
    if(ret.status){
    	/*
    	var wx = api.require('wx');
		wx.shareWebpage({
			appID
		    scene: 'timeline',
		    title: '分享21天APP',
		    description: '我在用21天APP，超好用的',
		    thumb: api.fsDir+'/test.png',
		    contentUrl: 'http://apicloud.com'
		}, function(ret, err){
		    if(ret.status){
		        alert('分享成功');
		    }else{
		        alert(err.code);
		    }
		});


    }
})
*/


		var wx = api.require('wx');
		wx.shareImage({
		    apiKey: 'wx922997d10ba4f552',
		    scene: 'timeline',
		    thumb: 'widget://image/wx.jpg',
		    contentUrl: 'widget://image/wx.jpg'
		}, function(ret, err){
		    if(ret.status){
		        alert('分享成功');
		    }else{
		        alert(err.code);
		    }
		});
}


function gotoUser(){
	//设置进入用户界面
    //用户如果是登录状态
        
    //Alex 2015-08-14 测试截屏功能
    
    /*
var obj = api.require('screenClip');

obj.screenShot(
	{album:true,
	imgPath: api.fsDir,
	imgName:'test.png'},function(ret, err){
    if(ret.status){
        $api.byId('uimg').src=api.fsDir+'/test.png';
    }else{
        api.alert({msg:err.code});
    }
})
*/
        var uid=$api.getStorage('userid');
		if(uid){
			api.openWin({
		    name: 'frm_userCenter',
		    url: './html/frm_usercenter.html'
	    	});	
		}
	else{
	      		api.openWin({
	                  name: 'userLogin',
	                  url: './html/userLogin.html'
                  });
	      	}
	      	
	      	
}

function refreshUser(imgsrc){
	var userimg=$api.byId('userimg');
    userimg.innerHTML="<a href='javascript:gotoUser();'><img src='" +imgsrc +"'/></a>'";

}

function showPlan(){
	var $plan=$api.getStorage('plan');
	var $footer = $api.byId('footer');
	$footer.innerHTML="<div class='left'><span>坚持"+$plan +",Day 1</span></div><div id='divwx' class='right'><a href='javascript:shareWX();'><img src='image/wx.jpg'/></a></div>"

}

function showNoPlan(){

	var $footer = $api.byId('footer');
	$footer.innerHTML="<div class='left'><a href='javascript:gotoPlan();'><span>您现在是未登录状态</span></a></div>"
}


function showNoPlan1(){

	var $footer = $api.byId('footer');
	$footer.innerHTML="<div class='left'><a href='javascript:gotoPlan();'><span>现在就去设定21天计划吧>></span></a></div>"
}

function disablePlus(){
	var $plus=$api.byId('plus');
		$api.html($plus,"<a href='#'><img src='image/plus1.jpg'/></a>");
}

function loadHome(){
	//加载用户图像，加载用户计划状态，加载frm_home
		
		var uid=$api.getStorage('userid');
		var getUrl='/user?filter=';
	    var urlParam = {
			fields:['plan','username','planCnt','doneCnt','cancelCnt','planning','plandate','img'],
	        where:{id:uid}
	    };
	    ajaxRequest(getUrl + JSON.stringify(urlParam) , 'GET', '', function (ret, err) {
	        if (ret) {
	        	$api.setStorage('username',ret[0].username);
	        	$api.setStorage('planCnt',ret[0].planCnt);
	        	$api.setStorage('doneCnt',ret[0].doneCnt);
	        	$api.setStorage('cancelCnt',ret[0].cancelCnt);
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
			
	            var content = $api.byId('footer');
	            var tpl = $api.byId('content-template').text;
	            var tempFn = doT.template(tpl);
	            content.innerHTML = tempFn(ret1[0]);
           
	            $api.byId('uimg').src=ret[0].img;
	            
	            //userimg.innerHTML="<a href='javascript:gotoUser();'><img src='" +ret[0].img +"'/></a>'";
	
	        } else {
	            api.toast({msg: err.msg, location: 'middle'});
	        }
	
	    })
		if(_loaded){

			     api.execScript({
			     	
					frameName:'frm_home',
            		script:'loadPlus();',
            	});
       }else{
       		var header = $api.byId('header');
    		var pos = $api.offset(header);
       		var h=api.winHeight-pos.h-50;
		   	api.openFrame({
	           name: 'frm_home',
	           url: './html/frm_home.html',
	           rect: {
		           x:0,
		           y:pos.h,
		           w:api.winWidth,
		           h:h
	           }
	       });
       }
       _loaded=true;
       
}
    apiready = function () {
        var $header = $api.byId('header');
        $api.fixIos7Bar($header);
 
		var getUrl='/tblPlus/count?filter=';
	var urlParam={where:{}};
    ajaxRequest(getUrl + JSON.stringify(urlParam) , 'GET', '', function (ret, err) {
        if (ret) {
        	$api.setStorage('plusCnt',ret.count);
        }
        })

        //控制流程 Alex 
        //用户如果是登录状态
        var uid=$api.getStorage('userid');
		if(uid){
				loadHome();
	      	}else{
	      		showNoPlan();
	      		

				var pos = $api.offset($header);
				var h=api.winHeight-pos.h-50;
			   	api.openFrame({
		           name: 'frm_home',
		           url: './html/frm_home.html',
		           rect: {
			           x:0,
			           y:pos.h,
			           w:api.winWidth,
			           h:h
		           }
		       });  
		       _loaded=true;
	      	}
 
	}

