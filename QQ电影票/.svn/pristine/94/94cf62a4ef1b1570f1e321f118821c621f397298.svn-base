// position: fixed兼容太差，浪费了这个js加上想法

//判断是否支持 3d Transform 和 touch 事件
var $support = {
    transform3d: ('WebKitCSSMatrix' in window),
    touch: ('ontouchstart' in window)
};
//事件退化处理
var $E = {
    start: $support.touch ? 'touchstart' : 'mousedown',
    move: $support.touch ? 'touchmove' : 'mousemove',
    end: $support.touch ? 'touchend' : 'mouseup',
    cancel: $support.touch ? 'touchcancel' : '',
    transEndFn:'webkitTransitionEnd'
};
function getTranslateY(y) {
    return $support.transform3d ? 'translate3d(0,'+y+'px, 0)' : 'translate(0,'+y+'px)';
}
//多指，第一次触碰时的位置（pageX/Y）
function getPage (event, page) {
    return $support.touch ? event.changedTouches[0][page] : event[page];
}
/*自定义start*/
/*options:
{
    dir:运动方向，
    touchEndFn: touchend之后执行的函数，
    touchStartFn: touchstart时执行的函数，
    transEndFn: 运动结束后的函数，
    infinite: 是否执行无缝滚动，（未实现）
    duration: 动画执行的时间，
    l：QQ电影票新增，页面长度的80%；
    moveUnits: getElementByClassName()
}*/
var MovingList = function(selector,options){
    var self = this;
    options = options||{};
    self.touchEndFn = options.touchEndFn||null,
    self.transEndFn = options.transEndFn||null,
    self.touchStartFn = options.touchStartFn||null,
    self.infinite = options.infinite||false,
    self.l = options.l || 576,
    self.nodes = [];

    if (selector.nodeType && selector.nodeType == 1) {
        self.element = selector;
    } else if (typeof selector == 'string') {
        self.element = document.querySelector(selector);
    }
    self.Android4=(window.navigator.userAgent.indexOf("Android 4.")>=0);
    self.element.style.webkitTransform = getTranslateY(0);
    //设定初始属性
    self.conf = options.conf || {};
    self.touchEnabled = true;
    self.currentPoint = 0;
    self.currentDis = 0;

    // self.toNext();
    self.element.parentNode.addEventListener($E.start, self, false);
    self.element.parentNode.addEventListener($E.move, self, false);
    self.element.addEventListener($E.transEndFn, self, false);
    if($E.cancel != '')
    {
        self.element.addEventListener($E.cancel, self, false);
        document.addEventListener($E.cancel, self, false);
    }
    document.addEventListener($E.end, self, false);
    self.refresh();

    return self;

};
/*自定义end*/
MovingList.prototype = {
    handleEvent: function(event) {
        var self = this;

        switch (event.type) {
            case $E.start:
                self._touchStart(event);
                break;
            case $E.move:
                self._touchMove(event);
                break;
            case $E.end:
            case $E.cancel:
                self._touchEnd(event);
                break;
            case 'click':
                self._click(event);
                break;
            case $E.transEndFn:
                if(self.transEndFn)
                    self.transEndFn(event);
                break;
        }
    },
    refresh: function() {
        var self = this;
        var conf = self.conf;
        
        self.children = self.element.children;
        self.listArr = conf.listArr;
        self.listLen = self.listArr.length;
        self.maxDis = -conf.maxDis;
    },
    _setDis: function(dis) {
        var self = this;
        self.currentDis = dis;
        self.element.style.webkitTransform = getTranslateY(dis);
    },
    _getPoint: function(dis){
        var self = this;

        dis = Math.abs(dis);
        function binarySearch(arr,findVal,leftIndex,rightIndex){     
            if(leftIndex > rightIndex){ 
                var find = leftIndex-1
                return Math.floor(find/2);
            }
            var midIndex = Math.floor((leftIndex+rightIndex)/2);
            var midVal = arr[midIndex]; 
            if(midVal>findVal){          
                return binarySearch(arr,findVal,leftIndex,midIndex-1);
            }else if(midVal<findVal){
                return binarySearch(arr,findVal,midIndex+1,rightIndex);
            }else {
                var find = midIndex +1;
                return Math.floor(find/2);
            } 
        }
        var index = binarySearch(self.listArr,dis,0,self.listLen);

        $(self.children[index]).find('.area').addClass('active');
        $(self.children[index]).find('.area').removeClass('bottom');
        if (self.children[index-1]) {
            $(self.children[index-1]).find('.area').addClass('bottom');
            $(self.children[index-1]).find('.area').removeClass('active');
        }
        if (self.children[index+1]) {
            $(self.children[index+1]).find('.area').removeClass('bottom');
            $(self.children[index+1]).find('.area').removeClass('active');
        }
        // if(self.direction){
        //     if (self.children[index-1]) {
        //         $(self.children[index-1]).find('.area').addClass('bottom');
        //     }
        // } else{
        //     if (self.children[index-1]) {
        //         $(self.children[index-1]).find('.area').addClass('bottom');
        //     }
        // }
    },
    _touchStart: function(event) {
      
        var self = this;
        if(self.touchStartFn){
            self.touchStartFn();
        }
        if (!self.touchEnabled) {
            return;
        }
        if (!$support.touch) {
            event.preventDefault();
        }
        self.moveReady = false;
        self.startPageY = getPage(event, 'pageY');
        self.basePage = self.startPageY;
        self.direction;
        self.startTime = event.timeStamp;
    },
    _touchMove: function(event) {
        var self = this;
        var pageY = getPage(event, 'pageY'),
            oldDis,
            newDis,
            deltaY,
            delta;
        delta = Math.abs(pageY - self.startPageY);
        deltaY = Math.abs(pageY - self.startPageY);
        oldDis = pageY - self.basePage;
        newDis = self.currentDis + oldDis;

        if (newDis >= 0){
            newDis = 0;
        } else if(newDis < self.maxDis){
            newDis = self.maxDis;
        }
        // self._getPoint(newDis); //浏览器不支持，暂时不用
        self._setDis(newDis);
        
        self.direction = oldDis > 0 ? -1 : 1;
        self.basePage = pageY;
        
    },
    _touchEnd: function(event) {

        if(self.touchEndFn){
            self.touchEndFn();
        }
    },
    _click: function(event) {
        var self = this;

        event.stopPropagation();
        event.preventDefault();
    },
    destroy: function() {
        var self = this;

        self.element.parentNode.removeEventListener($E.start, self);
        self.element.parentNode.removeEventListener($E.move, self);
        self.element.parentNode.removeEventListener($E.transEndFn, self);
        self.element.parentNode.removeEventListener($E.cancel, self);
        document.removeEventListener($E.end, self);
        document.removeEventListener($E.cancel, self);
    }
};


