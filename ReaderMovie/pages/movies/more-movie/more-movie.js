// pages/movies/more-movie/more-movie.js
var app = getApp()
var utils = require('../../../utils/utils.js')
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
    //即将上映，top250
    var categoryUrl = ""
    switch(navigationTitle) {
      case '正在热映':
        categoryUrl = app.globalData.doubanBase + "/v2/movie/in_theaters"
      break
      case '即将上映':
        categoryUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" 
        break
      case 'top250':
        categoryUrl = app.globalData.doubanBase + "/v2/movie/top250" 
        break
    }
    
    utils.http(categoryUrl, this.processDoubanMovies)
  },
  processDoubanMovies: function (moviesData) {
    var movies = []
    for (var idx in moviesData.subjects) {
      var subject = moviesData.subjects[idx]
      var title = subject.title
      if (title.length > 7) {
        title = title.substring(0, 7) + "..."
      }
      var temp = {
        stars: utils.convertToStarArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    this.setData({movies:movies})
  }
})