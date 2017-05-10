function openWin(name,url,pageParam){
	var systemType = api. systemType;
	
	if(name && url){
        if(systemType=="ios"){
        	var animationType=["none","fade","flip","ripple","suck","cube"];
        	var num=rd(0,4);
	        api.openWin({
	            name: name,
	            url: url,
	            pageParam:pageParam,
	            bounces:true,
	            vScrollBarEnabled:false,
	            hScrollBarEnabled:false,
	            animation:{
	            	type:"push",    //动画类型（详见动画类型常量）
				    subType:"from_right",       //动画子类型（详见动画子类型常量）
				    duration:300,                //动画过渡时间，默认300毫秒
	            },
	            showProgress:true
	        });
        }
        else{
	        api.openWin({
	            name: name,
	            url: url,
	            pageParam:pageParam,
	            bounces:true,
	            vScrollBarEnabled:false,
	            hScrollBarEnabled:false,
	            animation:{
	            	type:"push",                //动画类型（详见动画类型常量）
				    subType:"from_right",       //动画子类型（详见动画子类型常量）
				    duration:300,                //动画过渡时间，默认300毫秒
	            },
	            showProgress:true
	        });
        }
    }
    
    api.closeSlidPane();
}

//获取n到m随机整数
function rd(n,m){
    var c = m-n+1;  
    return Math.floor(Math.random() * c + n);
}


function openFrame(name,url,pageParam){
	var header = $api.byId('header');
	$api.fixIos7Bar(header);
	var headerPos = $api.offset(header);
	
	api.openFrame({
        name: name,
        url: url,
        pageParam:pageParam,
        bounces:false,
        vScrollBarEnabled:false,
        hScrollBarEnabled:false,
        rect:{
            x:0,
            y:headerPos.h,
            w:'auto',
            h:'auto'
        }
    });
}


function openSearchBar(){
	var searchBar = api.require('searchBar');
	searchBar.open({
		placeholder:"请输入菜谱关键词进行搜索",
		bgImg:"widget://res/searchBar_bg.png"
	},function(ret,err){
	    if(ret.isRecord){
	    api.toast({
		    msg: "暂未上线",
		    duration:2000,
		    location: 'bottom'
		});
	        //录音功能
//	        var obj = api.require('speechRecognizer');
//			obj.record({
//			},function(ret,err){
//			    if(ret.status){
//				    searchBar.setText({
//					     text:ret.wordStr
//					 });
//			    }else{
////			        api.toast({
////					    msg: err.msg,
////					    duration:2000,
////					    location: 'bottom'
////					});
//			    }
//			});
	    }else{
	        var pageParam = {key:ret.text};
	        
	        openWin("searchlist","./html/searchlist.html",pageParam);
	    }
	});
}

