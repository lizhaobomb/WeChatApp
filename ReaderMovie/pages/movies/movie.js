// movie.js

var app = getApp()
var util = require('../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    searchPanelShow: false,
    moviePanelShow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var query = "?start=0&count=3"
    var in_theatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + query
    var coming_soonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + query
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + query

    this.getMovieListData(in_theatersUrl, "inTheaters", "正在热映")
    this.getMovieListData(coming_soonUrl, "comingSoon", "即将上映")
    this.getMovieListData(top250Url, "top250", "top250")
  },

  getMovieListData: function (url, key, sectionTitle) {
    wx.showNavigationBarLoading()
    var that = this
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        wx.hideNavigationBarLoading()
        console.log(res)
        that.processDoubanMovies(res.data, key, sectionTitle)
      },
      fail: function (error) {
        wx.hideNavigationBarLoading()
        console.log(error)
      }
    })
  },

  processDoubanMovies: function (moviesData, key, sectionTitle) {
    var movies = []
    for (var idx in moviesData.subjects) {
      var subject = moviesData.subjects[idx]
      var title = subject.title
      if (title.length > 7) {
        title = title.substring(0, 7) + "..."
      }
      var temp = {
        stars: util.convertToStarArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var readyData = {}
    readyData[key] = {
      sectionTitle: sectionTitle,
      movies: movies
    }
    this.setData(readyData)
  },

  onMoreTaped: function (event) {
    var category = event.currentTarget.dataset.category
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category
    })
  },

  onBindFocus: function () {
    this.setData({
      searchPanelShow: true,
      moviePanelShow: false
    })
  },

  onCancelImgTap: function () {
    this.setData({
      searchPanelShow: false,
      moviePanelShow: true
    })
  },

  onBindBlur: function (event) {
    var searchText = event.detail.value
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + searchText
    this.getMovieListData(searchUrl, "searchResult", "")

  }

})