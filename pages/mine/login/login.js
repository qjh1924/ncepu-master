//login.js
//获取应用实例
var app = getApp();
Page({
  data: {
    buidings: ['1号楼', '2号楼', '3号楼', '4号楼', '5号楼', '6号楼', '7A号楼', '7B号楼', '8A号楼', '8B号楼', '9号楼', '10号楼', '11号楼', '12号楼', '13号楼', '14号楼','15号楼','16号楼','教一','教二','教三','教四','教五','主楼','图书馆'],
    entrances: ['0单元', '1单元', '2单元', '3单元', '4单元', '5单元','6单元','A座/区','B座/区','C座/区','D座/区','E座','F座','G座'],
    remind: '加载中',
    help_status: false,
    userid_focus: false,
    passwd_focus: false,
    useradd: '',
    consignee: '',
    userphonenum: '',
    angle: 0,
    index1: 0,
    index2: 0,
    roomnum: ''
  },
  onLoad: function () {
    this.setData({
      consignee: app.globalData.username,
      useradd: app.globalData.useraddress,
      userphonenum: app.globalData.userphonenum
    })
    this.findplace()
  },
  findplace: function () {
  	var that = this
  	var combine = ''
  	for (var i = 0; i < that.data.buidings.length; i++) {
  		for (var j = 0; j < that.data.entrances.length; j++){
  			combine = that.data.buidings[i]+that.data.entrances[j]
  			if (app.globalData.useraddress.slice(0,-3) == combine){
  				that.setData({
  					index1: i,
  					index2: j,
  					roomnum: app.globalData.useraddress.slice(-3)
  				})
  				return;
  			}
  		}
  	}
  },
  onReady: function () {
    var _this = this;
    setTimeout(function () {
      _this.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (_this.data.angle !== angle) {
        _this.setData({
          angle: angle
        });
      }
    });
  },
  bindPickerChange1(e) {
    this.setData({
      index1: e.detail.value
    })
  },
  bindPickerChange2(e) {
    this.setData({
      index2: e.detail.value
    })
  },
  bind: function () {
    var that = this
    if (that.data.useradd.length != 3){
        wx.showToast({
          title: '房间号格式错误！',
          icon: 'none',
          duration: 1500
        })
      }
      else if (that.data.userphonenum.length != 11) {
        wx.showToast({
          title: '手机号格式错误！',
          icon: 'none',
          duration: 1500
        })
      }
      else if (that.data.consignee.length == '') {
        wx.showToast({
          title: '收货人姓名为空！',
          icon: 'none',
          duration: 1500
        })
      }
      else {
        if (!app.globalData.iflogin){
          wx.showModal({
            title: '确认',
            content: '为了更好的为您服务，请您再次确认输入的信息是否正确',
            success(res) {
              if (res.confirm) {
                wx.request({
                  url: '',
                  data: {
                    openid: app.globalData.openid,
                    username: that.data.consignee,
                    address: that.data.buidings[that.data.index1] + that.data.entrances[that.data.index2] + that.data.useradd,
                    phonenum: that.data.userphonenum,
                    avatar: ''
                  },
                  success: function (res) {
                    wx.showToast({
                      title: '信息绑定成功',
                      icon: 'success',
                      duration: 2000
                    })
                    setTimeout(function () {
                      wx.switchTab({
                        url: '/pages/mine/mine',
                      })
                    }, 1000)
                  },
                  fail: function(res) {
                    wx.showToast({
                      title: '网络存在问题',
                      icon: 'loading',
                      duration: 1000
                    })
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
        else{
          wx.showModal({
          title: '确认更改默认收货信息',
          content: '为了更好的为您服务，请您再次确认输入的信息是否正确',
          success(res) {
            if (res.confirm) {
              wx.request({
                url: '',
                data: {
                  openid: app.globalData.openid,
                  username: that.data.consignee,
                  address: that.data.buidings[that.data.index1] + that.data.entrances[that.data.index2] + that.data.useradd,
                  phonenum: that.data.userphonenum,
                },
                success: function (res) {
                  wx.showToast({
                    title: '信息修改成功',
                    icon: 'success',
                    duration: 1000
                  })
                  setTimeout(function () {
                    wx.switchTab({
                      url: '/pages/mine/mine',
                    })
                  }, 1000)
                },
                fail: function(res) {
                  wx.showToast({
                    title: '网络存在问题',
                    icon: 'loading',
                    duration: 2000
                  })
                }
              })
            }
          }
        })
      }
    }
  },
  useraddInput: function (e) {
    this.setData({
      useradd: e.detail.value
    });
  },
  consigneeInput:  function (e) {
    this.setData({
      consignee: e.detail.value
    });
  },
  userphonenumInput: function (e) {
    this.setData({
      userphonenum: e.detail.value
    });
  },
  inputFocus: function (e) {
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': true
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': true
      });
    }
  },
  inputBlur: function (e) {
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': false
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': false
      });
    }
  },
  tapHelp: function (e) {
    if (e.target.id == 'help') {
      this.hideHelp();
    }
  },
  showHelp: function (e) {
    this.setData({
      'help_status': true
    });
  },
  hideHelp: function (e) {
    this.setData({
      'help_status': false
    });
  }
});