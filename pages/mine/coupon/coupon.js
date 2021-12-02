// pages/mine/coupon/coupon.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input_couponid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (app.globalData.iflogin == false){
      wx.showModal({
        title: '提示',
        content: '您还未绑定默认信息，请返回"我的"页面进行信息绑定',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          }
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getinputcode: function (e) {
    this.setData({
      input_couponid: e.detail.value
    })
  },
  getCounponByPwd: function() {
    var that = this
    wx.request({
      url: '',
      data: {
        useropenid: app.globalData.openid,
        couponstr: that.data.input_couponid
      },
      success: function (res) {
        if(res.data == 'success'){
          wx.showModal({
            title: '成功',
            content: '卡券领取成功，下单可立减',
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/mine/mine',
                })
              }
            }
          })
        }else{
          wx.showModal({
            title: '失败',
            content: res.data
          })
        }
      }
    })
  }
})