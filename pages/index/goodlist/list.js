var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listType: 1, // 1为1个商品一行，2为2个商品一行    
    name: '', // 搜索关键词
    orderBy: 1, // 排序规则
    goods:[],
    hideShopPopup:true,
    goodsDetail: {},
    buyNumber: 1,
    buyNumMin: 1,
    duplication: false, //判断是否重复
    clickcounter: 0,
    ifhiddencategory: true,
    inner: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options.name){
      wx.request({
        url: '' + options.name,
        success: function (res) {
          that.setData({
            goods: res.data
          })
        }
      })
    }
    if (options.id){
      wx.request({
        url: '' + options.id,
        success: function (res) {
          that.setData({
            goods: res.data,
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  search(){
    var that = this
    wx.request({
      url: '' + that.data.name,
      success: function (res) {
        that.setData({
          goods: res.data
        })
      }
    })
  },

  changeShowType(){
    if (this.data.listType == 1) {
      this.setData({
        listType: 2
      })
    } else {
      this.setData({
        listType: 1
      })
    }
  },
  bindinput(e){
    this.setData({
      name: e.detail.value
    })
  },
  bindconfirm: function(e){
    this.setData({
      name: e.detail.value
    })
    this.search()
  },
  compare: function (property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value2 - value1;
    }
  },
  reversecompare: function (property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return  value1 - value2;
    }
  },
  filter1: function (e) {
    var that = this
    that.setData({
      orderBy: e.currentTarget.dataset.val,
      goods: that.data.goods.sort(this.compare("id"))
    })
  },
  filter2: function (e) {
    var that = this
    that.setData({
      orderBy: e.currentTarget.dataset.val,
      goods: that.data.goods.sort(this.compare("sales_volume"))
    })
  },
  filter3: function(e){
    var that = this
    if (that.data.clickcounter%2 == 0){
      that.setData({
        orderBy: e.currentTarget.dataset.val,
        goods : that.data.goods.sort(that.reversecompare("price")),
        clickcounter: that.data.clickcounter+1
      })
    }
    else{
      that.setData({
        orderBy: e.currentTarget.dataset.val,
        goods : that.data.goods.sort(that.compare("price")),
        clickcounter: that.data.clickcounter+1
      })
    }
  },
  addcart(e){
    for (let i = 0; i < this.data.goods.length; i++){
      if (this.data.goods[i].id == e.currentTarget.dataset.id) {
        this.setData({
          goodsDetail: this.data.goods[i],
          hideShopPopup: false,
        })
      }
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
      for (let i = 0; i < app.globalData.orderitem.length; ++i) {
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
  showgoodpic:function(event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var piclist = [src]
    wx.previewImage({
      current: src,
      urls: piclist
    })
  },
  qujiesuan:function(){
    wx.switchTab({
      url: '/pages/shop-cart/index'
    })
  }
})
