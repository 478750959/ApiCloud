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

    function getTranslateX(x,s) {
        s = s || 1;
        return $support.transform3d ? 'translate3d('+x+'px, 0, 0) scale3d('+s+','+s+',1)' : 'translate('+x+'px, 0) scale3d('+s+','+s+')';
    }
    function getTranslateY(y,s) {
        s = s || 1;
        return $support.transform3d ? 'translate3d(0,'+y+'px, 0) scale3d('+s+','+s+',1)' : 'translate(0,'+y+'px) scale3d('+s+','+s+')';
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
    var Moving = function(selector,options){
        var self = this;
        options = options||{};
        self.dir = (options.dir).toLowerCase()||'x',
        self.touchEndFn = options.touchEndFn||null,
        self.transEndFn = options.transEndFn||null,
        self.touchStartFn = options.touchStartFn||null,
        self.infinite = options.infinite||false,
        self.duration = parseFloat(options.duration)||300,
        self.l = options.l || 576,
        self.nodes = [];
        self.stanScale = options.conf.stanScale || 0.8;

        if (selector.nodeType && selector.nodeType == 1) {
            self.element = selector;
        } else if (typeof selector == 'string') {
            self.element = document.querySelector(selector);
        }
        self.Android4=(window.navigator.userAgent.indexOf("Android 4.")>=0);
        if(self.dir=="x"){
            self.element.style.webkitTransform = getTranslateX(0);
        }else{
            self.element.style.webkitTransform = getTranslateY(0);
        }
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
    Moving.prototype = {
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

            // setting max point
            self.maxPoint = conf.point || (function() {
                var childNodes = self.element.childNodes,
                    itemLength = 0,
                    len = childNodes.length,
                    node;
                for(i = 0; i < len; i++) {
                    node = childNodes[i];
                    if (node.nodeType === 1) {
                        self.nodes[itemLength]=node;
                        itemLength++;
                    }
                }
                if (itemLength > 0) {
                    itemLength--;
                }
                
                return itemLength;
            })();
            
            // 传入元素的距离
            if(self.dir=='x'){
                self.distance = parseInt(conf.distance || window.getComputedStyle(self.element,null).width);
            }else{
                self.distance = parseInt(conf.distance || window.getComputedStyle(self.element,null).height);
            }
            //最远距离//暂未包括无缝滚动
            self.maxDis = conf.maxDis ? - conf.maxDis : - self.distance * self.maxPoint;
            self.moveToPoint(self.currentPoint);
        },
        addSection : function(obj){//暂未用到，待扩展
            var self = this;
            self.element.appendChild(obj);
            self.refresh();
        },
        getSection : function(i){//暂未用到，待扩展
            var self = this;
            var obj = self.nodes[i];
            if(obj.childNodes[1] && obj.childNodes[1].childNodes[1]){
                return obj.childNodes[1].childNodes[1].childNodes[1];
            }else{
                return obj;
            }
        },
        hasNext: function() {
            var self = this;
            return self.currentPoint < self.maxPoint;
        },
        hasPrev: function() {
            var self = this;
            return self.currentPoint > 0;
        },
        toNext: function() {
            var self = this;
            if (!self.hasNext()) {
                return;
            }
            self.moveToPoint(self.currentPoint + 1);
        },
        toPrev: function() {
            var self = this;
            if (!self.hasPrev()) {
                return;
            }
            self.moveToPoint(self.currentPoint - 1);
        },
        moveToPoint: function(point) {
            var self = this;

            self.currentPoint = (point < 0) ? 0 : (point > self.maxPoint) ? self.maxPoint : parseInt(point);
            self.element.style.webkitTransitionDuration = self.duration+'ms';
            self._setDis(- self.currentPoint * self.distance);
            //兼容ff，无用
            var ev = document.createEvent('Event');
            ev.initEvent('css3flip.moveend', true, false);
            self.element.dispatchEvent(ev);
        },
        _setDis: function(dis) {
            var self = this;

            self.currentDis = dis;
            if(self.dir=='x'){
                self.element.style.webkitTransform = getTranslateX(dis);
                self.nodes[self.currentPoint].style.webkitTransform = getTranslateX(0,1);
                if (self.nodes[self.currentPoint-1]) {
                    self.nodes[self.currentPoint-1].style.webkitTransform = getTranslateX(0,self.stanScale);   
                }
                if (self.nodes[self.currentPoint+1]) {
                    self.nodes[self.currentPoint+1].style.webkitTransform = getTranslateX(0,self.stanScale);
                }
                if (self.nodes[self.currentPoint-2]) {
                    self.nodes[self.currentPoint-2].style.webkitTransform = getTranslateX(0,self.stanScale);   
                }
                if (self.nodes[self.currentPoint+2]) {
                    self.nodes[self.currentPoint+2].style.webkitTransform = getTranslateX(0,self.stanScale);
                }
            }else{
                self.element.style.webkitTransform = getTranslateY(dis);
                self.nodes[self.currentPoint].style.webkitTransform = getTranslateY(0,1);
                if (self.nodes[self.currentPoint-1]) {
                    self.nodes[self.currentPoint-1].style.webkitTransform = getTranslateY(0,self.stanScale);
                }
                if (self.nodes[self.currentPoint+1]) {
                    self.nodes[self.currentPoint+1].style.webkitTransform = getTranslateY(0,self.stanScale);
                }
            }
            
        },
        _setCusUnit: function(delta,options){
            // 自定义方法，为QQ电影票写的；
            var self = this;
            var deltaDis = delta;
            var lStandard = options.l;//lStandard 是滑动多少算是滑动一个单位
            if (deltaDis>lStandard) {
                deltaDis = lStandard;
            }
            var scale = 1;
            var scale2 = self.stanScale;
            scale = 1 - (parseInt(deltaDis*50/lStandard)/250);
            scale2 = self.stanScale + (parseInt(deltaDis*50/lStandard)/250);
            if (scale > 1) {
                scale = 1;
            } else if (scale < self.stanScale){
                scale = self.stanScale;
                scale2 = 1;
            }
            if (scale2 < self.stanScale) {
                scale2 = self.stanScale;
            } else if(scale2 > 1){
                scale2 = 1;
            }

            self.maxDis;
            if(self.dir=='x'){
                if (options.cusDir!=undefined && options.cusDir > 0) {
                    if (self.nodes[self.currentPoint-1]) {
                        self.nodes[self.currentPoint-1].style.webkitTransform = getTranslateX(0,scale2);
                        self.nodes[self.currentPoint].style.webkitTransform = getTranslateX(0,scale);
                    }
                    if (self.nodes[self.currentPoint+1]) {
                        self.nodes[self.currentPoint+1].style.webkitTransform = getTranslateX(0,self.stanScale);
                    }if (self.nodes[self.currentPoint+2]) {
                        self.nodes[self.currentPoint+2].style.webkitTransform = getTranslateX(0,self.stanScale);
                    }
                    if (self.nodes[self.currentPoint-2]) {
                        self.nodes[self.currentPoint-2].style.webkitTransform = getTranslateX(0,self.stanScale);
                    }
                    if (self.nodes[self.currentPoint-3]) {
                        self.nodes[self.currentPoint-3].style.webkitTransform = getTranslateX(0,self.stanScale);
                    }
                }
                if (options.cusDir!=undefined && options.cusDir < 0) {
                    if (self.nodes[self.currentPoint+1]) {
                        self.nodes[self.currentPoint+1].style.webkitTransform = getTranslateX(0,scale2);
                        self.nodes[self.currentPoint].style.webkitTransform = getTranslateX(0,scale);
                    }
                    if (self.nodes[self.currentPoint-1]) {
                        self.nodes[self.currentPoint-1].style.webkitTransform = getTranslateX(0,self.stanScale);
                    }if (self.nodes[self.currentPoint-2]) {
                        self.nodes[self.currentPoint-2].style.webkitTransform = getTranslateX(0,self.stanScale);
                    }
                    if (self.nodes[self.currentPoint+2]) {
                        self.nodes[self.currentPoint+2].style.webkitTransform = getTranslateX(0,self.stanScale);
                    }
                    if (self.nodes[self.currentPoint+3]) {
                        self.nodes[self.currentPoint+3].style.webkitTransform = getTranslateX(0,self.stanScale);
                    }
                }
            }else{
                if (options.cusDir!=undefined && options.cusDir > 0) {
                    if (self.nodes[self.currentPoint-1]) {
                        self.nodes[self.currentPoint-1].style.webkitTransform = getTranslateY(0,scale2);
                        self.nodes[self.currentPoint].style.webkitTransform = getTranslateY(0,scale);
                    }
                    if (self.nodes[self.currentPoint+1]) {
                        self.nodes[self.currentPoint+1].style.webkitTransform = getTranslateY(0,self.stanScale);
                    }
                    if (self.nodes[self.currentPoint-2]) {
                        self.nodes[self.currentPoint-2].style.webkitTransform = getTranslateY(0,self.stanScale);
                    }
                }
                if (options.cusDir!=undefined && options.cusDir < 0) {
                    if (self.nodes[self.currentPoint+1]) {
                        self.nodes[self.currentPoint+1].style.webkitTransform = getTranslateY(0,scale2);
                        self.nodes[self.currentPoint].style.webkitTransform = getTranslateY(0,scale);
                    }
                    if (self.nodes[self.currentPoint-1]) {
                        self.nodes[self.currentPoint-1].style.webkitTransform = getTranslateY(0,self.stanScale);
                    }
                    if (self.nodes[self.currentPoint+2]) {
                        self.nodes[self.currentPoint+2].style.webkitTransform = getTranslateY(0,self.stanScale);
                    }
                }
            }
            
        },
        _cusMoveToPoint: function(point) {
            var self = this;

            self.currentPoint = (point < 0) ? 0 : (point > self.maxPoint) ? self.maxPoint : parseInt(point);
            self.element.style.webkitTransitionDuration = self.duration+'ms';
            self._setDis(- self.currentPoint * self.distance);
            //兼容ff，无用
            var ev = document.createEvent('Event');
            ev.initEvent('css3flip.moveend', true, false);
            self.element.dispatchEvent(ev);
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
            self.element.style.webkitTransitionDuration = '0';
            self.scrolling = true;
            self.moveReady = false;
            self.startPageX = getPage(event, 'pageX');
            self.startPageY = getPage(event, 'pageY');
            if(self.dir=='x'){
                self.basePage = self.startPageX;
            }else{
                self.basePage = self.startPageY;
            }
            self.direction = 0;
            self.startTime = event.timeStamp;
        },
        _touchMove: function(event) {
            var self = this;
            if (!self.scrolling) {
                return;
            }
            var pageX = getPage(event, 'pageX'),
                pageY = getPage(event, 'pageY'),
                oldDis,
                newDis,
                deltaX,
                deltaY,
                delta;
            if (self.dir == 'x') {
                delta = Math.abs(pageX - self.startPageX);
            }else{
                delta = Math.abs(pageY - self.startPageY);
            }
            if (!self.moveReady) {
                deltaX = Math.abs(pageX - self.startPageX);
                deltaY = Math.abs(pageY - self.startPageY);
                if(self.dir=='x'){//moveReady，移动一定的距离，开启翻页
                    if (deltaX>deltaY && deltaX > 5) {
                        if(self.Android4)//Android 4.0 need prevent default
                        {
                            event.preventDefault();
                        }
                        self.moveReady = true;
                        self.element.parentNode.addEventListener('click', self, true);
                    }
                    else if (deltaY > 5) {
                        self.scrolling = false;
                        self.touchEndFn && self.touchEndFn();
                    }
                }else{
                    if (deltaY>deltaX && deltaY> 5) {
                        if(self.Android4)//Android 4.0 need prevent default
                        {
                            event.preventDefault();
                        }
                        self.moveReady = true;
                        self.element.parentNode.addEventListener('click', self, true);
                    }
                    else if (deltaX > 5) {
                        self.scrolling = false;
                        self.touchEndFn && self.touchEndFn();
                    }

                }
            }

            if (self.moveReady) {
                //event.preventDefault();
                //event.stopPropagation();
                if (self.dir == 'x') {
                    oldDis = pageX - self.basePage;
                    isScroll = 1;
                } else{
                    oldDis = pageY - self.basePage;
                    isScroll = 1;
                }
                newDis = self.currentDis + oldDis;
                // if (newDis >= 0 || newDis < self.maxDis) {//弹动
                //     // newDis = Math.round(self.currentDis + oldDis/3 );
                //     newDis = Math.round(self.currentDis);
                // }
                if (newDis >= 0){
                    newDis = 0;
                } 
                if (newDis <= self.maxDis){
                    newDis = self.maxDis;
                } 
                // if (self.dir == 'x') {
                    // self._setDis(newDis);
                // } else{
                    if (delta > self.conf.distance) {

                    } else {
                        self._setDis(newDis);
                    }
                // }
                
                if (self.dir == 'x') {
                    self._setCusUnit(delta,
                        {
                            l: self.l,
                            cusDir: pageX - self.startPageX
                        }
                    );
                } else{
                    self._setCusUnit(delta,
                        {
                            l: self.l,
                            cusDir: pageY - self.startPageY
                        }
                    );
                }
                
                self.direction = oldDis > 0 ? -1 : 1;
            }
            if(self.dir=='x'){
                self.basePage = pageX;
            }else{
                self.basePage = pageY;
            }
            // event.preventDefault();
        },
        _touchEnd: function(event) {
            isScroll=0;
            var self = this;
            
            if (!self.scrolling) {
                return;
            }
            self.scrolling = false;

            var newPoint = -self.currentDis / self.distance;
            newPoint =
                (self.direction > 0) ? Math.ceil(newPoint) :
                (self.direction < 0) ? Math.floor(newPoint) :
                Math.round(newPoint);

            self.moveToPoint(newPoint);

            setTimeout(function() {
                self.element.parentNode.removeEventListener('click', self, true);
            }, 200);
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


