// 检查测试数据具体内容
// 在微信开发者工具控制台中运行

async function checkTestsData() {
  try {
    console.log('🔍 检查测试数据详细内容...')
    
    const db = wx.cloud.database()
    
    // 获取测试列表
    const tests = await db.collection('tests').get()
    console.log('📋 测试数据详情:')
    tests.data.forEach((test, index) => {
      console.log(`测试${index + 1}:`, {
        _id: test._id,
        title: test.title,
        testId: test.testId
      })
    })
    
    // 重新统计题目数量（使用更准确的方法）
    console.log('\n📊 重新统计题目数量:')
    
    // 获取所有题目
    const allQuestions = await db.collection('questions').get()
    console.log('题目总数:', allQuestions.data.length)
    
    // 按testId分组
    const groups = {}
    allQuestions.data.forEach(q => {
      if (!groups[q.testId]) {
        groups[q.testId] = []
      }
      groups[q.testId].push(q)
    })
    
    console.log('分组详情:')
    Object.keys(groups).forEach(testId => {
      console.log(`  ${testId}: ${groups[testId].length} 道题`)
    })
    
    // 检查前几道题的testId
    console.log('\n🔍 前5道题目的testId:')
    allQuestions.data.slice(0, 5).forEach((q, index) => {
      console.log(`题目${index + 1}: testId="${q.testId}", 题目="${q.question.substring(0, 20)}..."`)
    })
    
  } catch (error) {
    console.error('❌ 检查过程出错:', error)
  }
}

// 执行检查
checkTestsData()