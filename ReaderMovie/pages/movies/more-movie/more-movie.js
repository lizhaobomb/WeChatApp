// pages/movies/more-movie/more-movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var navigationTitle = options.category
    wx.setNavigationBarTitle({
      title: navigationTitle
    })
  }
})