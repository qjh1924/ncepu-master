var app = getApp();
var util = require('../../../utils/util.js')
Page({
  data: {
    list: [],
    imgs: [],
    loadingHidden: false,
    commentslist: [],
    lastid: -1, //记录上一个打开的
    ifchatplanet: true,
    parttimejob: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    //加载最新
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
    }else{
      that.requestData();
    }
    
  },

  /**
   * 上拉刷新
   */
  bindscrolltoupper: function () {
    //加载最新
    // this.requestData('newlist');
  },

  /**
   * 加载更多
   */
  bindscrolltolower: function () {
    console.log('到底部')
    //加载更多
    //this.requestData('list');
  },

  /**
   * 请求数据
   */
  requestData: function () {
    var that = this;
    console.log(that.data.maxtime)
    wx.request({
      url: '',
      data: {
        id: app.globalData.openid
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          // 拼接数组
          list: res.data,
          loadingHidden: true,
        })
      }
    })
  },
  comment: function (e) {
    if (this.data.lastid == -1) {
      var that = this
      let index = e.currentTarget.dataset.vel
      that.setData({
        lastid: index
      })
      let temp = 'list[' + index + ']' + '.pinglunflag'
      that.setData({
        [temp]: true
      })
      wx.request({
        url: '' + e.currentTarget.dataset.val,
        success: function (res) {
          console.log(res)
          that.setData({
            commentslist: res.data
          })
        }
      })
    }
    else {
      var that = this
      let id = that.data.lastid
      let index = e.currentTarget.dataset.vel
      if (id == index) {
        let temp = 'list[' + index + ']' + '.pinglunflag'
        that.setData({
          [temp]: true,
          lastid: index
        })
        wx.request({
          url: '' + e.currentTarget.dataset.val,
          success: function (res) {
            console.log(res)
            that.setData({
              commentslist: res.data
            })
          }
        })
      }
      else {
        let temp = 'list[' + index + ']' + '.pinglunflag'
        let lastone = 'list[' + id + ']' + '.pinglunflag'
        that.setData({
          [temp]: true,
          [lastone]: false,
          lastid: index
        })
        wx.request({
          url: '' + e.currentTarget.dataset.val,
          success: function (res) {
            console.log(res)
            that.setData({
              commentslist: res.data
            })
          }
        })
      }
    }
  },
  closecomment: function (e) {
    var that = this
    var index = e.currentTarget.dataset.vel
    var temp = 'list[' + index + ']' + '.pinglunflag'
    that.setData({
      [temp]: false
    })
  },
  deletepost: function (e) {
    var that = this
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '确定删除此条帖子吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: '' + e.currentTarget.dataset.val,
            success: function () {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              that.requestData()
            },
            fail: function () {
              wx.showToast({
                title: '网络存在问题',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
        else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  deletejobinfo: function (e) {
    var that = this
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '确定删除此条帖子吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: '' + e.currentTarget.dataset.val,
            success: function () {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              that.requestData()
            },
            fail: function () {
              wx.showToast({
                title: '网络存在问题',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
        else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  openxyhz: function () {
    this.setData({
      ifchatplanet: false
    })
  },
  opentcxq: function() {
    this.setData({
      ifchatplanet: true
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})