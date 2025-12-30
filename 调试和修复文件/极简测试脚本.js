// 极简测试脚本 - 专门测试优化后的initDatabase云函数
// 在微信开发者工具控制台中运行

async function testOptimizedInit() {
  try {
    console.log('🧪 开始测试极简初始化...')
    
    const db = wx.cloud.database()
    
    // 1. 检查当前数据状态
    console.log('📊 检查当前题目数量:')
    const currentQuestions = await db.collection('questions').get()
    console.log(`当前题目总数: ${currentQuestions.data.length}`)
    
    // 按testId分组统计
    const groups = {}
    currentQuestions.data.forEach(q => {
      if (!groups[q.testId]) {
        groups[q.testId] = []
      }
      groups[q.testId].push(q)
    })
    
    console.log('当前分组统计:')
    Object.keys(groups).forEach(testId => {
      console.log(`  ${testId}: ${groups[testId].length} 道题`)
    })
    
    // 2. 调用极简版initDatabase云函数
    console.log('\n🚀 调用极简版initDatabase云函数...')
    const startTime = Date.now()
    
    const initResult = await wx.cloud.callFunction({
      name: 'initDatabase'
    })
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    console.log(`⏱️ 执行时间: ${duration}ms`)
    console.log('✅ 初始化结果:', initResult.result)
    
    // 3. 验证修复结果
    console.log('\n🔍 验证结果...')
    
    // 重新获取所有题目
    const newQuestions = await db.collection('questions').get()
    console.log(`修复后题目总数: ${newQuestions.data.length}`)
    
    // 重新分组统计
    const newGroups = {}
    newQuestions.data.forEach(q => {
      if (!newGroups[q.testId]) {
        newGroups[q.testId] = []
      }
      newGroups[q.testId].push(q)
    })
    
    console.log('修复后分组统计:')
    Object.keys(newGroups).forEach(testId => {
      console.log(`  ${testId}: ${newGroups[testId].length} 道题`)
    })
    
    // 4. 验证结果
    const anxietyCount = newGroups['test_anxiety_001']?.length || 0
    const personalityCount = newGroups['test_personality_001']?.length || 0
    const totalCount = newQuestions.data.length
    
    console.log('\n📋 验证结果:')
    console.log(`性格测试: ${personalityCount}/20`)
    console.log(`焦虑测试: ${anxietyCount}/20`)
    console.log(`总计: ${totalCount}/40`)
    
    if (anxietyCount === 20 && personalityCount === 20 && totalCount === 40) {
      console.log('\n🎉 测试成功！')
      console.log('✅ 所有测试都包含20道题目')
      console.log('✅ 总计40道题目')
      console.log('\n💡 请清除小程序缓存并重新进入测试页面验证')
      
      // 显示示例题目
      console.log('\n📝 示例题目:')
      if (newGroups['test_anxiety_001']) {
        console.log('焦虑测试第1题:', newGroups['test_anxiety_001'][0].question)
      }
      if (newGroups['test_personality_001']) {
        console.log('性格测试第1题:', newGroups['test_personality_001'][0].question)
      }
      
    } else {
      console.log('\n❌ 测试失败')
      if (duration > 3000) {
        console.log('⚠️ 可能仍然存在超时问题')
      }
    }
    
  } catch (error) {
    console.error('❌ 测试过程出错:', error)
    if (error.message.includes('timed out')) {
      console.log('⚠️ 云函数执行超时，建议进一步简化initDatabase函数')
    }
  }
}

// 执行测试
testOptimizedInit()