var Swiper = require('../components/swiper/index');
Page({
  data: {
  },
  onLoad: function () {
    var that = this;
    var bannerData = [{
      url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      title: 'slider1'
    }, {
      url: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      title: 'slider2'
    }, {
      url: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
      title: 'slider3'
    }];
    var swiper = this.swiper = new Swiper(that, {
      data: bannerData,
      itemWidth: 600
    });
    this.swiperHandlerTouch = function (e) {
      swiper.swiperTouch(e, that);
    }
    this.swiperHandlerMove = function (e) {
      swiper.swiperMove(e, that);
    }
    this.swiperHandlerMoveEnd = function (e) {
      swiper.swiperMoveEnd(e, that);
    }
    this.setData({
      swiper: swiper
    })
  }
});
