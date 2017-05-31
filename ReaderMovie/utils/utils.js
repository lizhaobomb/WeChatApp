function convertToStarArray(star) {
  var num = star.toString().substring(0, 1)
  var array = []
  for (var i = 0; i < 5; i++) {
    if (i < num) {
      array.push(1)
    } else {
      array.push(0)
    }
  }
  return array
}

function http(url, callback) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      "Content-Type": "json"
    },
    success: function (res) {
      callback(res.data)
    },
    fail: function (error) {
      console.log(error)
    }
  })
}
module.exports = {
  convertToStarArray: convertToStarArray,
  http: http
}