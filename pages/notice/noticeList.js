Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: '',
      success: function (res) {
        console.log(res.data)
        that.setData({
          noticeList: res.data
        })
      }
    })
  },
  onShow: function () {

  },
})