var app = getApp();
Page({
  data:{
    hideShopPopup: true,
    buyNumber: 1,
    buyNumMin: 1,
    goodsDetail: {},
    goods: [],
    bannnerList: [],
    noticeList: [],
    categories: [],
    name: '',
    backTopValue: true
  },
  onLoad: function (){
    var that = this;
    wx.request({
      url: '',
      success: function (res) {
        that.setData({
          bannnerList: res.data
        })
      }
    })
    wx.request({
      url: '',
      success: function (res) {
        that.setData({
          noticeList: res.data
        })
      }
    })
    wx.request({
      url: '',
      success: function (res) {
        that.setData({
          categories: res.data
        })
      }
    })
    wx.request({
      url: '',
      success (res) {
        if(res.data){
          wx.showModal({
            title: "抱歉，打烊啦",
            content: res.data,
            confirmText: "知道了",
            showCancel: false,
          })
        }
      }
    })
  },
  onSwiperTap: function (event) {
    wx.navigateTo({
      url: '/pages/shouye/goodlist/list?id=' + event.target.dataset.category
    })
  },
  onShow: function (options) {
    var that = this;
    wx.request({
      url: '',
      success: function (res) {
        that.setData({
          goods: res.data
        })
      }
    })
  },
  f0: function(e){
    wx.navigateTo({
        url: '/pages/shouye/goodlist/list?id=' + e.currentTarget.dataset.val,
      })
  },
  addcart(e) {
    for (let i = 0; i < this.data.goods.length; i++) {
      if (this.data.goods[i].id == e.currentTarget.dataset.id) {
        this.setData({
          goodsDetail: this.data.goods[i],
          hideShopPopup: false,
        })
      }
    }
  },
  closePopupTap: function () {
    this.setData({
      hideShopPopup: true,
    })
  },
  numJianTap: function () {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
    else{
      wx.showToast({
        title: '不能再减啦~',
        icon: 'none',
      })
    }
  },
  numJiaTap: function () {
    var currentNum = this.data.buyNumber;
    currentNum++;
    this.setData({
      buyNumber: currentNum
    })
  },
  onPullDownRefresh: function () {
    this.onLoad()
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function() {
    return {
      title: '快来和我一起体验吧~',
      path: '/pages/shouye/shouye'
    }
  },
  onShareTimeline: function(){
    return {
      title: '发现了一个很好的小程序，一起来体验吧~'
    }
  },
  addShopCar: function() {
    var newarray = [this.data.goodsDetail];
    var buyNum = [this.data.buyNumber];
    if (this.data.buyNumber > this.data.goodsDetail.inventory){
      wx.showToast({
        title: '抱歉库存不足，我们会尽快补货',
        icon: 'none',
        duration: 2000
      })
    }
    else{
      for (let i = 0; i < app.globalData.orderitem.length; i++) {
        if (this.data.goodsDetail.id == app.globalData.orderitem[i].id) {
          app.globalData.ordernum[i] += this.data.buyNumber
          this.setData({
            duplication: true
          })
          break;
        }else if(i==app.globalData.orderitem.length-1){
          this.setData({
            duplication: false
          })
        }
      }
      if (!this.data.duplication) {
        app.globalData.orderitem = newarray.concat(app.globalData.orderitem)
        app.globalData.ordernum = buyNum.concat(app.globalData.ordernum)
      }
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 2000
      })
      this.setData({
        hideShopPopup: true,
        buyNumber: 1
      })
    }
  },
  showgoodpic:function(event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var piclist = [src]
    wx.previewImage({
      current: src,
      urls: piclist
    })
  },
  bindinput(e){
    this.setData({
      name: e.detail.value
    })
  },
  bindconfirm: function(e){
    wx.navigateTo({
      url: 'goodlist/list?name=' + e.detail.value,
    })
  },
  onPageScroll: function(e) {
    //console.log(e)
    var that = this
    var scrollTop = e.scrollTop
    var backTopValue = scrollTop > 500 ? false : true
    that.setData({
      backTopValue: backTopValue
    })
  },
  backTop: function() {
    // 控制滚动
    wx.pageScrollTo({
      scrollTop: 0
    })
  }
})
