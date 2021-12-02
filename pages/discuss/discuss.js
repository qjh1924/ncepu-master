var app = getApp();
var util = require('../../utils/util.js')
Page({
  data: {
    list: [],
    imgs: [],
    loadingHidden: false,
    commentslist: [],
    lastid: -1, //记录上一个打开的
    pingluntext: '',
    sayingtext: '',
    hiddenmodalinput: true,
    ifcheck: false
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
              url: '/pages/index/index',
            })
          }
        }
      })
    }else{
      that.requestData('newlist');
    }
  },
  onPullDownRefresh: function () {
    this.onLoad()
    wx.stopPullDownRefresh()
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
    //加载更多
    this.requestData('list');
  },

  /**
   * 请求数据
   */
  requestData: function (a) {
    var that = this;
    wx.request({
      url: '',
      success: function (res) {
        console.log(res)
        that.setData({
          // 拼接数组
          list: res.data,
          loadingHidden: true,
        })
      }
    })
  },
  dianzan: function (e) {
    var that = this
    let index = e.currentTarget.dataset.vel
    if (that.data.list[index].caiflag) {
      wx.showToast({
        title: '您已踩过',
        icon: 'none',
        duration: 1000
      })
    }
    else{
    let temp = 'list[' + index + ']' + '.zans'
    let temp1 = 'list[' + index + ']' + '.dianzanflag'
    wx.request({
      url: '' + e.currentTarget.dataset.val,
      success: function (res) {
        that.setData({
          [temp]: that.data.list[index].zans + 1,
          [temp1]: true
        })
      }
    })
    }
  },
  cai: function (e) {
    var that = this
    let index = e.currentTarget.dataset.vel
    if (that.data.list[index].dianzanflag) {
      wx.showToast({
        title: '您已赞过',
        icon: 'none',
        duration: 1000
      })
    }
    else{
    let temp = 'list[' + index + ']' + '.cais'
    let temp1 = 'list[' + index + ']' + '.caiflag'
    wx.request({
      url: '' + e.currentTarget.dataset.val,
      success: function (res) {
        that.setData({
          [temp]: that.data.list[index].cais + 1,
          [temp1]: true
        })
      }
    })
    }
  },
  comment: function (e) {
    if (this.data.lastid == -1){
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
          that.setData({
            commentslist: res.data
          })
        }
      })
    }
    else{
      var that = this
      let id = that.data.lastid
      let index = e.currentTarget.dataset.vel
      if (id == index){
        let temp = 'list[' + index + ']' + '.pinglunflag'
        that.setData({
          [temp]: true,
          lastid: index
        })
        wx.request({
          url: '' + e.currentTarget.dataset.val,
          success: function (res) {
            that.setData({
              commentslist: res.data
            })
          }
        })
      }
      else{
    let temp = 'list[' + index + ']' + '.pinglunflag'
    let lastone = 'list[' + id + ']' + '.pinglunflag'
    that.setData({
      [temp]: true,
      [lastone]: false,
      lastid: index
    })
    wx.request({
      url: '' + e.currentTarget.dataset.val,
      success: function(res){
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

  getcommenttext: function (e) {
    this.setData({
      pingluntext: e.detail.value
    })
  },
  
  getsayingtext: function (e) {
    this.setData({
      sayingtext: e.detail.value
    })
  },

  submit: function (e) {
    var that = this
    let index = e.currentTarget.dataset.vel
    let temp = 'list[' + index + ']' + '.pingluns'
    if (this.data.pingluntext == '') {
      wx.showModal({
        title: '提示',
        content: '评论内容为空',
      })
    }
    else if (app.globalData.openid == null) {
      wx.showModal({
        title: '提示',
        content: '您还未登录，请返回"我的"页面进行微信登录',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    }
    else if (!app.globalData.iflogin) {
      wx.showModal({
        title: '提示',
        content: '您还未绑定个人信息，请返回"我的"页面绑定信息',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    }
    else {
      var dayTime = util.formatTime(new Date())
      wx.request({
        url: '',
        data: {
          cpid: e.currentTarget.dataset.val,
          openid: app.globalData.openid,
          content: that.data.pingluntext,
          shijian: dayTime
        },
        success: function () {
          wx.showToast({
            title: '评论成功',
            duration: 2000
          })
          that.setData({
            [temp]: that.data.list[index].pingluns + 1,
            pingluntext: ''
          })
          wx.request({
            url: '' + e.currentTarget.dataset.val,
            success: function (res) {
              that.setData({
                commentslist: res.data
              })
            }
          })
        },
        fail: function (res) {
          wx.showToast({
            title: '网络存在问题',
            icon: 'loading',
            duration: 2000
          })
        }
      })
    }
  },
  // 上传图片
  chooseImg: function (e) {
    var that = this;
    var imgs = this.data.imgs;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          imgs: tempFilePaths
        })
      }
    });
  },
  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs
    });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  saysomething: function () {
    if (app.globalData.openid == null) {
      wx.showModal({
        title: '提示',
        content: '您还未登录，请返回"我的"页面进行微信登录',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    }
    else if (!app.globalData.iflogin) {
      wx.showModal({
        title: '提示',
        content: '您还未绑定个人信息，请返回"我的"页面绑定信息',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    }
    else {
      this.setData({
        hiddenmodalinput: false
      })
    }
  },
  cancelM: function () {
    this.setData({
      hiddenmodalinput: true
    })
  },
  confirmM: function () {
    var that = this
    if (app.globalData.openid == null){
      wx.showModal({
        title: '提示',
        content: '您还未登录，请返回"我的"页面进行微信登录',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    }
    else if (that.data.imgs.length==0 && that.data.sayingtext=='')
    {
      wx.showToast({
        title: '输入内容为空',
        icon: 'none',
        duration: 2000
      })
    }
    else if (!this.data.ifcheck) {
      wx.showToast({
        title: '请阅读并同意评论区文明发帖及违规处理规则',
        icon: 'none',
        duration: 2000
      })
    }
    else {
      var dayTime = util.formatTime(new Date())
      wx.request({
        url: '',
        data: {
          openid: app.globalData.openid,
          timestamp: dayTime,
          content: that.data.sayingtext,
          zan: 0,
          cai: 0,
          comment: 0
        },
        success: function (res) {
          if (that.data.imgs.length != 0){
            wx.uploadFile({
              url: ''+res.data,
              filePath: that.data.imgs[0],
              name: 'file1',
              success: function (info) {
                if (info.data[5] == '败'){
                  wx.showModal({
                    title: '图片上传失败',
                    content: info.data
                  })
                  wx.request({
                    url: ''+res.data,
                  })
                }
                else{
                  wx.showModal({
                    title: '成功',
                    content: '已提交至后台人工审核',
                  })
                  that.setData({
                    imgs: [],
                    hiddenmodalinput: true,
                  })
                  that.requestData()
                }
              },
              fail: function () {
                wx.showToast({
                  title: '网络存在问题',
                  icon: 'loading',
                  duration: 2000
                })
              }
            })
          }
          else{
            wx.showModal({
              title: '成功',
              content: '已提交至后台人工审核',
            })
            that.setData({
              hiddenmodalinput: true,
            })
            that.requestData()
          }
        },
        fail: function () {
          wx.showToast({
            title: '网络存在问题',
            icon: 'loading',
            duration: 2000
          })
        }
      })
    }
  },
  guifan: function () {
    wx.showModal({
      title: '文明发帖及违规处理规则',
      content: '本平台所有会员发布的言论不得违反《计算机信息网络国际联网安全保护管理办法》、《互联网信息服务管理办法》、《互联网电子公告服务管理规定》、《维护互联网安全的决定》、《互联网新闻信息服务管理规定》等相关法律规定。不得在本平台发布、传播或以其它方式传送含有下列内容之一的信息:1、反对宪法所确定的基本原则的。2、危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的。3、损害国家荣誉和利益的。4、煽动民族仇恨、民族歧视、破坏民族团结的。5、破坏国家宗教政策，宣扬邪教和封建迷信的。6、散布谣言，扰乱社会秩序，破坏社会稳定的。7、散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的。8、侮辱或者诽谤他人，侵害他人合法权利的。9、煽动非法集会、结社、游行、示威、聚众扰乱社会秩序的。10、以非法民间组织名义活动的。11、含有虚假、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、或其它道德上令人反感的内容。12、含有中国法律、法规、规章、条例以及任何具有法律效力之规范所限制或禁止的其它内容的。13、含有广告信息等。勾选即视为您已知晓并同意上述规定。我们将对贴文进行人工审核，如有上述违规发帖，本平台将做删除处理，并对帐号进行禁言或永久封禁处理，并保留追加处理的权利。',
    })
  },
  radioChange: function (e) {
    this.setData({
      ifcheck: e.detail.value
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