// 元素
var container = document.getElementById('game');
    infoText = document.querySelector('.game-next-level'),
    score = document.querySelector('.score');

/**
 * 整个游戏对象
 */
var GAME = {
  /**
   * 初始化函数,这个函数只执行一次
   * @param  {object} opts
   * @return {[type]}      [description]
   */
  init: function(opts) {
    this.status = 'start';
    this.bindEvent();
    keyEvent();//事件绑定
  },
  bindEvent: function() {
    var self = this;
    var playBtn = document.querySelector('.js-play');
    var replyBtn = document.querySelectorAll('.js-replay');
    var nextBtn = document.querySelector('.js-next');
    // 开始游戏按钮绑定
    playBtn.onclick = function() {
      CONFIG.status = 'playing';
      self.play();
    };
    replyBtn.forEach(function (reply) {
      reply.onclick = function () {
        CONFIG.status = 'playing';
        fraction = 0;
        self.play();
      }
    })
    nextBtn.onclick = function () {
      CONFIG.status = 'playing';
      self.play();
    }
  },
  /**
   * 更新游戏状态，分别有以下几种状态：
   * start  游戏前
   * playing 游戏中
   * failed 游戏失败
   * success 游戏成功
   * all-success 游戏通过
   * stop 游戏暂停（可选）
   */
  setStatus: function(status) {
    this.status = status;
    container.setAttribute("data-status", status);
  },
  play: function() {
    this.setStatus(CONFIG.status);
    reset();
    createEnemy();
    animate();
  },
  failed: function() {
    this.setStatus(CONFIG.status);
    score.innerHTML = fraction;
  },
  success: function() {
    this.setStatus(CONFIG.status);
    CONFIG.level += 1;
    infoText.innerHTML = '下一个Level：' + CONFIG.level;
  },
  allSuccess: function() {
    this.setStatus(CONFIG.status);
    CONFIG.level = 1;
  }
};


// 初始化
GAME.init();
