var canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    paddingL = CONFIG.canvasPadding;
    paddingR = canvas.width - CONFIG.canvasPadding;
    enemyX = 0;
    enemyY = 0;
    enemyAry = [];
    bulletAry = [];
    bulletX = 0;
    bulletID = 0;
    bulletUP = false;
    keyLeft = false;
    keyRight = false;
    keySpace = false;
    fraction = 0;
    failed = false;


/**
 * Plane
 * @param {[obj]} opts [description]
 */
function Plane(opts){
    Element.call(this, opts)
    this.x = 300;
    this.y = 470;
    this.img = new Image();
    this.img.src = opts.Icon;
    this.shootTime = 0;
    this.level = 0;
}
inherit(Plane, Element);
//飞机绘画
Plane.prototype.draw = function() {
    ctx.drawImage(this.img, this.x, this.y, this.size.width, this.size.height);
}
//飞机移动
Plane.prototype.key = function() {
    var speed = this.speed;
    var planeL = this.x >= paddingL;
    var planeR = this.x <= canvas.width - this.size.width - paddingL;
    if (keyLeft && planeL) {
        this.move(-speed, 0);
        bulletX = this.x;
    }
    if (keyRight && planeR) {
        this.move(speed, 0);
        bulletX = this.x;
    }
 };
//飞机射击
Plane.prototype.shoot = function() {
    if (keySpace) {
        this.shootTime ++;
        if (this.shootTime === 1 && keySpace) {
            BULLET.axisX = bulletX + this.size.width / 2;
            bulletAry.push(new Bullet(BULLET));
        } else if (this.shootTime > 8) {
            this.shootTime = 0;
            if(this.level > 10) {
                bulletUP = true;
                this.shootTime = -20;
                return;
            } else {
                this.level++;
            }
        }
    } else {
        this.shootTime = 0;
        this.level = 0;
        bulletUP = false;
    }
}

/**
 * 怪物
 * @param {[obj]} opts [description]
 */
function Enemy(opts) {
    Element.call(this, opts)
    this.x = enemyX;
    this.y = enemyY;
    this.img = new Image();
    this.boomImg = new Image();
    this.img.src = opts.Icon;
    this.boomImg.src = opts.boomIcon;
    this.gap = opts.gap;
    this.direction = opts.direction;
    this.kill = false;
    this.out = 0;
}
inherit(Enemy, Element);
//怪物绘画
Enemy.prototype.draw = function() {
    if (this.kill === false) {
        ctx.drawImage(this.img, this.x, this.y, this.size, this.size);
    } else {
        ctx.drawImage(this.boomImg, this.x, this.y, this.size, this.size);
    }
}
//怪物移动
Enemy.prototype.startmove = function() {
    var direction = this.direction;
    var speed = this.speed;
    var size = this.size;
    var enemyL = paddingL;
    var enemyR = canvas.width - this.size - paddingL;
    //方向检测
    switch(this.direction) {
        case 'right':
            if (this.x >= enemyR) {
                enemyAry.forEach(function(enemy) {
                    enemy.move(0, size)
                    enemy.direction = 'left';
                })
            }
            if (this.x <= enemyR) {
                this.move(speed, 0)
            }
            break;
        case 'left':
            if (this.x <= enemyL ) {
                enemyAry.forEach(function(enemy) {
                    enemy.move(0, size)
                    enemy.direction = 'right';
                })
            }
            if (this.x >= enemyL) {
                this.move(-speed, 0)
            }
            break;
    }
}
//怪物爆炸
Enemy.prototype.boom = function() {
    if (this.kill) {
        this.out++;
        for(var e in enemyAry) {
            if (enemyAry[e].out > 20) {
                enemyAry.splice(e, 1)
            }
        }
    }
}
//怪物碰撞
Enemy.prototype.up = function() {
    if (this.y >= 470) {
        failed = true;
    }
}

/**
 * 子弹
 * @param {[type]} opts [description]
 */
function Bullet(opts) {
    Element.call(this, opts);
    this.x = opts.axisX;
    this.y = opts.axisY;
    this.id = bulletID++;
    this.up = bulletUP;
}
inherit(Bullet, Element);
//子弹绘画
Bullet.prototype.draw = function() {
    switch(this.up) {
        case false:
            ctx.beginPath();
            ctx.strokeStyle = '#fff';
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + 10);
            ctx.closePath();
            ctx.stroke();
            break;
        case true:
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI *2)
            ctx.closePath();
            ctx.fill();
            break;
    }
}

//子弹移动判断
Bullet.prototype.startmove = function() {
    var speed = this.speed;
    var enemyFirst = enemyAry[enemyAry.length - 1];
    var pos = speed / 2;
    var neg = -speed / 2;
    var trackL = this.x >= enemyFirst.x +20;
    var trackR = this.x <= enemyFirst.x + 20;
    //子弹状态
    switch (this.up) {
        case false:
            this.move(0, -speed);
            break;
        case true:
            if (this.y <= 470) {
                if (this.y >= enemyFirst.y) {
                    if (trackL) {
                        this.move(neg, neg)
                    } else if (trackR) {
                        this.move(pos, neg)
                    } else {
                        this.move(0, neg)
                    }
                }
                if (this.y <= enemyFirst.y) {
                        this.move(0, neg)
                }
            } else {
                this.move(0, -speed);
            }
            break;
    }
    //子弹消失
    if (this.y <= paddingL) {
        this.pass();
    }
    //碰撞检测
    if (enemyAry.length !== 0) {
        for(var e in enemyAry) {
            if (this.x >= enemyAry[e].x &&
                this.x <= enemyAry[e].x + 50 &&
                this.y <= enemyAry[e].y + 30 &&
                this.y >= enemyAry[e].y &&
                enemyAry[e].kill === false) {
                enemyAry[e].kill = true;
                fraction ++;
                this.pass();
            }
        }
    }
}
//子弹消失
Bullet.prototype.pass = function () {
    for (var i = 0; i < bulletAry.length; i++) {
        if (this.id === bulletAry[i].id) {
            bulletAry.splice(i, 1)
        }
    }
}

/**
 * 怪物生成
 * @return {[type]} [description]
 */
function createEnemy() {
    for (var i = 0; i < CONFIG.level * CONFIG.numPerLine ; i++) {
        enemyAry.push(new Enemy(ENEMY));
        enemyX += ENEMY.gap + ENEMY.size;
        if (i%7 === 6) {
            enemyX = enemyAry[0].x;
            enemyY += enemyAry[0].size;
        }
    }
}

/**
 * 事件绑定
 * @return {[type]} [description]
 */
function keyEvent() {
    document.addEventListener('keydown', function(e) {
        var code = e.keyCode;
        if (code === 37 || code === 65) {
            keyLeft = true;
            keyRight = false;
        }
        if (code === 39 || code === 68) {
            keyLeft = false;
            keyRight = true;
        }
        if (code === 32 || code === 96) {
            keySpace = true;
        }
    })

    document.addEventListener('keyup', function(e) {
        var code = e.keyCode;
        if (code === 37 || code === 65) {
            keyLeft = false;
        }
        if (code === 39 || code === 68) {
            keyRight = false;
        }
        if (code === 32 || code === 96) {
            keySpace = false;
        }
    })
}

/**
 * 清除
 * @return {[type]} [description]
 */
function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

/**
 * 分数
 * @return {[type]} [description]
 */
function fractionText() {
    ctx.fillStyle = '#fff'
    ctx.font = '18px Arial';
    ctx.fillText('分数：' + fraction, 20, 40);
}

/**
 * 重置
 * @return {[type]} [description]
 */
function reset() {
    enemyX = 150;
    enemyY = paddingL;
    enemyAry = [];
    keyLeft = false;
    keyRight = false;
    keySpace = false;
    plane = new Plane(PLANE);
    bulletAry = [];
    bulletX = 300;
    bulletID = 0;
}

/**
 * 动画
 * @return {[type]} [description]
 */
function animate() {
    if (enemyAry.length !== 0) {
        plane.shoot();
        bulletAry.forEach(function(bullet) {
            bullet.startmove();
        })
        enemyAry.forEach(function (enemy) {
            enemy.boom();
            enemy.startmove();
            enemy.up();
        })
        plane.key();
        fractionText();
        clear();
        fractionText();
        enemyAry.forEach(function (enemy) {
            enemy.draw();
        })
        bulletAry.forEach(function(bullet) {
            bullet.draw();
        })
        plane.draw();
        requestAnimationFrame(animate);
        //胜负
        if (failed) {
            cancelAnimationFrame(animate);
            clear();
            failed = false;
            enemyAry = [];
            CONFIG.status = 'failed';
            CONFIG.level = 1;
            GAME.failed();
            return;
        } else if (enemyAry.length === 0 && failed === false) {
            cancelAnimationFrame(animate);
            clear();
            if (CONFIG.level < 6) {
                CONFIG.status = 'success';
                GAME.success();
                fraction ++;
                return;
            } else if (CONFIG.level === 6) {
                CONFIG.status = 'all-success';
                GAME.allSuccess();
                return;
            }
        }
    }
}