var isPhone = (window.navigator.platform != "Win32");
var isAndroid = (window.navigator.userAgent.indexOf('Android')>=0)?true : false;
var going = 0;
var isSML;
var sto = window.localStorage;
if(sto) isSML = sto.getItem('simulate');
function zy_selectmenu(id, cb){
    var sl = document.getElementById(id);
    if (sl) {
        var sp = sl.parentElement; //<span>
        if (sp) {
            var ch = sp.getElementsByTagName("div")[0];
			var si = sl.selectedIndex;
            var t = sl.options[si].text;
            if (ch) {
                ch.innerHTML = t;
            }
			var op = sl.options[si];
			if(cb) cb(id, op.value);
        }
    }
}

function zy_for(e, cb){
	var ch;
	if(e.currentTarget)
    	ch = e.currentTarget.previousElementSibling;
	else
		ch = e.previousElementSibling;
    if (ch.nodeName == "INPUT") {
        if (ch.type == "checkbox") 
            ch.checked = !ch.checked;
        if (ch.type == "radio" && !ch.checked) 
            ch.checked = "checked";
        
    }
    if (cb) 
        cb(e, ch.checked);
}


function zy_fold(e, col){
    var a = e.currentTarget.nextElementSibling;
    if (a.nodeName == "DIV") {
        if (col) 
            a.className = a.className.replace("col-c", "");
        else 
            a.className += ' col-c';
    }
}

function zy_touch(c, f){
    var t = event.currentTarget;
    if (!t.zTouch) {
        t.zTouch = new zyClick(t, f, c);
        t.zTouch._touchStart(event);
    }
}

function zy_parse(){
    var params = {};
    var loc = String(document.location);
    if (loc.indexOf("?") > 0) 
        loc = loc.substr(loc.indexOf('?') + 1);
    else 
        loc = uexWindow.getUrlQuery();
		var pieces = loc.split('&');
	    params.keys = [];
	    for (var i = 0; i < pieces.length; i += 1) {
	        var keyVal = pieces[i].split('=');
	        params[keyVal[0]] = decodeURIComponent(keyVal[1]);
	        params.keys.push(keyVal[0]);
	    }
    return params;
}

function $$(id)
{
	return document.getElementById(id);
}
function int(s){
	return parseInt(s,10);
}
function Int(s){
	return int(s);
}
function force_int(s){
    s = parseInt(s);
    return s ? s : 0 ;
}
function zy_con(id,url,x,y,bounces){
    if(bounces != 'false') bounces = '0';//只有为'false'时，才不弹动
	var s=window.getComputedStyle($$(id),null);
	uexWindow.openPopover(id,"0",url,"",int(x),int(y),int(s.width),int(s.height),int(s.fontSize),'0',bounces);
}

function zy_resize(id,x,y)
{
	var s=window.getComputedStyle($$(id),null);
	uexWindow.setPopoverFrame(id,int(x),int(y),int(s.width),int(s.height));
}

function zy_init()
{
	if(window.navigator.platform=="Win32")
		document.body.style.fontSize=window.localStorage["defaultfontsize"];
}

function zy_cc(t){
    if (!t.cancelClick) {
        t.cancelClick = true;
        t.addEventListener("click", function(){
            event.stopPropagation();
        }, true);
    }
}
/**
 * ************************************yue.js***********************************
 */
window.CONF = {
    'plus' : [
        'plus_apicast.js'
        //'debuggap.js'
    ],
    'cast':{
        "s" : "appcan",
        "d" : "apicloud",
    },
};

~function(){
    if(isSML) return;
    if(!CONF.cast.s || !CONF.cast.d) return;
    window.uexOnload = function(){};
    window.Y = {
        "loadJS" : function(url){
            //同步加载JS文件
            /*var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET",url,false);
            xmlHttp.send(null);
            var _head = document.getElementsByTagName("head").item(0);
            var _script = document.createElement( "script" );
            _script.language = "javascript";
            _script.type = "text/javascript";
            _script.text = xmlHttp.responseText;
            _head.appendChild( _script );*/
            var _head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.type = 'text/javascript';
            script.src = url;
            _head.appendChild(script);
        },
        "fn" : function(obj, json){
            //加载uex api对象
            for(var k in json){            	  
                if(k in obj){//todo 未来将window换为Y
                    alert('插件方法 '+ k + ' 已存在，请更换其他方法名');
                    return;
                }
                obj[k] = json[k];
            }            
        },
        "ready" : function(callback){//todo 未来可以直接引入到页面：Y.ready
            //hybird引擎加载完毕事件，添加函数准备执行
           // if (typeof(callback) != 'function') return;
            Y.readyCall = Y.readyCall || [];
            Y.readyCall.push(callback);
        },
        "wgtOnload" : function(){//引擎加载完毕
            Y.initApi();
            Y.ready(window.uexOnload);//todo 未来可以用Y.ready(function(){...})把window.uexOnload=function(){...}替换掉
            if(toString.apply(Y.readyCall) === '[object Array]'){
              for(var i=0,l=Y.readyCall.length;i<l;i++){
                  (Y.readyCall[i])();
              }
              delete Y.readyCall;
            }
            //w.uexOnload();
        },

        "S" : {},//cast source
        "D" : {},//cast destination
    };
    //加载插件
    var jsPath=document.scripts;
    jsPath=jsPath[jsPath.length-1].src.substring(0,jsPath[jsPath.length-1].src.lastIndexOf("/")+1);
    for(var i=0;i<CONF.plus.length;i++)	Y.loadJS(jsPath + CONF.plus[i]);
    //根据设备类型，确定用click还是toustart
    /*window.tap = "click";
    window.touchstart = "mousedown";
    window.touchmove = "mousemove";
    window.touchend = "mouseup";

    if('ontouchstart' in window){
        window.tap='click';
        window.touchstart = "touchstart";
        window.touchmove = "touchmove";
        window.touchend = "touchend";
    }*/


    /**
     * 事件映射
     */
    apiready = function(type){
    //window.onload = function(type){
        if (!window._wgtOnload_){
            window._wgtOnload_ = true;
            setTimeout(function(){
                Y.wgtOnload();
            },0);
        }
    };
}();