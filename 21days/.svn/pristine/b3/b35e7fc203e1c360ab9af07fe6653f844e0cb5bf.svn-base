var inputWrap = $api.domAll('.input-wrap');
var i = 0, len = inputWrap.length;
for (i; i < len; i++) {
    var txt = $api.dom(inputWrap[i], '.txt');
    var del = $api.dom(inputWrap[i], '.del');
    (function (txt, del) {
        $api.addEvt(txt, 'focus', function () {
            if (txt.value) {
                $api.addCls(del, 'show');
            }
            $api.addCls(txt, 'light');
        });
        $api.addEvt(txt, 'blur', function () {
            $api.removeCls(del, 'show');
            $api.removeCls(txt, 'light');
        });
    })(txt, del);

}

function delWord(el) {
    var input = $api.prev(el, '.txt');
    input.value = '';
}

function ensure() {
    api.showProgress({
        title: '注册中...',
        modal: false
    });
    var uname = $api.byId('username').value;
    var pwd = $api.byId('userPwd').value;
    var pwd2 = $api.byId('userPwd2').value;
    var email=$api.byId('email').value;

		//基本验证
	    if(uname==""){
	    	api.hideProgress();
	    	alert("用户名不能为空-_-");
	    	return ;
	    }
	    
	    if (pwd==""){
	      	api.hideProgress();
	    	alert("密码不能为空-_-");
	    	
	    	return ;	    
	    }
	    
	    if(email==""){
	    	api.hideProgress();
	    	alert("邮箱不能为空-_-");
	    	return ;	    
	    }
	    if (pwd !== pwd2) {
	        api.alert({
	            msg: '两次密码不一致'
	        }, function (ret, err) {
	            //coding...
	        });
	        api.hideProgress();
	        return;
	    }
    
    	if(emailErr(email)){  
    		api.hideProgress();
    		return;}
 
 	    var getUrl='/user/count?filter=';
	    var urlParam={
	    	where:{username:uname}
	    }
   	    ajaxRequest(getUrl + JSON.stringify(urlParam) , 'GET', '', function (ret, err) {
	        if (ret.count>0) {
	        	api.hideProgress();
	        	alert("用户名已存在，请换个用户名-_-");
	        	return ;
	        }else{
		    var registerUrl = '/user';
		    var bodyParam = {
		        username: uname,
		        password: pwd2,
		        email:email,
		        planCnt:0,
		        doneCnt:0,
		        cancelCnt:0,
		        planning:false,
		        emailVerified:true,
		        plan:'',
		        img:'http://7xkg7s.com1.z0.glb.clouddn.com/apicloud/75635aa0b2ddfe0bb07c53a9bc050845.png'
		    };
		    ajaxRequest(registerUrl, 'post', JSON.stringify(bodyParam), function (ret, err) {
		        if (ret) {
					
					//初始化6条贴纸内容
					var _uid=ret.id;
					var getUrl='/tblPlus?filter=';
					var urlParam={where:{init:1}};

			   	    ajaxRequest(getUrl + JSON.stringify(urlParam) , 'GET', '', function (ret, err) {
				        if (ret) {	
				        	var postUrl='/tblUserPlus';
				        	for(var i=0,j=ret.length;i<j;i++){
					        	
					        	bodyParam={
					        		user:_uid,
					        		cid:ret[i].cid,
					        		sid:ret[i].cid,
					        		content:ret[i].content
					        	}
		    					ajaxRequest(postUrl, 'post', JSON.stringify(bodyParam), function (ret, err) {})
				        	}
				        }
				    });
					//发送邮箱验证
		        	var verifyParam={username:uname,email:email,language:'zh_CN'};
		        	var verifyUrl='/user/verifyEmail';
				     ajaxRequest(verifyUrl, 'post', JSON.stringify(verifyParam), function (ret, err) {
				          
				     });
				     
		            api.alert({
		                msg: '注册成功，登陆后就可以正常使用了！'
		            }, function () {
		                api.closeWin();
		            });
		
		        } else {
		            api.alert({
		                msg: err.msg
		            });
		        }
		
		    })
		 		}
	        })
 
}

function userErr(uname){
		

	    var getUrl='/user/count?filter=';
	    var urlParam={
	    	where:{username:uname}
	    }
   	    ajaxRequest(getUrl + JSON.stringify(urlParam) , 'GET', '', function (ret, err) {
	        if (ret.count>0) {
	        	
	        	alert("用户名已存在，请换个用户名-_-");
	        	return true;
	        	}else{return false;}
	        })
}

function emailErr(emailval) {  
    var pattern = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;  
    if (!pattern.test(emailval)) {  
        alert("请输入正确的邮箱地址。");  
        return true;  
    }  
    return false;  
}  

apiready = function () {
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
};