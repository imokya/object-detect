const app = getApp()

let w, h, cw, ch


Page({

  onLoad() {
    wx.showToast({
      title: app.globalData.location ? '识别成功' : '识别失败',
      icon: 'none'
    })

    wx.getImageInfo({
      src: app.globalData.path,
      success: (res) => {
        w = res.width
        h = res.height
        const sys = wx.getSystemInfoSync()
        const ww = sys.windowWidth
        const wh = sys.windowHeight
        const r = w / h
        cw = ww
        ch = cw / r
        this.setData({
          w: cw,
          h: ch,
          left: (cw - w) * 0.5,
          top: (ch - h) * 0.5
        })
        this._draw()
      }
    })
  },

  onReplay() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  _draw() {
    const sys = wx.getSystemInfoSync()
    const ctx = wx.createCanvasContext('canvas')
    ctx.drawImage(app.globalData.path, 0, 0, cw, ch)
    const location = app.globalData.location
    if (location) {
      ctx.setLineWidth(2)
      ctx.setStrokeStyle('red')
      ctx.beginPath()
      const ratio = cw / w
      ctx.strokeRect(
        location.left * ratio,
        location.top * ratio,
        location.width * ratio,
        location.height * ratio
      )
      ctx.stroke()
    }
    ctx.draw()
  },


})

