	function lionclick(pid,sid,content){

		//alert(cid);
				var uid=$api.getStorage('userid');
				if(uid){
					//var _li=$api.byId('li_'+cid);
					//_li.parentNode.removeChild(_li);
					$api.setStorage('content',content);
					api.openWin({
	                    name: 'frm_plus',
	                    url: 'frm_plus.html',
	                    pageParam:{pid:pid,sid:sid}
                    });
				}else{
					
				}

	}
	
    function loadPlus(){

		var uid=$api.getStorage('userid');
		var _uid="";
		if(uid){
			_uid=uid;
			}else{
			_uid='0';
			}
			
	    var getContentUrl = '/tblUserPlus?filter=';
	    var urlParam = {
			'limit':6,
	        where:{user:_uid},
	       	fields:['content','cid','sid','id']
	    };
	    ajaxRequest(getContentUrl + JSON.stringify(urlParam), 'GET', '', function (ret, err) {
	        if (ret) {
	        	//设置已加载贴纸sid列表
	        	var _pluslist=new Array();
				for(var i=0,j=ret.length;i<j;i++){
					if (ret[i].sid>0){
						_pluslist.push(ret[i].sid);
					}
				}
				$api.setStorage('pluslist',JSON.stringify(_pluslist));
	            var content = $api.byId('wrap');
	            var tpl = $api.byId('content-template').text;
	            var tempFn = doT.template(tpl);
	            content.innerHTML = tempFn(ret);

	        } else {
	            api.toast({msg: err.msg, location: 'middle'});
	        }
	
	    })


    }
    
   	apiready=function(){
		loadPlus();
	}