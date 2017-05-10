;(function ($) {
    $(function () {
        var imageUrl = "image/";
        var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|mobile)/);

        //获取画布对象
        var c = $("#game-box").get(0);
        var c_width = $(c).width();
        var c_height = $(c).height();
        //创建画布
        var cxt = c.getContext("2d");
        //手机屏幕自适应
        (function () {
            $(window).on("resize.plain", resize);
            resize();
            function resize() {
                $(c).attr("height", $(window).height() < 800 ? $(window).height() : 800);
                $(c).attr("width", $(window).width() < 480 ? $(window).width() : 480);
                c_width = $(c).width();
                c_height = $(c).height();
                cxt.font = "30px Microsoft YaHei";
                cxt.fillStyle = "#333";
            }
        })();
        //图片资源, 存放图片对象
        var sources = [];

        //新建图片方法
        function creatImg(src) {
            if (typeof sources[src] != "undefined") {
                return sources[src];
            }

            sources[src] = new Image();
            sources[src].src = src;
            return sources[src];
        }

        //图片预加载方法
        function loadImages(images, callback) {
            var loadedImages = 0;
            var numImages = images.length;
            for (var i in images) {
                sources[images[i]] = new Image();
                sources[images[i]].onload = function () {
                    loadedImages++;
                    if (loadedImages >= numImages) {
                        callback();
                    }
                };
                sources[images[i]].src = imageUrl + images[i];
            }
        }

        //页面开始执行方法
        (function () {
            var images = ['bg.jpg', 'loading1.png', 'loading2.png', 'loading3.png', 'logo.png'];
            loadImages(images, loading);
        })();

        //等待动画
        function loading() {
            var loadingTime = 0;

            var refresh = function () {
                drawBg();
                drawLogo();
                load();
                loadingTime++;
            }
            var loadingClock = setInterval(refresh, 1);

            function drawBg() {
                var bg_img = creatImg("bg.jpg");
                var bg_img_width = bg_img.width;
                var bg_img_height = bg_img.height;
                cxt.drawImage(bg_img, 0, 0, bg_img_width, bg_img_height);
            }

            function drawLogo() {
                var logo_img = creatImg("logo.png");
                var logo_width = logo_img.width;
                var logo_height = logo_img.height;

                var x = (c_width - logo_width) / 2;
                var y = 100;
                cxt.drawImage(logo_img, x, y, logo_width, logo_height);
            }

            function load() {
                if (loadingTime == 600) {
                    loadingTime = 0;
                }

                var pic = creatImg("loading" + (parseInt(loadingTime / 200) + 1) + ".png");
                var pic_width = pic.width;
                var pic_height = pic.height;

                var x = (c_width - pic_width) / 2;
                cxt.drawImage(pic, x, 220, pic_width, pic_height);
            }

            var images = ['cartridge.png', 'cartridge_power.png', 'die1.png', 'die2.png', 'me.png', 'plain1.png', 'plain2.png', 'plain3.png', 'plain2_hurt.png', 'plain3_hurt.png', 'plain1_die1.png', 'plain1_die2.png', 'plain1_die3.png', 'plain2_die1.png', 'plain2_die2.png', 'plain2_die3.png', 'plain2_die4.png', 'plain3_die1.png', 'plain3_die2.png', 'plain3_die3.png', 'plain3_die4.png', 'plain3_die5.png', 'plain3_die6.png', 'me_die1.png', 'me_die2.png', 'me_die3.png', 'me_die4.png', 'prop1.png', 'prop2.png', 'bomb.png', 'me_2.png', 'plain3_2.png'];
            
            //游戏开始方法
            loadImages(images, function () {
                main();
                clearInterval(loadingClock);
            });
        }

        //游戏方法
        function main() {
            var modal = {
                "show": function (s) {
                    $("#modal").find(".content").html(s);
                    $("#modal").removeClass("hide");
                },
                "hide": function () {
                    $("#modal").addClass("hide");
                }
            };
            var bg_img = creatImg("bg.jpg");
            var bg_img_width = bg_img.width;
            var bg_img_height = bg_img.height;
            cxt.drawImage(bg_img, 0, 0, bg_img_width, bg_img_height);

            var me = {};
            me.x;
            me.y;
            me.lastX;
            me.lastY;
            me.bomb = 0;
            me.status = true;
            me.model = creatImg("me.png");
            me.model2 = creatImg("me_2.png");
            me.width = c_width / 480 * me.model.width;
            me.height = me.width / me.model.width * me.model.height;
            me.move = function (x, y) {
                me.lastX = me.x;
                me.lastY = me.y;
                me.x = x - me.width / 2;
                me.y = y - me.height / 2;
                me.x = me.x > c_width - me.width ? c_width - me.width : me.x;
                me.x = me.x < 0 ? 0 : me.x;
                me.y = me.y > c_height - me.height ? c_height - me.height : me.y;
                me.y = me.y < 0 ? 0 : me.y;
            }
            me.moveing = function () {
                if (!me.status) {
                    return;
                }
                
                cxt.drawImage(game.time % 30 > 15 ? me.model : me.model2, me.x, me.y, me.width, me.height);
                me.attacking();
            }
            me.cartridges = [];
            me.cartridge = function (x, y) {
                var cartridgeModel = creatImg(me.attackPower ? "cartridge_power.png" : "cartridge.png");

                this.model = cartridgeModel;
                
                this.width = c_width / 480 * cartridgeModel.width;
                this.height = this.width / cartridgeModel.width * cartridgeModel.height;

                this.x = x + (me.width - this.width) / 2;
                this.y = y - this.height;
            }
            me.attackTime = 0;
            me.attackPower = false;
            me.attack = function () {
                if (!me.status) {
                    return;
                }

                me.attackTime++;
                if (me.attackTime % 14 != 0) {
                    return;
                }

                me.attackTime = 0;
                var cartridge;
                if(me.attackPower) {
                    cartridge = [(new me.cartridge(me.x - (me.width / 5), me.y)), (new me.cartridge(me.x + (me.width / 5), me.y))];
                } else {
                    cartridge = [(new me.cartridge(me.x, me.y))];
                }
                Array.prototype.push.apply(me.cartridges, cartridge);
            }
            me.attacking = function () {
                me.attack();
                var cartridgeSpeed = 10;
                for(var cartridgeIndex = me.cartridges.length; cartridgeIndex--;) {
                    var cartridge = me.cartridges[cartridgeIndex];
                    cxt.drawImage(cartridge.model, cartridge.x, cartridge.y, cartridge.width, cartridge.height);
                    if (cartridge.y <= 0) {
                        me.cartridges.splice(cartridgeIndex, 1);
                        continue;
                    }

                    for(var plainIndex = game.plains.length; plainIndex--;) {
                        var plain = game.plains[plainIndex];
                        var X = cartridge.x;
                        var nextY = cartridge.y - cartridgeSpeed;
                        if (
                            X > plain.x
                         && X < (plain.x + plain.width)
                         && nextY < (plain.y + plain.height + plain.speed)
                         && cartridge.y >= (plain.y + plain.height)
                        ) {
                            plain.byAttack();
                            me.cartridges.splice(cartridgeIndex, 1);
                        }
                    }

                    cartridge.y = cartridge.y - cartridgeSpeed;  //子弹向上移动
                }
            }
            me.die = function () {
                if (!me.status) {
                    return;
                }

                me.status = false;
                var dieSpeed = 20;
                var x = this.x;
                var y = this.y;
                var h = this.height;
                var w = this.width;

                game.plainsDies.push((new die()));

                function die() {
                    var dieTime = 4 * dieSpeed;
                    this.animationTime = 4 * dieSpeed;

                    this.call = function () {
                        if (this.animationTime == 1) {
                            game.over();
                        }
                        var dieModel = creatImg("me_die" + (parseInt((dieTime - this.animationTime) / dieSpeed) + 1) + ".png");
                        cxt.drawImage(dieModel, x, y, w, h);
                        this.animationTime--;
                    }
                }
            }

            var game = {};
            game.score = 0;
            game.me = me;
            game.time = 0;
            game.refreshInterval = 8;
            game.refresh = function () {
                game.time++;
                game.bgScroll();
                game.plainsScroll();
                game.plainsDying();
                game.me.moveing();
                game.propShow();
                game.refreshMessage();          
            }
            game.bgScrollTime = 0;
            game.bgScroll = function () {
                game.bgScrollTime += 0.5;
                if (game.bgScrollTime > bg_img_height) {
                    game.bgScrollTime = 0;
                }
                cxt.drawImage(bg_img, 0, game.bgScrollTime - bg_img_height, bg_img_width, bg_img_height);
                cxt.drawImage(bg_img, 0, game.bgScrollTime, bg_img_width, bg_img_height);
            }
            game.prop = function (type) {
                this.type = type;
                this.status = "show";
                this.isDeleted = false;
                this.modelImg;
                switch(type) {
                    case 1:
                        this.modelImg = "prop1.png";
                        break;
                    case 2:
                        this.modelImg = "prop2.png";
                        break;
                }
                this.model = creatImg(this.modelImg);
                this.width = c_width / 480 * this.model.width;
                this.height = this.model.height / this.model.width * this.width;
                this.x = Math.random() * (c_width - this.width);
                this.y = -this.height;

                var speed = this.speed = 6;
                var animateTime = this.animateTime = 70;
                this.showType = "down";
                this.show = function () {
                    if(this.animateTime <= animateTime / 2) {
                        this.showType = "up";
                    }
                    cxt.drawImage(this.model, this.x, this.y, this.width, this.height);
                    if(isGain(this)) {
                        this.isDeleted = true;
                        this.byGain();
                        return;
                    }
                    var move = ((c_height + this.height) / 3) / (animateTime / 2);
                    this.speed = move;
                    if(this.showType == "down") {
                        this.y += move; 
                    } else {
                        this.y -= move; 
                    }
                    this.animateTime--;
                    if(this.animateTime <= 0) {
                        this.speed = speed;
                        this.status = "move";
                    }
                }
                this.move = function () {
                    this.y += this.speed;
                    cxt.drawImage(this.model, this.x, this.y, this.width, this.height);
                    if(isGain(this)) {
                        this.isDeleted = true;
                        this.byGain();
                        return;
                    }
                }

                this.byGain = function () {
                    switch(this.type) {
                        case 1:
                            game.me.bomb++;
                            break;
                        case 2:
                            game.me.attackPower = true;
                            game.me.attackPowerClock = setTimeout(function () {
                                game.me.attackPower = false;
                            }, 15000);
                            break;
                    }
                }

                //判断有没有吃到道具
                var isGain = function(prop) {
                    var leftX = prop.x;
                    var rightX = prop.x + prop.width;
                    if(rightX < game.me.x || leftX > (game.me.x + game.me.width)) {
                        return false;
                    }
                    var removing = prop.status == "move" ? prop.speed : (prop.showType == "down" ? prop.speed : -prop.speed);
                    var nextY = prop.y + removing;
                    if(((prop.y + prop.height) > game.me.y || (nextY + prop.height) < game.me.y) && game.me.lastY > (prop.y + prop.height)) {
                        return false;
                    }
                    return true;
                }
            }
            game.addProp = function () {
                var interval = 25;
                if((game.time * game.refreshInterval) % (interval * 1000) == 0) {
                    game.props.push((new game.prop(parseInt(Math.random() * 1.8 + 1.1))));
                }
            }
            game.props = [];
            game.propShow = function () {
                game.addProp();
                for(var propIndex = game.props.length; propIndex--;) {
                    var prop = game.props[propIndex];
                    if(prop.isDeleted == true) {
                        game.props.splice(propIndex, 1);
                        continue;
                    }

                    prop[prop.status]();

                    if(prop.y > c_height) {
                        game.props.splice(propIndex, 1);
                    }
                }
            }
            game.useBomb = function () {
                if(game.me.bomb <= 0) {
                    return;
                }
                game.me.bomb--;
                for(var plainIndex = game.plains.length; plainIndex--;) {
                    var plain = game.plains[plainIndex];
                    plain.die();
                }
            }
            game.plains = [];
            game.plainsNum = 0;
            game.addPlain = function () {
                if (game.bgScrollTime % 30 != 0) {
                    return;
                }

                if (game.plainsNum == 26) {
                    game.plainsNum = 0;
                }

                game.plainsNum++;
                switch (true) {
                    case game.plainsNum % 13 == 0:
                        game.plains.push(new plain(3));
                        break;
                    case game.plainsNum % 6 == 0:
                        game.plains.push(new plain(2));
                        break;
                    default:
                        game.plains.push(new plain(1));
                        break;
                }
            }
            game.plainsScroll = function () {
                game.addPlain();
                for(var plainIndex = game.plains.length; plainIndex--;) {
                    var plain = game.plains[plainIndex];
                    if (plain.y > c_height || plain.status == false) {
                        game.plains.splice(plainIndex, 1);
                        continue;
                    }

                    plain.show();
                    
                    if (isCollide(plain)) {
                        game.me.die();
                    }

                    plain.y = plain.y + plain.speed;
                }

                //判断是否和玩家的飞机碰撞
                function isCollide(plain) {
                    var plainTopLeft = [plain.x, plain.y];
                    var plainBottomRight = [plain.x + plain.width, plain.y + plain.height];
                    var meTopLeft = [game.me.x + game.me.width / 3, game.me.y];
                    var meBottomRight = [game.me.x + (game.me.width * 2 / 3), game.me.y + (game.me.height * 2 / 3)];

                    var collideTopLeft = [Math.max(plainTopLeft[0], meTopLeft[0]), Math.max(plainTopLeft[1], meTopLeft[1])];
                    var collideBottomRight = [Math.min(plainBottomRight[0], meBottomRight[0]), Math.min(plainBottomRight[1], meBottomRight[1])];

                    if (collideTopLeft[0] < collideBottomRight[0] && collideTopLeft[1] < collideBottomRight[1]) {
                        return true;
                    }

                    return false;
                }
            }
            game.plainsDies = [];
            game.plainsDying = function () {
                for(var plainDieIndex = game.plainsDies.length; plainDieIndex--;) {
                    var plainDie = game.plainsDies[plainDieIndex];
                    if (plainDie.animationTime == 0) {
                        game.plainsDies.splice(plainDieIndex, 1);
                        return;
                    }
                    plainDie.call();
                }
            }
            game.over = function () {
                $(c).removeClass("playing");
                if(isMobile) {
                    c.removeEventListener("touchmove");
                } else {
                    $(c).off("mousemove");
                }
                $(c).off("click");
                clearInterval(game.clock);
                modal.show(game.score);
            }
            game.clear = function () {
                game.me.x = (c_width - game.me.width) / 2;
                game.me.y = c_height - game.me.height;

                game.plains = [];
                game.plainsDies = [];
                game.plainsNum = 0;
                game.time = 0;
                game.bgScrollTime = 0;
                game.score = 0;
                game.me.status = true;
                game.me.bomb = 0;
                game.me.attackPower = false;
                clearTimeout(game.me.attackPowerClock);
            }
            game.start = function () {
                $(c).addClass("playing");
                $(c).on("click", function (e) {
                    game.useBomb();
                });
                if(isMobile) {
                    c.addEventListener("touchmove", function (e) {
                        e.preventDefault();
                        var touch = e.targetTouches[0];
                        var x = touch.pageX - $(this).offset().left;
                        var y = touch.pageY;
                        me.move(x, y);
                    });
                } else {
                    $(c).on("mousemove", function (e) {
                        var x = e.clientX - $(this).offset().left;
                        var y = e.clientY;
                        me.move(x, y);
                    })
                }

                modal.hide();
                game.clear();
                game.clock = setInterval(function () {
                    game.refresh();
                }, game.refreshInterval);
            }
            game.refreshMessage = function () {
                cxt.fillText(game.score, 20, 44);

                if(game.me.bomb > 0) {
                    var bombModel = creatImg("bomb.png");
                    cxt.drawImage(bombModel, 10, c_height - bombModel.height - 10, bombModel.width, bombModel.height);
                    cxt.fillText(game.me.bomb, 20 + bombModel.width, c_height - bombModel.height + 28);
                }
            }
            game.start();

            //飞机类
            function plain(type) {
                this.type = type;

                this.hp;  //飞机生命值
                this.height;
                this.width;
                this.maxSpeed;
                this.dieTime;
                this.status = true;  //飞机死了没
                var dieSpeed = 20;  //死亡动画播放速度

                switch (type) {
                    case 1:
                        this.hp = 1;
                        this.score = 1000;
                        this.maxSpeed = 5;
                        this.dieTime = dieSpeed * 3;
                        break;
                    case 2:
                        this.hp = 8;
                        this.score = 8000;
                        this.maxSpeed = 2;
                        this.dieTime = dieSpeed * 4;
                        break;
                    case 3:
                        this.hp = 18;
                        this.score = 30000;
                        this.maxSpeed = 1;
                        this.dieTime = dieSpeed * 6;
                        break;
                }

                this.modelimg = "plain" + this.type + ".png";
                this.model = creatImg(this.modelimg);

                if(this.type == 3) {
                    this.modelimg2 = "plain3_2.png";
                    this.model2 = creatImg(this.modelimg2);
                }

                this.width = c_width / 480 * this.model.width;
                this.height = this.width / this.model.width * this.model.height;

                this.x = Math.random() * (c_width - this.width);
                this.y = -(this.height);

                var maxSpeed = game.time / 1000 > 10 ? 10 : game.time / 1000;
                this.speed = Math.random() * (maxSpeed - 1) + 1;
                this.speed = this.speed < 0.5 ? Math.random() * 0.5 + 0.5 : this.speed;
                this.speed = this.speed > this.maxSpeed ? this.maxSpeed : this.speed;

                this.show = function () {
                    if(this.type == 3) {
                        cxt.drawImage(game.time % 30 > 15 ? this.model : this.model2, this.x, this.y, this.width, this.height);
                        return;
                    }
                    cxt.drawImage(this.model, this.x, this.y, this.width, this.height);
                }

                this.die = function () {
                    var plainType = this.type;
                    var plainX = this.x;
                    var plainY = this.y;
                    var plainW = this.width;
                    var plainH = this.height;

                    game.plainsDies.push((new die(this.dieTime)));
                    
                    game.score += this.score;
                    this.status = false;

                    function die(dieTime) {
                        var dieTime = dieTime;
                        this.animationTime = dieTime;

                        this.call = function () {
                            if (this.animationTime <= 0) {
                                return;
                            }
                            var dieModel = creatImg("plain" + plainType + "_die" + (parseInt((dieTime - this.animationTime) / dieSpeed) + 1) + ".png");
                            cxt.drawImage(dieModel, plainX, plainY, plainW, plainH);
                            this.animationTime--;
                        }
                    }
                }

                var hp = this.hp;
                this.byAttack = function () {
                    this.hp--;
                    if (this.hp <= 0) {
                        this.die();
                        return;
                    }

                    if (this.hp <= hp / 3) {
                        this.model = creatImg("plain" + this.type + "_hurt.png");
                    }
                }
            }

            $("#modal").on("click", "button", function () {
                game.start();
            });
        }
    });
})(jQuery);