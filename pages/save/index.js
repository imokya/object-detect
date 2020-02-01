Page({

  saveImage(e) {
    let url = e.currentTarget.dataset.url
    console.log(e.currentTarget)
    wx.saveImageToPhotosAlbum({
      filePath: url,
      success: () => {
        wx.showToast({
          title: '保存成功'
        })
      }
    })
  }
})
