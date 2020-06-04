const INTERVAL = 300
const API_URL = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/detection/mm_detection'
const API_AUTH_URL = 'https://aip.baidubce.com/oauth/2.0/token'
const CLIENT_ID = '' //API Key
const CLIENT_SECRET = '' //Secret Key
const SCALE = 0.2
const MAX_COUNT = 2

let _access_token
let _path
let _count = 0

const app = getApp()

const sys = wx.getSystemInfoSync()

Page({

  data: {
    h: sys.windowHeight + 48,
    showTip: false
  },

  onShow() {
    wx.showLoading({
      title: '开启摄像头'
    })
    setTimeout(() => {
      this._auth()
    }, 3000)
  },

  _auth() {
    wx.hideLoading()
    wx.request({
      url: API_AUTH_URL,
      method: 'GET',
      data: {
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      },
      success: (res) => {
        _access_token = res.data.access_token
        this._getImageData()
      }
    })
  },

  _getImageData() {
    if (this._complete) return
    const fs = wx.getFileSystemManager()
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        _path = res.tempImagePath
        app.globalData.path = _path
        const base64 = fs.readFileSync(_path, 'base64')
        this._detectObject(`${base64}`)
      }
    })
    this.setData({
      showTip: true
    })
  },

  _detectObject(image) {
    wx.request({
      url: `${API_URL}?access_token=${_access_token}`,
      method: 'POST',
      data: {
        image,
        threshold: 0.1
      },
      success: (res) => {
        const data = res.data.results
        if (data.length === 0) {
          if(++_count >= MAX_COUNT) {
            _count = 0
            wx.navigateTo({
              url: '/pages/result/index'
            })
          } else {
            this.id = setTimeout(this._getImageData.bind(this), INTERVAL)
          }
          app.globalData.location = null
        } else {
          app.globalData.location = data[0].location
          this._complete = true
          _count = 0
          wx.navigateTo({
            url: '/pages/result/index'
          })
        }
        this.setData({
          showTip: false
        })
      }
    })
  },

  onHide() {
    this.setData({
      showTip: false
    })
    this._complete = false
    clearTimeout(this.id)
  }

})
