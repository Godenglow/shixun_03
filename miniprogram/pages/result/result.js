Page({
  data: {
    recordId: '',
    result: null,
    loading: true,
    error: '',
    showShare: false
  },

  onLoad(options) {
    const { recordId } = options
    if (!recordId) {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      })
      wx.navigateBack()
      return
    }
    
    this.setData({ recordId })
    this.loadResult()
  },

  async loadResult() {
    try {
      this.setData({ 
        loading: true, 
        error: '' 
      })

      const db = wx.cloud.database()
      const records = db.collection('records')
      
      const res = await records.doc(this.data.recordId).get()
      const result = res.data
      
      // 格式化创建时间
      if (result.createTime) {
        const date = new Date(result.createTime)
        result.createTime = this.formatDate(date)
      }
      
      this.setData({
        result: result,
        loading: false
      })
      
      wx.setNavigationBarTitle({
        title: `${result.testTitle} - 结果`
      })
      
    } catch (error) {
      console.error('加载结果失败：', error)
      this.setData({
        loading: false,
        error: '加载结果失败，请检查网络连接'
      })
    }
  },

  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hour}:${minute}`
  },

  shareResult() {
    this.setData({ showShare: true })
  },

  hideShare() {
    this.setData({ showShare: false })
  },

  saveImage() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  goHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  goProfile() {
    wx.switchTab({
      url: '/pages/profile/profile'
    })
  },

  // 页面分享
  onShareAppMessage() {
    return {
      title: `我在${this.data.result?.testTitle}中得到了"${this.data.result?.result?.level}"，快来测试吧！`,
      path: `/pages/index/index`
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: `我在${this.data.result?.testTitle}中得到了"${this.data.result?.result?.level}"，快来测试吧！`,
      query: ''
    }
  }
})