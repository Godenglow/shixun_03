// 彻底修复题目数据问题
// 在微信开发者工具控制台中运行

async function fixQuestionsCompletely() {
  try {
    console.log('🔧 开始彻底修复题目数据...')
    
    const db = wx.cloud.database()
    
    // 1. 完全清空questions集合
    console.log('🗑️ 清空所有题目数据...')
    const questions = await db.collection('questions').get()
    
    if (questions.data.length > 0) {
      const batch = db.batch()
      questions.data.forEach(q => {
        batch.delete(db.collection('questions').doc(q._id))
      })
      await batch.commit()
      console.log(`✅ 清空完成，删除了 ${questions.data.length} 道题`)
    } else {
      console.log('✅ 题目数据已经是空的')
    }
    
    // 2. 重新初始化数据库
    console.log('🔄 重新初始化数据库...')
    const initResult = await wx.cloud.callFunction({
      name: 'initDatabase'
    })
    
    console.log('✅ 初始化完成:', initResult.result)
    
    // 3. 验证修复结果
    console.log('🔍 验证修复结果...')
    
    // 重新获取所有题目
    const newQuestions = await db.collection('questions').get()
    console.log('新的题目总数:', newQuestions.data.length)
    
    // 重新分组统计
    const groups = {}
    newQuestions.data.forEach(q => {
      if (!groups[q.testId]) {
        groups[q.testId] = []
      }
      groups[q.testId].push(q)
    })
    
    console.log('修复后的分组统计:')
    Object.keys(groups).forEach(testId => {
      console.log(`  ${testId}: ${groups[testId].length} 道题`)
    })
    
    // 4. 检查测试配置
    console.log('\n📋 检查测试配置...')
    const tests = await db.collection('tests').get()
    tests.data.forEach((test, index) => {
      console.log(`测试${index + 1}:`, {
        _id: test._id,
        title: test.title,
        testId: test.testId || 'undefined'
      })
    })
    
    // 5. 最终验证
    if (newQuestions.data.length === 40 && 
        groups['test_anxiety_001']?.length === 20 && 
        groups['test_personality_001']?.length === 20) {
      console.log('🎉 修复成功！现在每个测试都有20道题目')
      console.log('💡 请清除小程序缓存并重新进入测试')
    } else {
      console.log('❌ 修复失败，数据仍然不正确')
    }
    
  } catch (error) {
    console.error('❌ 修复过程出错:', error)
  }
}

// 执行修复
fixQuestionsCompletely()