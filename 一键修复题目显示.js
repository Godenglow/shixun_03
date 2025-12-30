// 一键修复题目显示问题
// 在微信开发者工具控制台中运行此脚本

async function fixQuestionsDisplay() {
  try {
    console.log('🔧 开始修复题目显示问题...')
    
    const db = wx.cloud.database()
    
    // 1. 删除现有题目
    console.log('📤 删除现有题目...')
    
    const deleteAnxiety = await db.collection('questions')
      .where({ testId: 'test_anxiety_001' })
      .remove()
    
    const deletePersonality = await db.collection('questions')
      .where({ testId: 'test_personality_001' })
      .remove()
    
    console.log('✅ 删除完成:', {
      anxiety: deleteAnxiety.stats.removed,
      personality: deletePersonality.stats.removed
    })
    
    // 2. 重新初始化数据库
    console.log('🔄 重新初始化数据库...')
    
    const initResult = await wx.cloud.callFunction({
      name: 'initDatabase'
    })
    
    console.log('✅ 初始化完成:', initResult.result)
    
    // 3. 验证题目数量
    console.log('🔍 验证题目数量...')
    
    const anxietyCount = await db.collection('questions')
      .where({ testId: 'test_anxiety_001' })
      .count()
    
    const personalityCount = await db.collection('questions')
      .where({ testId: 'test_personality_001' })
      .count()
    
    console.log('📊 最终题目数量:', {
      anxiety: anxietyCount.total,
      personality: personalityCount.total
    })
    
    if (anxietyCount.total === 20 && personalityCount.total === 20) {
      console.log('🎉 修复成功！现在每个测试都有20道题目')
      console.log('💡 请清除小程序缓存并重新进入测试')
    } else {
      console.log('❌ 修复失败，题目数量不正确')
    }
    
  } catch (error) {
    console.error('❌ 修复过程出错:', error)
  }
}


// 执行修复
fixQuestionsDisplay()