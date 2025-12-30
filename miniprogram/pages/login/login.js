Page({
  data: {
    loading: false
  },

  async handleLogin() {
    if (this.data.loading) return
    
    this.setData({ loading: true })
    
    try {
      // 获取用户信息
      const userProfile = await wx.getUserProfile({
        desc: '用于完善用户资料'
      })
      
      // 获取登录凭证
      const loginRes = await wx.login()
      
      if (!loginRes.code) {
        throw new Error('获取登录凭证失败')
      }
      
      // 调用云函数进行登录
      const res = await wx.cloud.callFunction({
        name: 'login',
        data: {
          code: loginRes.code,
          userInfo: userProfile.userInfo
        }
      })
      
      const { openid } = res.result
      
      // 保存用户信息到数据库
      const db = wx.cloud.database()
      const users = db.collection('users')
      
      // 检查用户是否已存在
      const existRes = await users.where({
        openid: openid
      }).get()
      
      if (existRes.data.length === 0) {
        // 新用户，插入用户信息
        await users.add({
          data: {
            openid: openid,
            nickName: userProfile.userInfo.nickName,
            avatarUrl: userProfile.userInfo.avatarUrl,
            gender: userProfile.userInfo.gender,
            city: userProfile.userInfo.city,
            province: userProfile.userInfo.province,
            country: userProfile.userInfo.country,
            createTime: db.serverDate(),
            lastLoginTime: db.serverDate()
          }
        })
      } else {
        // 老用户，更新登录时间
        await users.doc(existRes.data[0]._id).update({
          data: {
            nickName: userProfile.userInfo.nickName,
            avatarUrl: userProfile.userInfo.avatarUrl,
            lastLoginTime: db.serverDate()
          }
        })
      }
      
      // 保存用户信息到全局
      const app = getApp()
      app.setUserInfo({
        _id: existRes.data[0]?._id || null,
        nickName: userProfile.userInfo.nickName,
        avatarUrl: userProfile.userInfo.avatarUrl,
        openid: openid
      })
      
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })
      
      // 跳转到首页
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }, 1500)
      
    } catch (error) {
      console.error('登录失败：', error)
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  showAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '这里是用户协议内容...',
      showCancel: false
    })
  },

  showPrivacy() {
    wx.showModal({
      title: '隐私政策',
      content: '这里是隐私政策内容...',
      showCancel: false
    })
  }
})