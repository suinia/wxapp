var apiUrls = require('../../services/api_urls.js'),
    html2json = require('../components/html-parse/html2json/html2json.js'),
    request = require('../../services/index.js');

Page({
    data: {
        htmlParseImageStyle: {}//存储图片样式
    },
    htmlParseLinkTab: function (e) {//富文本链接点击事件
        var url = e.currentTarget.dataset.src;
        wx.showModal({
            title: '这是一个外部链接',
            content: '链接地址: ' + url
        })
    },
    htmlParseImageTab: function (e) {//富文图片点击预览
        var url = e.currentTarget.dataset.src,
            urls = [];
        for (var p in this.data.htmlParseImageStyle) {
            urls.push(p)
        }
        wx.previewImage({
            current: url,
            urls: urls
        });
    },
	htmlParseImageLoad: function(e){//富文图片满屏适配
		var id = e.currentTarget.dataset.src,
			img_w = e.detail.width,
			img_h = e.detail.height,
			ratio = 690/img_w;
		if(img_w/this.dp>=690){
			var imageStyle = 'width: 690rpx; height:'+ img_h*ratio +'rpx;';
		}else{
			var imageStyle = 'width: '+img_w+'px; height:'+ img_h +'px;';
		}
		var htmlParseImageStyle = this.data.htmlParseImageStyle;
		htmlParseImageStyle[id] = imageStyle;
		this.setData({
			htmlParseImageStyle: htmlParseImageStyle
		});
	},
    htmlEscape: function (html) {
        return html.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    },
    onLoad: function (options) {
        var winWidth = null, dp = 1;
		try {var winWidth = wx.getSystemInfoSync().windowWidth;
		} catch (e) { };
		if(winWidth){
			dp = winWidth/750;
		}
        this.dp = dp;
        var type = options.type,
            self = this;
        if (type == 'json') {
            request.get(apiUrls.getTopic, {
                id: '1'
            }).then(function (res) {
                self.setData({
                    topic: res
                })
            });
            return false;
        }
        if (type == 'html') {
            request.get(apiUrls.getHtmlTopic, {
                id: '1'
            }).then(function (res) {
                res.json_content = res.json_content.replace(/\\n/g, '\n');
                res.json_content = JSON.stringify(html2json(res.json_content));
                res.json_content = JSON.parse(self.htmlEscape(res.json_content));
                self.setData({
                    topic: res,
                })
            });
            return false;
        }
    }
})