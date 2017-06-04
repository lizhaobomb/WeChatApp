// post-detail.js
var postsData = require('../../../data/localDatabase.js')
var globalData = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlaying: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData,
    })

    if(postId == globalData.g_currentId) {
      this.setData({
        isPlaying: globalData.g_isPlaying
      })
    }

    this.data.postId = postId
    var postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {}
      postsCollected[postId] = false
      wx.setStorageSync('posts_collected', postsCollected)
    }

    var that = this
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlaying: true
      })
    })

    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlaying: false
      })
    })

    wx.onBackgroundAudioStop(function() {
      that.setData({
        isPlaying: false
      })
    })

    wx.getBackgroundAudioManager().onEnded(function () {
      that.setData({
        isPlaying: false
      })
    })

  },

  onCollectionTap: function () {
    var postsCollected = wx.getStorageSync('posts_collected')
    var postCollected = postsCollected[this.data.postId]
    postCollected = !postCollected
    postsCollected[this.data.postId] = postCollected
    wx.setStorageSync('posts_collected', postsCollected)
    this.setData({
      collected: postCollected
    })
    var title = postCollected ? '收藏成功' : '取消成功';
    wx.showToast({
      title: title
    })
  },

  onShareTap: function () {
    console.log('onShareTap')
    wx.showActionSheet({
      itemList: ['分享给微信好友', '分享到朋友圈', '分享到QQ', '分享到微博']
    })
  },

  onMusicTap: function () {
    if (this.data.isPlaying) {
      this.setData({
        isPlaying: false
      })
      wx.pauseBackgroundAudio()
    } else {
      this.setData({
        isPlaying: true
      })
      console.log(this.data.postData.music)
      wx.playBackgroundAudio(this.data.postData.music)
      // wx.playBackgroundAudio({
      //   dataUrl: this.postData.music.dataUrl,
      //   title: this.postData.music.title,
      //   coverImgUrl: this.postData.music.coverImgUrl
      // })

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
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if(this.data.isPlaying) {
      globalData.g_isPlaying = this.data.isPlaying
      globalData.g_currentId = this.data.postData.postId
    }
    
    console.log('onUnload')
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
})