var util = require('../../utils/util.js')
var app = getApp();
Page({
  data: {
    hideEmptyCar: false,
    order_no: '',
    ordergoods: [],
    orderInfo:[],
    orderNum:[],
    totalprice:0,
    hiddenmodalput: true,
    useraddress:'',
    userphonenum:'',
    confirmpay: {},
    ifdelivery: true,
    deliverymethod: [
      {value: '1', name: '宿舍自取', checked: 'true'},
      {value: '0', name: '专人配送'},
    ],
    hiddenconfirmpay: true,
    deliveryinfo: {consignee: '',consignee_phonenum: '',consignee_add: '',addnote: ''},
    ifdeliveryfree: false,
    deliveryfee: 0,
    deliverythreshold: 0,
    delivery_type: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      deliveryfee: app.globalData.deliveryfee,
      deliverythreshold: app.globalData.deliverythreshold
    })
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
    var that = this
    if (app.globalData.orderitem.length != 0) {
      that.setData({
        orderInfo: app.globalData.orderitem,
        orderNum: app.globalData.ordernum,
        hideEmptyCar: true
      })
    }
    else {
      that.setData({
        hideEmptyCar: false
      })
    }
    that.caltotalprice()
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
  testlogin: function(){
    var that = this
    wx.request({
      url: '' + app.globalData.openid,
      success: function (res) {
        if (res.data.ifsignup == "true"){
          that.setData({
            iflogin: true
          })
          app.globalData.iflogin = true
          app.globalData.username = res.data.nickname
          app.globalData.userphonenum = res.data.pnum
          app.globalData.useraddress = res.data.add
        }
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },
  onPullDownRefresh: function () {
    this.onLoad()
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function() {
    return {
      title: '快来和我一起体验吧~',
      path: '/pages/index/index'
    }
  },
  onShareTimeline: function(){
    return {
      title: '发现了一个很好的小程序，一起来体验吧~'
    }
  },
  delecurrentgood: function(e){
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定不要我了吗o(＞﹏＜)o',
      success(res) {
        if (res.confirm) {
          var newarry = that.data.orderInfo;
          var newnum = that.data.orderNum;
          newarry.splice(e.currentTarget.dataset.index, 1);
          newnum.splice(e.currentTarget.dataset.index, 1);
          app.globalData.orderitem = newarry
          app.globalData.ordernum = newnum
          that.setData({
            orderInfo: newarry,
            orderNum: newnum,
          })
          that.caltotalprice()
        }
      }
    })
  },
  jianBtnTap: function(e){
    if (this.data.orderNum[e.target.dataset.index] == 1) {
      var that = this;
      wx.showModal({
        title: '提示',
        content: '确定不要我了吗o(＞﹏＜)o',
        success(res) {
          if (res.confirm) {
            var newarry = that.data.orderInfo;
            var newnum = that.data.orderNum;
            newarry.splice(e.target.dataset.index, 1);
            newnum.splice(e.target.dataset.index, 1);
            that.setData({
              orderInfo: newarry,
              orderNum: newnum,
            })
            that.caltotalprice()
          }
        }
      })
    }
    if (this.data.orderNum[e.target.dataset.index] > 1){
      let index = e.target.dataset.index
      let temp = 'orderNum[' + index + ']'
      this.setData({
        [temp] : this.data.orderNum[index] - 1
      })
    }
    this.caltotalprice()
  },
  jiaBtnTap: function(e) {
    let index = e.target.dataset.index
    let temp = 'orderNum[' + index + ']'
    this.setData({
      [temp]: this.data.orderNum[index] + 1
    })
    this.caltotalprice()
  },
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },
  caltotalprice: function(){
    var that = this
    let sum = 0
    for(let i=0;i<this.data.orderInfo.length;i++){
      sum = sum + this.data.orderInfo[i].price * this.data.orderNum[i]
    }
    this.setData({
      totalprice: Math.round(sum * 100) / 100
    })
    if(that.data.delivery_type && that.data.orderInfo.length != 0 && that.data.totalprice < that.data.deliverythreshold){
      that.setData({
        totalprice: that.data.totalprice + that.data.deliveryfee,
        ifdeliveryfree: false
      })
    }else{
      that.setData({
        ifdeliveryfree: true
      })
    }
  },
  payment: function(){
    var that = this
    if (app.globalData.iflogin == false){
      wx.showModal({
        title: '提示',
        content: '您还未绑定默认收货信息，请返回"我的"页面进行信息绑定',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          }
        }
      })
    }
    else {
      if (this.data.orderInfo.length == 0)
      {
      wx.showModal({
        title: '提示',
        content: '购物车空空如也，去逛逛吧',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    }
    else{
      that.setData({
        'deliveryinfo.consignee': app.globalData.username,
        'deliveryinfo.consignee_add': app.globalData.useraddress,
        'deliveryinfo.consignee_phonenum': app.globalData.userphonenum,
        hiddenmodalput: false
      })
    }
  }
},
  cancelOrder:function(){
    this.setData({
      hiddenmodalput: true
    })
  },
  confirmOrder:function(){
    var that=this
    if (that.data.ifdelivery){
      if (that.data.deliveryinfo.consignee == ''){
        wx.showToast({
          title: '未填写收货人！',
          icon: 'none',
          duration: 2000
        })
      }
      else if (that.data.deliveryinfo.consignee_phonenum.length != 11){
        wx.showToast({
          title: '电话号码格式错误！',
          icon: 'none',
          duration: 2000
        })
      }
      else if (that.data.deliveryinfo.consignee_add == ''){
        wx.showToast({
          title: '未填写收货地址！',
          icon: 'none',
          duration: 2000
        })
      }
      else{
        that.setData({
          hiddenconfirmpay: false
        })
      }
    }
    else{
      if (that.data.useraddress == ''){
        wx.showToast({
          title: '未填写宿舍号！',
          icon: 'none',
          duration: 2000
        })
      }
      else if (that.data.userphonenum.length != 11){
        wx.showToast({
          title: '电话号码格式错误！',
          icon: 'none',
          duration: 2000
        })
      }
      else{
        that.setData({
          hiddenconfirmpay: false
        })
      }
    }
  },
  cancelPayment:function(){
    this.setData({
      hiddenconfirmpay: true
    })
  },
  checkinventory: function(){
    var that = this
    for (let i = 0; i < that.data.orderInfo.length; i++){
      if(that.data.orderNum[i] > that.data.orderInfo[i].inventory){
        return false
      }
    }
    return true
  },
  confirmPayment:function(){
    var that = this
    var goods = []
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp)
    var Y = date.getFullYear()
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    var order_no = Y.toString()+M+D+hour+minute+second+Math.floor(Math.random()*899+100)
    for (let i = 0; i < that.data.orderInfo.length; i++){
      goods = goods.concat(that.data.orderInfo[i].id)
    }
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
        else{
          wx.request({
            url: '',
            success (res) {
              if(res.data=="ok"){
                that.setData({
                  ordergoods : goods,
                  order_no : order_no
                })
                wx.showLoading({
                  title: '正在发起支付',
                })
                that.createPreorder()
              }else{
                wx.showToast({
                  title: '抱歉'+that.data.orderInfo[res.data].name+'库存不够，请您重新下单！',
                  icon: 'none',
                  duration: 2500
                })
              }
            },
            fail() {
              wx.showToast({
                title: '网络故障，请您稍后重试',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      },
      fail() {
        wx.showToast({
          title: '网络故障，请您稍后重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
    
  },
  requestPayment: function(obj){
    var that=this;
    wx.requestPayment({
      'timeStamp': that.data.confirmpay.timeStamp,
      'nonceStr': that.data.confirmpay.nonceStr,
      'package': "prepay_id=" + that.data.confirmpay.package,
      'signType': "MD5",
      'paySign': that.data.confirmpay.paySign,
      success: function(res){
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '支付成功',
          showCancel: false,
          success () {
            if (wx.requestSubscribeMessage) {
              wx.requestSubscribeMessage({
                tmplIds: ["xxx"],
                success: function(res) {
                  wx.showToast({
                    title: '订阅成功！',
                  });
                },
                fail(err) {
                  wx.showToast({
                    title: '订阅失败！',
                  })
                }
              });
            }else{
              // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
              wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用订阅功能，请升级到最新微信版本后重试。'
              })
            }
          }
        })
        app.globalData.orderitem = []
        app.globalData.ordernum = []
        that.setData({
          orderInfo: [],
          orderNum: [],
          ordergoods: [],
          order_no: '',
          hideEmptyCar: false,
          totalprice: 0
        })
      },
      fail: function(res){
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '支付取消',
          showCancel: false
        })
      }
    })
  },
  createPreorder: function(){
    var that = this
    wx.request({
      url: '',
      method: "POST",
      data: {
        openid: app.globalData.openid,
        shangp: '['+that.data.ordergoods+']',
        shul: '['+that.data.orderNum+']',
        jin: that.data.totalprice,
        trade_no: that.data.order_no,
        type: that.data.delivery_type,
        shren: that.data.deliveryinfo.consignee,
        shdianhua: that.data.deliveryinfo.consignee_phonenum,
        shdizhi: that.data.deliveryinfo.consignee_add,
        beizhu: that.data.deliveryinfo.addnote,
        sushehao: that.data.useraddress,
        ssdianhua: that.data.userphonenum
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (e){
        if(e.data=="success"){
          wx.request({
            url: '',
            data: {
              out_trade_no: that.data.order_no,
              total_fee: that.data.totalprice,
              body: that.data.orderInfo[0].name + '等一件或多件商品',
              useropenid: app.globalData.openid,
            },
            success: (res) =>{
              if(res.data.code=='0'){
                that.setData({
                  confirmpay: res.data
                })
                that.requestPayment()
              }
              else{
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  title: '网络故障',
                })
              }
            }
          })
          that.setData({
            hiddenmodalput: true,
            hiddenconfirmpay: true
          })
        }
        else{
          wx.showModal({
            title: '预订单上传失败，请稍后重试',
          })
        }
      },
      fail: function (res) {
        that.createPreorder()
      }
    })
  },
  radioChange(e) {
    var that = this
    if(e.detail.value == '1'){
      that.setData({
        ifdelivery: false
      })
    }
    else{
      that.setData({
        ifdelivery: true
      })
    }
  },
  getdormitorynum: function(e){
    this.setData({
      useraddress : e.detail.value
    })
  },
  getuserphone: function(e){
    this.setData({
      userphonenum : e.detail.value
    })
  },
  getconsignee: function(e){
    this.setData({
      'deliveryinfo.consignee' : e.detail.value
    })
  },
  getconsignee_phonenum: function(e){
    this.setData({
      'deliveryinfo.consignee_phonenum' : e.detail.value
    })
  },
  getconsignee_add: function(e){
    this.setData({
      'deliveryinfo.consignee_add' : e.detail.value
    })
  },
  getaddnote: function(e){
    this.setData({
      'deliveryinfo.addnote' : e.detail.value
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
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      delivery_type : 1 - this.data.delivery_type
    })
    if(this.data.delivery_type == 0){
      this.setData({
        ifdeliveryfree : true
      })
    }else{
      this.setData({
        ifdeliveryfree : false
      })
    }
    this.caltotalprice()
  }
})
