// pages/movies/more-movie/more-movie.js
var app = getApp()
var utils = require('../../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: {},
    requestUrl: "",
    totalCount: 0,
    isEmpty: true,
    isLoading: false
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
    switch (navigationTitle) {
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
    this.data.requestUrl = categoryUrl
    utils.http(categoryUrl, this.processDoubanMovies)
  },

  onScrollToLower: function (event) {
    if(this.data.isLoading) {
      return
    }
    console.log("加载更多")
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20"
    utils.http(nextUrl, this.processDoubanMovies)
    this.data.isLoading = true
    wx.showNavigationBarLoading()
  },

  processDoubanMovies: function (moviesData) {
    var movies = []
    var totalMovies = []
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

    if(!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies
      this.data.isEmpty = false
    }

    this.setData({ movies: totalMovies })
    this.data.totalCount += 20
    this.data.isLoading = false
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onPullDownRefresh: function () {
    console.log("刷新")
    var refreshUrl = this.data.requestUrl + "?start=0&count=20"
    this.data.isEmpty = true
    this.data.movies = {}
    utils.http(nextUrl, this.processDoubanMovies)
    wx.showNavigationBarLoading()
  }
})