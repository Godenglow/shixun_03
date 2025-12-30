Page({
  data: {
    testId: '',
    testInfo: {},
    questions: [],
    currentQuestionIndex: 0,
    totalQuestions: 0,
    currentQuestion: null,
    selectedAnswer: '',
    answers: [],
    loading: true,
    error: '',
    progress: 0,
    showConfirm: false,
    submitting: false
  },

  onLoad(options) {
    const { testId } = options
    if (!testId) {
      wx.showToast({
        title: '测试参数错误',
        icon: 'none'
      })
      wx.navigateBack()
      return
    }
    
    this.setData({ testId })
    this.loadTestInfo()
    this.loadQuestions()
  },

  async loadTestInfo() {
    try {
      const db = wx.cloud.database()
      const tests = db.collection('tests')
      
      const res = await tests.doc(this.data.testId).get()
      this.setData({
        testInfo: res.data
      })
      
      wx.setNavigationBarTitle({
        title: res.data.title
      })
      
    } catch (error) {
      console.error('获取测试信息失败：', error)
      this.setData({
        error: '获取测试信息失败'
      })
    }
  },

  async loadQuestions() {
    try {
      this.setData({ 
        loading: true, 
        error: '' 
      })

      const db = wx.cloud.database()
      const questions = db.collection('questions')
      
      // 获取测试的题目
      const res = await questions
        .where({
          testId: this.data.testId
        })
        .orderBy('order', 'asc')
        .get()
      
      if (res.data.length === 0) {
        throw new Error('该测试暂无题目')
      }
      
      this.setData({
        questions: res.data,
        totalQuestions: res.data.length,
        currentQuestion: res.data[0],
        loading: false
      })
      
      this.updateProgress()

    } catch (error) {
      console.error('加载题目失败：', error)
      this.setData({
        loading: false,
        error: '加载题目失败，请检查网络连接'
      })
    }
  },

  selectOption(e) {
    if (this.data.submitting) return
    
    const optionId = e.currentTarget.dataset.optionId
    this.setData({
      selectedAnswer: optionId
    })
    
    // 保存答案
    const answers = [...this.data.answers]
    answers[this.data.currentQuestionIndex] = optionId
    this.setData({ answers })
  },

  prevQuestion() {
    if (this.data.currentQuestionIndex > 0) {
      const newIndex = this.data.currentQuestionIndex - 1
      this.setData({
        currentQuestionIndex: newIndex,
        currentQuestion: this.data.questions[newIndex],
        selectedAnswer: this.data.answers[newIndex] || ''
      })
      this.updateProgress()
    }
  },

  nextQuestion() {
    if (!this.data.selectedAnswer) {
      wx.showToast({
        title: '请选择答案',
        icon: 'none'
      })
      return
    }
    
    const isLastQuestion = this.data.currentQuestionIndex === this.data.totalQuestions - 1
    
    if (isLastQuestion) {
      this.showConfirm()
    } else {
      const newIndex = this.data.currentQuestionIndex + 1
      this.setData({
        currentQuestionIndex: newIndex,
        currentQuestion: this.data.questions[newIndex],
        selectedAnswer: this.data.answers[newIndex] || ''
      })
      this.updateProgress()
    }
  },

  showConfirm() {
    // 检查是否所有题目都已回答
    const allAnswered = this.data.answers.length === this.data.totalQuestions && 
                       this.data.answers.every(answer => answer !== '' && answer !== undefined)
    
    if (allAnswered) {
      this.setData({ showConfirm: true })
    } else {
      wx.showToast({
        title: '请先完成所有题目',
        icon: 'none'
      })
    }
  },

  hideConfirm() {
    this.setData({ showConfirm: false })
  },

  async submitTest() {
    if (this.data.submitting) return
    
    this.setData({ 
      showConfirm: false,
      submitting: true 
    })
    
    wx.showLoading({
      title: '正在生成报告...'
    })
    
    try {
      const app = getApp()
      const userInfo = app.globalData.userInfo
      
      const res = await wx.cloud.callFunction({
        name: 'generateReport',
        data: {
          testId: this.data.testId,
          answers: this.data.answers,
          userInfo: userInfo
        }
      })
      
      if (res.result.success) {
        wx.hideLoading()
        
        wx.showToast({
          title: '测试完成',
          icon: 'success'
        })
        
        // 跳转到结果页面
        setTimeout(() => {
          wx.redirectTo({
            url: `/pages/result/result?recordId=${res.result.recordId}`
          })
        }, 1500)
        
      } else {
        throw new Error(res.result.error || '生成报告失败')
      }
      
    } catch (error) {
      console.error('提交测试失败：', error)
      wx.hideLoading()
      
      wx.showToast({
        title: error.message || '提交失败，请重试',
        icon: 'none'
      })
    } finally {
      this.setData({ submitting: false })
    }
  },

  updateProgress() {
    const progress = Math.round(((this.data.currentQuestionIndex + 1) / this.data.totalQuestions) * 100)
    this.setData({ progress })
  },

  // 页面分享
  onShareAppMessage() {
    return {
      title: `${this.data.testInfo.title} - 心理测试`,
      path: `/pages/test/test?testId=${this.data.testId}`
    }
  }
})