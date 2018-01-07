/**
 * Element
 * @param {[obj]} opts [description]
 */
function Element(opts) {
    var opts = opts || {};
    this.size = opts.size;
    this.speed = opts.speed;
}
//移动方法
Element.prototype = {
    move: function (x, y) {
        this.x += x;
        this.y += y;
    }
}

//继承
function inherit(sub, sup) {
    var pro = Object.create(sup.prototype);
    pro.constructor = sub;
    sub.prototype = pro;
}
