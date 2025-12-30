Page({
  data: {
    userInfo: {},
    records: [],
    totalTests: 0,
    totalRecords: 0,
    loading: true,
    error: '',
    hasMore: false,
    page: 1,
    pageSize: 10
  },

  onLoad() {
    this.checkLoginStatus()
  },

  onShow() {
    this.loadUserInfo()
    if (this.data.userInfo.nickName) {
      this.loadRecords()
    }
  },

  checkLoginStatus() {
    const app = getApp()
    
    if (!app.globalData.isLoggedIn) {
      this.setData({
        userInfo: {},
        loading: false
      })
      return
    }
    
    this.loadUserInfo()
  },

  loadUserInfo() {
    const app = getApp()
    if (app.globalData.userInfo) {
      const userInfo = { ...app.globalData.userInfo }
      
      // 格式化创建时间
      if (userInfo.createTime) {
        const date = new Date(userInfo.createTime)
        userInfo.createTime = this.formatDate(date)
      }
      
      this.setData({
        userInfo: userInfo
      })
    }
  },

  async loadRecords() {
    try {
      this.setData({ 
        loading: true, 
        error: '' 
      })

      const db = wx.cloud.database()
      const records = db.collection('records')
      
      // 获取用户的所有记录
      const res = await records
        .where({
          _openid: getApp().globalData.openid
        })
        .orderBy('createTime', 'desc')
        .limit(this.data.pageSize)
        .get()
      
      // 处理记录数据
      const processedRecords = res.data.map(record => ({
        ...record,
        createTime: this.formatDate(new Date(record.createTime))
      }))
      
      this.setData({
        records: processedRecords,
        totalRecords: res.data.length,
        totalTests: new Set(res.data.map(r => r.testId)).size,
        loading: false,
        hasMore: res.data.length === this.data.pageSize
      })

    } catch (error) {
      console.error('加载记录失败：', error)
      this.setData({
        loading: false,
        error: '加载记录失败，请检查网络连接'
      })
    }
  },

  async loadMore() {
    if (this.data.loading || !this.data.hasMore) return
    
    try {
      const db = wx.cloud.database()
      const records = db.collection('records')
      
      const newPage = this.data.page + 1
      const res = await records
        .where({
          _openid: getApp().globalData.openid
        })
        .orderBy('createTime', 'desc')
        .skip((newPage - 1) * this.data.pageSize)
        .limit(this.data.pageSize)
        .get()
      
      if (res.data.length > 0) {
        const processedRecords = res.data.map(record => ({
          ...record,
          createTime: this.formatDate(new Date(record.createTime))
        }))
        
        this.setData({
          records: [...this.data.records, ...processedRecords],
          page: newPage,
          hasMore: res.data.length === this.data.pageSize
        })
      }
      
    } catch (error) {
      console.error('加载更多失败：', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const recordDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    const diffDays = Math.floor((today - recordDate) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return `今天 ${hour}:${minute}`
    } else if (diffDays === 1) {
      return `昨天 ${hour}:${minute}`
    } else if (diffDays < 7) {
      return `${diffDays}天前 ${hour}:${minute}`
    } else {
      return `${year}-${month}-${day} ${hour}:${minute}`
    }
  },

  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  goHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  viewRecord(e) {
    const recordId = e.currentTarget.dataset.recordId
    wx.navigateTo({
      url: `/pages/result/result?recordId=${recordId}`
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    if (this.data.userInfo.nickName) {
      this.loadRecords().then(() => {
        wx.stopPullDownRefresh()
      })
    } else {
      wx.stopPullDownRefresh()
    }
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '心理测试 - 了解真实的自己',
      path: '/pages/index/index'
    }
  }
})