// 直接重新初始化数据库
// 在微信开发者工具控制台中运行

async function reInitDatabase() {
  try {
    console.log('🔄 直接重新初始化数据库...')
    
    // 直接调用initDatabase云函数
    const initResult = await wx.cloud.callFunction({
      name: 'initDatabase'
    })
    
    console.log('✅ 初始化完成:', initResult.result)
    
    // 验证结果
    console.log('🔍 验证初始化结果...')
    
    const db = wx.cloud.database()
    
    // 获取所有题目
    const questions = await db.collection('questions').get()
    console.log('题目总数:', questions.data.length)
    
    // 按testId分组统计
    const groups = {}
    questions.data.forEach(q => {
      if (!groups[q.testId]) {
        groups[q.testId] = []
      }
      groups[q.testId].push(q)
    })
    
    console.log('分组统计:')
    Object.keys(groups).forEach(testId => {
      console.log(`  ${testId}: ${groups[testId].length} 道题`)
    })
    
    // 验证每个测试的题目数量
    const anxietyCount = groups['test_anxiety_001']?.length || 0
    const personalityCount = groups['test_personality_001']?.length || 0
    
    if (anxietyCount === 20 && personalityCount === 20) {
      console.log('🎉 重新初始化成功！现在每个测试都有20道题目')
      console.log('💡 请清除小程序缓存并重新进入测试')
      
      // 显示一些题目作为验证
      console.log('\n📝 显示前3道焦虑测试题目:')
      const anxietyQuestions = groups['test_anxiety_001'].slice(0, 3)
      anxietyQuestions.forEach((q, index) => {
        console.log(`${index + 1}. ${q.question}`)
      })
      
    } else {
      console.log('❌ 初始化失败，题目数量不正确')
      console.log(`焦虑测试: ${anxietyCount}/20, 性格测试: ${personalityCount}/20`)
    }
    
  } catch (error) {
    console.error('❌ 初始化过程出错:', error)
  }
}

// 执行重新初始化
reInitDatabase()