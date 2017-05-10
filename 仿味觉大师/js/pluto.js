
// var serverURL = "http://192.168.1.102:8080";
var serverURL = "http://10.68.1.103:8080";

var imgPath="http://7xiakq.com1.z0.glb.clouddn.com/taste";

function logs(info,toStr) {
    if(($.isPlainObject(info) || $.isArray(info)) && toStr){
        console.log(JSON.stringify(info));
    }else{
        console.log(info);
    }
    
}
function backKey2exit(noExit){
    
    if (!noExit) {
        apiready = function(){
            api.removeEventListener({
                name: 'keyback'
            });
            api.addEventListener({
                name: 'keyback'
            }, function(ret, err){                
                api.closeWidget();
            });
        }  
    }else{
        api.removeEventListener({
            name: 'keyback'
        });
        apiready = function(){
            api.addEventListener({
                name: 'keyback'
            }, function(ret, err){
                $.router.back();
            });
        }  
    }

     
    
}
function alertX(content,callback){
    api.alert({
        title: '提示',
        msg: content,
    }, function(ret, err) {
        callback();
    });
}
function extend(target, source) {
    for (var p in source) {
        if (source.hasOwnProperty(p)) {
            target[p] = source[p];
        }
    }

    return target;
};

function openWin(opt) {
    var defaultOpt = {
        name : opt.name,
        url : ""+opt.name + ".html",
        animation:{
            type:"none"
        }
    };
    opt=extend(defaultOpt,opt);
    logs(JSON.stringify(opt));
    api.openWin(opt);
}

function closeWin() {
    api.closeWin();
}

function openLoading(info) {
    $.showPreloader();
}
function hideLoading(info) {
    $.hidePreloader();
}

function closeToast() {
    
}

function Ajax(opt) {
    var defaultOpt = {
        url : "",
        type:"GET",
        data : {},
        dataType : 'html',
        timeout : 20000, //超时时间
        loading:false,
        cache:false,
        error : function(xhr, type) {
            closeToast();
            alert('Ajax error!');
        }
    };
    opt.url=serverURL+opt.url;
    opt=extend(defaultOpt, opt);
    logs("start request:"+opt.url);
    logs("request data:"+JSON.stringify(opt.data));
    if(opt.loading){
       openLoading();
    }
    if(opt.successx){
        opt.success=function(data,status){
            closeToast();
            
            logs(JSON.stringify(data));
            opt.successx(data);
        }
    }
    $.ajax(opt);
}
function Get(url,callback,dataType){
    var opt={};
    opt.url=url;
    opt.dataType="json";
    opt.success=callback;
    if(dataType)
        opt.dataType=dataType;
    Ajax(opt);
}
function GetLocal(url,callback,dataType){
    var opt={};
    opt.url=url;
    opt.dataType="json";
    opt.success=callback;
    if(dataType)
        opt.dataType=dataType;
    $.ajax(opt);
}
function Post(url,data,callback,dataType){
    var opt={};
    opt.url=url;
    opt.dataType="json";
    opt.type="POST";
    opt.data=data;
    opt.success=callback;
    if(dataType)
        opt.dataType=dataType;
    Ajax(opt);
}
function getRequest() {   
    var url = location.search;
    var theRequest = new Object();   
    if (url.indexOf("?") != -1) {   
       var str = url.substr(url.indexOf("?")+1); 
       strs = str.split("&");   
       for(var i = 0; i < strs.length; i ++) {   
          theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
       }   
    }   
    return theRequest;   
} 
function abs2full(arr,field,prePath){
    for(var i=0,len=arr.length;i<len;i++){
        arr[i][field]=imgPath+arr[i][field];
    }
}
function getOne(items,id){
    for(var i in items){
       if(items[i].id==id){
           return items[i];
       } 
    }
}
function getFormField(selector){
    var arr=$(selector).serializeArray();
    var param={};
    for (var i=0; i < arr.length; i++) {
        var p=arr[i];
        param[p.name]=p.value;
    }
    return param;
}
function setWinParam(param){
    localStorage.winParam=null;
    localStorage.winParam=JSON.stringify(param);
}
function getWinParam(){
    var p=null;
    if(localStorage.winParam){
        p=JSON.parse(localStorage.winParam);
        // localStorage.winParam=null;
    }
    return p;
}


$(document).on('click', 'a', function(e) {
    var target = e.currentTarget;
    if (target.hasAttribute('external')) {
        var href=target.href;
        var name=href.substring(href.lastIndexOf("/")+1,href.lastIndexOf("."));
        //openWin({name:name,data:href,aniId:0});
        api.openWin({
            name: name,
            url: name+'.html',
            animation:{
                type:"none"
            }
        });
        return false;
    }
});



