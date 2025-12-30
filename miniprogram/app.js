App({
  globalData: {
    userInfo: null,
    openid: '',
    isLoggedIn: false
  },

  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-3g1l2z3l3e2d47b6', // 请填写您的云环境ID
        traceUser: true
      })
    }
    
    this.login()
    this.initDatabase()
  },

  async login() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'login'
      })
      
      this.globalData.openid = res.result.openid
      this.checkUserExists()
    } catch (err) {
      console.error('登录失败：', err)
    }
  },

  async checkUserExists() {
    try {
      const db = wx.cloud.database()
      const users = db.collection('users')
      const res = await users.where({
        openid: this.globalData.openid
      }).get()
      
      if (res.data.length === 0) {
        this.globalData.isLoggedIn = false
      } else {
        this.globalData.userInfo = res.data[0]
        this.globalData.isLoggedIn = true
      }
    } catch (err) {
      console.error('检查用户失败：', err)
    }
  },

  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo
    this.globalData.isLoggedIn = true
  },

  async initDatabase() {
    try {
      console.log('开始初始化数据库...')
      const res = await wx.cloud.callFunction({
        name: 'initDatabase'
      })
      console.log('数据库初始化结果:', res.result)
      
      if (res.result.success) {
        console.log('✅ 数据库初始化成功')
      } else {
        console.warn('⚠️ 数据库初始化失败:', res.result.message)
      }
    } catch (err) {
      console.error('数据库初始化失败:', err)
    }
  }
})