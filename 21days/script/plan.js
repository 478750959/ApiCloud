
	function setPlan(val){
		 $api.byId("_plan").value=val
	}
	
	function getPlan() {
	    var getContentUrl = '/tblHot?filter=';
	    var urlParam = {
	        fields:['plan'],
	        where:{}
	    };
	    ajaxRequest(getContentUrl + JSON.stringify(urlParam) , 'GET', '', function (ret, err) {
	        if (ret) {
	
	            var content = $api.byId('planlist');
	            var tpl = $api.byId('content-template').text;
	            var tempFn = doT.template(tpl);
	            content.innerHTML = tempFn(ret);
	
	        } else {
	            api.toast({msg: err.msg, location: 'middle'});
	        }
	
	    })
	}
	
	function ensure(){
		var tmp= $api.byId('_plan').value;
		if(tmp==""){
			alert('请输入21天计划');
		}else
		{
			var uid=$api.getStorage('userid');
			var _planCnt=parseInt($api.getStorage('planCnt'))+1;
			var _doneCnt=parseInt($api.getStorage('doneCnt'));
			if(api.pageParam.done){
				_doneCnt=_doneCnt+1;
				//加载log成功记录
				
					var pUrl='/tblLog';
				    bParam={
				    	user:uid,
				    	plan:$api.getStorage('plan'),
				    	status:'完成',
				    	date:Date.now()	
				    }	
				    //TODO:错误处理
				    ajaxRequest(pUrl, 'post', JSON.stringify(bParam), function (ret, err){});
		
				
			}
			putUrl='/user/'+uid;
			bodyParam={
				plan:tmp,
				planning:true,
				planCnt:_planCnt,
				doneCnt:_doneCnt,
				plandate:Date.now()	
			};
	        //TODO:错误处理
            ajaxRequest(putUrl,'PUT',JSON.stringify(bodyParam),function(ret,err){
            	if (ret){
            		api.toast({msg: '创建计划成功!', location: 'middle'});
            		            $api.setStorage('plan', tmp);
		            $api.setStorage('planCnt', _planCnt);
		            //异步编程
					//添加到日志文件
				    var postUrl='/tblLog';
				    bodyParam={
				    	user:uid,
				    	plan:tmp,
				    	status:'开始',
				    	date:Date.now()	
				    }	
				    //TODO:错误处理
				    ajaxRequest(postUrl, 'post', JSON.stringify(bodyParam), function (ret, err){});
		
		        	api.execScript({
						name:'root',
		        		script:'showPlan()',
		        	});
     
		            setTimeout(function () {
		
		                api.closeWin();
		            }, 100);
		    	}else{
		    		api.toast({msg: err.msg, location: 'middle'});
		    	}
            
            });
		}
	}
	
	
	apiready=function(){
	    var header = $api.byId('header');
    	$api.fixIos7Bar(header);
		getPlan()

	}