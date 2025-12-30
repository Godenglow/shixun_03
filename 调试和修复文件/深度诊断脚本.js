// 深度诊断数据库问题
async function deepDiagnostic() {
  try {
    console.log('🔍 开始深度诊断数据库问题...')
    
    const db = wx.cloud.database()
    
    // 1. 检查当前所有题目
    console.log('\n📊 第1步：检查当前数据库中的所有题目')
    const allQuestions = await db.collection('questions').get()
    console.log(`当前题目总数: ${allQuestions.data.length}`)
    
    // 2. 按testId分组详细分析
    console.log('\n🔍 第2步：按testId分组分析')
    const groups = {}
    allQuestions.data.forEach((question, index) => {
      if (!groups[question.testId]) {
        groups[question.testId] = []
      }
      groups[question.testId].push({
        index: index + 1,
        _id: question._id,
        order: question.order,
        question: question.question.substring(0, 30) + '...'
      })
    })
    
    console.log('分组详情:')
    Object.keys(groups).forEach(testId => {
      console.log(`\n${testId} (${groups[testId].length} 道题):`)
      groups[testId].forEach(q => {
        console.log(`  ${q.order}. [${q._id}] ${q.question}`)
      })
    })
    
    // 3. 检查ID是否冲突
    console.log('\n🔍 第3步：检查ID冲突')
    const idMap = {}
    const conflicts = []
    
    allQuestions.data.forEach(question => {
      if (idMap[question._id]) {
        conflicts.push({
          id: question._id,
          existing: idMap[question._id],
          current: question
        })
      } else {
        idMap[question._id] = question
      }
    })
    
    if (conflicts.length > 0) {
      console.log(`⚠️ 发现 ${conflicts.length} 个ID冲突:`)
      conflicts.forEach(conflict => {
        console.log(`  冲突ID: ${conflict.id}`)
      })
    } else {
      console.log('✅ 没有发现ID冲突')
    }
    
    // 4. 尝试手动添加一个焦虑测试题目
    console.log('\n🧪 第4步：测试手动添加焦虑测试题目')
    
    const testAnxietyQuestion = {
      _id: 'question_anxiety_test_001',
      testId: 'test_anxiety_001',
      order: 1,
      question: '测试题目：你最近是否感到焦虑？',
      options: [
        { id: 'A', text: '经常焦虑', score: 10 },
        { id: 'B', text: '偶尔焦虑', score: 5 },
        { id: 'C', text: '很少焦虑', score: 2 },
        { id: 'D', text: '从不焦虑', score: 1 }
      ],
      createTime: new Date()
    }
    
    try {
      const addResult = await db.collection('questions').doc(testAnxietyQuestion._id).set({
        data: testAnxietyQuestion
      })
      console.log('✅ 手动添加测试题目成功:', addResult)
      
      // 验证是否真的添加了
      const verifyResult = await db.collection('questions').where({
        _id: testAnxietyQuestion._id
      }).get()
      
      console.log('验证结果:', verifyResult.data.length > 0 ? '✅ 题目确实已添加' : '❌ 题目添加失败')
      
    } catch (addError) {
      console.log('❌ 手动添加测试题目失败:', addError.message)
    }
    
    // 5. 检查集合是否存在权限问题
    console.log('\n🔍 第5步：检查数据库权限')
    
    try {
      // 尝试直接查询
      const permissionTest = await db.collection('questions').limit(1).get()
      console.log('✅ 数据库查询权限正常')
      
      // 尝试使用count
      const countTest = await db.collection('questions').count()
      console.log(`✅ 数据库count权限正常，总数: ${countTest.total}`)
      
    } catch (permError) {
      console.log('❌ 数据库权限问题:', permError.message)
    }
    
    // 6. 最终统计
    console.log('\n📋 诊断总结:')
    console.log(`- 当前题目总数: ${allQuestions.data.length}`)
    console.log(`- 性格测试题目: ${groups['test_personality_001']?.length || 0}`)
    console.log(`- 焦虑测试题目: ${groups['test_anxiety_001']?.length || 0}`)
    console.log(`- ID冲突数量: ${conflicts.length}`)
    
    // 7. 生成修复建议
    console.log('\n💡 修复建议:')
    
    if (groups['test_anxiety_001']?.length === 0) {
      console.log('1. 焦虑测试题目完全缺失，需要重新初始化')
      console.log('2. 建议先清空现有数据，再重新初始化')
    } else if (groups['test_anxiety_001']?.length < 20) {
      console.log('1. 焦虑测试题目不完整，需要补充')
      console.log('2. 建议使用set方法覆盖现有题目')
    } else {
      console.log('1. 数据看起来正常，问题可能在别处')
      console.log('2. 建议检查前端查询逻辑')
    }
    
  } catch (error) {
    console.error('❌ 诊断过程出错:', error)
  }
}

// 执行诊断
deepDiagnostic()