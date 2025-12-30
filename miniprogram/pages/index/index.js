Page({
  data: {
    userInfo: {},
    tests: [],
    loading: true,
    error: ''
  },

  onLoad() {
    this.checkLoginStatus()
  },

  onShow() {
    this.loadUserInfo()
  },

  checkLoginStatus() {
    const app = getApp()
    
    if (!app.globalData.isLoggedIn) {
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }
    
    this.loadTests()
  },

  loadUserInfo() {
    const app = getApp()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
  },

  async loadTests() {
    try {
      this.setData({ 
        loading: true, 
        error: '' 
      })

      const db = wx.cloud.database()
      const tests = db.collection('tests')
      
      // 获取测试列表
      const res = await tests.orderBy('createTime', 'desc').get()
      
      // 处理测试数据，添加类型名称和题目数量
      const processedTests = res.data.map(test => ({
        ...test,
        typeName: this.getTypeName(test.type),
        questionCount: test.questionCount || 0
      }))
      
      this.setData({
        tests: processedTests,
        loading: false
      })

    } catch (error) {
      console.error('加载测试失败：', error)
      this.setData({
        loading: false,
        error: '加载失败，请检查网络连接'
      })
    }
  },

  getTypeName(type) {
    const typeMap = {
      'personality': '性格测试',
      'anxiety': '焦虑测试',
      'depression': '抑郁测试',
      'stress': '压力测试',
      'emotion': '情绪测试',
      'general': '综合测试'
    }
    return typeMap[type] || '心理测试'
  },

  startTest(e) {
    const testId = e.currentTarget.dataset.testId
    wx.navigateTo({
      url: `/pages/test/test?testId=${testId}`
    })
  }
})