function Swiper(page, options) {
  var defaults = {
    data: null, //列表数据
    page: 1, // 默认开始页
    speed: 300, //滚动速度 
    autoplay: 3000, //自动滚动间隔时间(秒)
    loop: true //默认循环
  }
  var options = options || {};
  for (var def in defaults) {
    if (typeof options[def] === 'undefined') {
      options[def] = defaults[def];
    }
  }
  var winWidth = null;
  this.dp = 1;
  try {
    winWidth = wx.getSystemInfoSync().windowWidth;
    this.dp = 750 / winWidth;
  } catch (e) { };
  this.itemWidth = options.itemWidth || winWidth * this.dp || 0;
  this.translateX = 0;
  this.translateY = 0;
  this.options = options;
  this.data = options.data;
  this.dataLen = this.data.length;
  this.swiperLen = this.data.length;
  this.speed = 0;
  this.itemWidthPx = this.itemWidth / this.dp;
  this.index = this.options.page;
  this.init(page);
};
//触摸触发事件
Swiper.prototype.swiperTouch = function (e) {
  var touch = e.touches[0];
  this.swiperStartX = touch.clientX;
  this.startTranslateX = this.translateX;
  this.stopAutoPlay();
}
//触摸滑动事件
Swiper.prototype.swiperMove = function (e, page) {
  var touch = e.touches[0],
    x = touch.clientX - this.swiperStartX,
    swiperTotalWith = (this.swiperLen - 1) * this.itemWidthPx,
    moveX = this.startTranslateX + x;
  if (moveX >= 0) {
    var moveX = 0;
  } else if (-moveX >= swiperTotalWith) {
    moveX = -swiperTotalWith;
  }
  this.translateX = moveX;
  this.speed = 0;
  page.setData({
    swiper: this
  });
  this.stopAutoPlay();
}
//触摸结束事件
Swiper.prototype.swiperMoveEnd = function (e, page) {
  var that = this,
    touch = e.changedTouches[0],
    x = touch.clientX - this.swiperStartX;
  this.startTranslateX = this.translateX;
  if (this.swiperStartX > touch.clientX) {
    this.slideNext(page);
  } else {
    this.slidePrev(page);
  }
  setTimeout(function () {
    that.autoplay(page);
  }, that.options.speed)
}
Swiper.prototype.init = function (page) {
  this.translateX = -this.itemWidthPx * (this.index-1);
  if (this.options.loop) {
    var firstSlider = this.data[0],
      lastSlider = this.data[this.data.length - 1];
    this.data.unshift(lastSlider);
    this.data.push(firstSlider);
    this.translateX = -this.itemWidthPx * this.index;
  }
  this.swiperLen = this.data.length;
  page.setData({
    swiper: this
  });
  if (this.options.autoplay) {
    this.autoplay(page);
  }
}
//自动播放
Swiper.prototype.autoplay = function (page) {
  var that = this,
    autoplayDelay = this.options.autoplay;
  if (autoplayDelay) {
    this.startAutoPlay(page, autoplayDelay);
  }
}
//开始自动播放
Swiper.prototype.startAutoPlay = function (page, autoplayDelay) {
  var that = this;
  if (this.autoplayIntervalId) { return false; }
  this.autoplayIntervalId = setInterval(function () {
    that.slideNext(page);
  }, autoplayDelay)
}
//结束自动播放
Swiper.prototype.stopAutoPlay = function () {
  if (this.autoplayIntervalId) {
    clearInterval(this.autoplayIntervalId);
    this.autoplayIntervalId = null;
  }
}
//滑动到上一页
Swiper.prototype.slidePrev = function (page) {
  this.index--;
  if (this.index <= 0 && !this.options.loop) { return false; }
  if (this.options.loop && this.index <= 0) {
    this.fixLoop(page);
  }
  this.translateX = -this.itemWidthPx * (this.index-1);
  if(this.options.loop){
    this.translateX = -this.itemWidthPx * this.index;
  }
  this.speed = this.options.speed;
  page.setData({
    swiper: this
  });
}
//滑动到下一页
Swiper.prototype.slideNext = function (page) {
  this.speed = this.options.speed;
  this.index++;
  if (this.index > this.dataLen && !this.options.loop) { 
    if(this.options.autoplay) {
      return this.index = 0; 
    }
    return this.index = this.dataLen; 
  }
  if (this.options.loop && this.index >= (this.dataLen + 1)) {
    this.fixLoop(page);
  }
  this.translateX = -this.itemWidthPx * (this.index-1);
  if(this.options.loop){
    this.translateX = -this.itemWidthPx * this.index;
  }
  this.speed = this.options.speed;
  page.setData({
    swiper: this
  });
}
//自动循环处理第一页最后一页
Swiper.prototype.fixLoop = function (page) {
  var that = this;
  if (this.fixLoopTimeId) {
    clearTimeout(this.fixLoopTimeId)
    this.fixLoopTimeId = null;
  }
  if (this.index <= 0) {//如果第一页往前翻,动画结束后滚动到-(容器宽度*数据总数)
    this.fixLoopTimeId = setTimeout(function () {
      that.translateX = -that.itemWidthPx * that.dataLen;
      that.index = that.dataLen;
      that.speed = 0;
      that.stopAutoPlay();
      page.setData({
        swiper: that
      });
      that.autoplay(page);
    }, that.options.speed)
  } else {//如果最后一页往后翻,动画结束后滚动到-容器宽度
    this.fixLoopTimeId = setTimeout(function () {
      that.translateX = -that.itemWidthPx;
      that.index = 1;
      that.speed = 0;
      page.setData({
        swiper: that
      });
      that.autoplay(page);
    }, that.options.speed)
  }
}

module.exports = Swiper;