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
    cancel: $support.touch ? 'touchcancel' : ''
};
//多指，第一次触碰时的位置（pageX/Y）
function getPage (event, page) {
    return $support.touch ? event.changedTouches[0][page] : event[page];
}
/*自定义start*/
/*options:
{
    dir:运动方向，
    touchEndFn: touchend之后执行的函数，
    touchStartFn: touchstart时执行的函数
}*/
var BindSwipe = function(selector,options){
    var self = this;
    options = options||{};
    self.touchEndFn = options.touchEndFn||null,
    self.transEndFn = options.transEndFn||null,
    self.touchStartFn = options.touchStartFn||null,
    self.swipeUpFn = options.swipeUpFn||null,
    self.swipeDownFn = options.swipeDownFn||null,
    self.Android4=(window.navigator.userAgent.indexOf("Android 4.")>=0);
    //设定初始属性
    self.touchEnabled = true;

    // self.toNext();
    document.addEventListener($E.start, self, false);
    document.addEventListener($E.move, self, false);
    document.addEventListener($E.cancel, self, false);
    document.addEventListener($E.end, self, false);
    // 接到self，操作
    return self;

};
/*自定义end*/
BindSwipe.prototype = {
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
        }
    },
    _swipeVertical: function(dis,page){
        var self = this;
        if (self.curDisY != dis) {
            self.curDisY = dis;
            self.curPageY = page;
        } else{
            if(Math.abs(page - self.curPageY) >= 5){
                if (dis < 0) {
                    // 向下划动
                    self.swipeDownFn && self.swipeDownFn();
                } else{
                    // 向上划动
                    self.swipeUpFn && self.swipeUpFn();
                }
            }
        }
    },
    _touchStart: function(event) {
        var self = this;

        self.startPageX = getPage(event, 'pageX');
        self.startPageY = getPage(event, 'pageY');
        
        self.basePageX = self.startPageX;
        self.basePageY = self.startPageY;
        
        self.directionX;
        self.directionY;

        self.startTime = event.timeStamp;

        // _swipeVertical 上下方向的轻扫
        self.curPageY;
        self.curDisY = 0;

    },
    _touchMove: function(event) {
        var self = this;
        var pageX = getPage(event, 'pageX'),
            pageY = getPage(event, 'pageY'),
            oldDisX,
            oldDisY,
            newDisX,
            newDisY,
            deltaX,
            deltaY;
        deltaX = Math.abs(pageX - self.startPageX);
        deltaY = Math.abs(pageY - self.startPageY);
        // oldDis 计算当前划动方向
        oldDisX = pageX - self.basePageX;
        oldDisY = pageY - self.basePageY;
        // newDis 计算当前相对于初始位置的方向
        newDisX = pageX - self.startPageX;
        newDisY = pageY - self.startPageY;
        
        
        if(oldDisX > 0){
            self.directionX = -1;
        } else if(oldDisX < 0){
            self.directionX = 1;
        } else{
            self.directionX = 0;
        }
        if(oldDisY > 0){
            self.directionY = -1;
        } else if(oldDisY < 0){
            self.directionY = 1;
        } else{
            self.directionY = 0;
        }

        self.basePageX = pageX;
        self.basePageY = pageY;

        // _swipeVertical 上下方向的轻扫
        if (self.directionY == 0) {

        } else{
            self._swipeVertical(self.directionY,pageY);
        }
        

    },
    _touchEnd: function(event) {
        var self = this;
        // 垂直方向轻扫
        self.endTime = event.timeStamp;

        if ((self.endTime - self.startTime) < 200) {
            // if (Math.abs((self.startPageX - getPage(event, 'pageX'))) >= 15) {
                // 横向超过15 ，阻止纵向
            // } else{
                if((self.startPageY - getPage(event, 'pageY')) > 0){
                    self.swipeUpFn && self.swipeUpFn();
                } else if((self.startPageY - getPage(event, 'pageY')) < 0){
                    self.swipeDownFn && self.swipeDownFn();
                } else{

                }
            // }
            
        }
        if(self.touchEndFn){
            self.touchEndFn();
        }
    },
    destroy: function() {
        var self = this;

        document.removeEventListener($E.start, self);
        document.removeEventListener($E.move, self);
        document.removeEventListener($E.cancel, self);
        document.removeEventListener($E.end, self);
        document.removeEventListener($E.cancel, self);
    }
};


