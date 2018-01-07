var CONFIG = {
  status: 'start', // 游戏开始默认为开始中
  level: 1, // 游戏默认等级
  totalLevel: 6, // 总共6关
  numPerLine: 7, // 游戏默认每行多少个怪兽
  canvasPadding: 30 // 默认画布的间隔
};

var BULLET = {
  size: 10, // 默认子弹长度
  speed: 10, // 默认子弹的移动速度
  axisY: 470 //默认子弹高度位置
};

var ENEMY = {
  speed: 2, // 默认敌人移动距离
  size: 50, // 默认敌人的尺寸
  gap: 10,  // 默认敌人之间的间距
  Icon: './img/enemy.png', // 怪兽的图像
  boomIcon: './img/boom.png', // 怪兽死亡的图像
  direction: 'right' // 默认敌人一开始往右移动

};

var PLANE = {
  speed: 5, // 默认飞机每一步移动的距离
  size: {
    width: 60,
    height: 100
  }, // 默认飞机的尺寸,
  Icon: './img/plane.png'
};
