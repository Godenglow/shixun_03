// 最终修复脚本 - 测试修复后的initDatabase云函数
// 在微信开发者工具控制台中运行

async function finalFix() {
  try {
    console.log('🔧 开始最终修复...')
    
    const db = wx.cloud.database()
    
    // 1. 检查当前数据状态
    console.log('📊 检查当前数据状态:')
    const currentQuestions = await db.collection('questions').get()
    console.log(`当前题目总数: ${currentQuestions.data.length}`)
    
    // 2. 调用修复后的initDatabase云函数
    console.log('\n🔄 调用修复后的initDatabase云函数...')
    const initResult = await wx.cloud.callFunction({
      name: 'initDatabase'
    })
    
    console.log('✅ 初始化结果:', initResult.result)
    
    // 3. 验证修复结果
    console.log('\n🔍 验证修复结果...')
    
    // 重新获取所有题目
    const newQuestions = await db.collection('questions').get()
    console.log(`修复后题目总数: ${newQuestions.data.length}`)
    
    // 按testId分组统计
    const groups = {}
    newQuestions.data.forEach(q => {
      if (!groups[q.testId]) {
        groups[q.testId] = []
      }
      groups[q.testId].push(q)
    })
    
    console.log('分组统计:')
    Object.keys(groups).forEach(testId => {
      console.log(`  ${testId}: ${groups[testId].length} 道题`)
    })
    
    // 4. 验证结果
    const anxietyCount = groups['test_anxiety_001']?.length || 0
    const personalityCount = groups['test_personality_001']?.length || 0
    
    if (anxietyCount === 20 && personalityCount === 20 && newQuestions.data.length === 40) {
      console.log('\n🎉 修复成功！')
      console.log('✅ 焦虑测试: 20道题')
      console.log('✅ 性格测试: 20道题')
      console.log('✅ 总计: 40道题')
      console.log('\n💡 请清除小程序缓存并重新进入测试')
      
      // 显示前几道题目作为验证
      console.log('\n📝 显示验证题目:')
      if (groups['test_anxiety_001']) {
        console.log('焦虑测试第1题:', groups['test_anxiety_001'][0].question)
      }
      if (groups['test_personality_001']) {
        console.log('性格测试第1题:', groups['test_personality_001'][0].question)
      }
      
    } else {
      console.log('\n❌ 修复失败')
      console.log(`焦虑测试: ${anxietyCount}/20`)
      console.log(`性格测试: ${personalityCount}/20`)
      console.log(`总计: ${newQuestions.data.length}/40`)
    }
    
  } catch (error) {
    console.error('❌ 最终修复过程出错:', error)
  }
}

// 执行最终修复
finalFix()