// 调试数据查询脚本
// 在微信开发者工具控制台中运行

async function debugData() {
  try {
    console.log('🔍 开始调试数据...')
    
    const db = wx.cloud.database()
    
    // 1. 查看tests集合中的数据
    console.log('📋 检查测试列表:')
    const tests = await db.collection('tests').get()
    console.log('测试数据:', tests.data)
    
    // 2. 查看questions集合中的数据
    console.log('\n📝 检查题目数据:')
    const questions = await db.collection('questions').get()
    console.log('题目总数:', questions.total)
    
    // 按testId分组统计题目数量
    const questionGroups = {}
    questions.data.forEach(q => {
      if (!questionGroups[q.testId]) {
        questionGroups[q.testId] = []
      }
      questionGroups[q.testId].push(q)
    })
    
    console.log('按测试ID分组的题目数量:')
    Object.keys(questionGroups).forEach(testId => {
      console.log(`  ${testId}: ${questionGroups[testId].length} 道题`)
    })
    
    // 3. 测试具体的查询
    console.log('\n🧪 测试具体查询:')
    
    // 查询焦虑测试
    const anxietyQuestions = await db.collection('questions')
      .where({ testId: 'test_anxiety_001' })
      .limit(50)
      .get()
    console.log('test_anxiety_001 题目数量:', anxietyQuestions.data.length)
    
    // 查询性格测试  
    const personalityQuestions = await db.collection('questions')
      .where({ testId: 'test_personality_001' })
      .limit(50)
      .get()
    console.log('test_personality_001 题目数量:', personalityQuestions.data.length)
    
    // 4. 检查页面试题数据处理
    console.log('\n📱 模拟页面加载:')
    
    // 检查页面的testId参数
    console.log('请检查当前页面的testId参数是否为: test_anxiety_001 或 test_personality_001')
    
  } catch (error) {
    console.error('❌ 调试过程出错:', error)
  }
}

// 执行调试
debugData()