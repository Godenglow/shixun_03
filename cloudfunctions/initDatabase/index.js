// 云数据库初始化云函数
// 部署此函数后，在小程序中调用一次即可完成初始化

const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    console.log('开始初始化数据库...')
    
    // 1. 创建用户集合（如果不存在）
    try {
      await db.createCollection('users')
      console.log('✅ 创建 users 集合成功')
    } catch (err) {
      console.log('users 集合已存在或创建失败:', err.message)
    }

    // 2. 创建测试集合
    try {
      await db.createCollection('tests')
      console.log('✅ 创建 tests 集合成功')
    } catch (err) {
      console.log('tests 集合已存在或创建失败:', err.message)
    }

    // 3. 创建题目集合
    try {
      await db.createCollection('questions')
      console.log('✅ 创建 questions 集合成功')
    } catch (err) {
      console.log('questions 集合已存在或创建失败:', err.message)
    }

    // 4. 创建测试记录集合
    try {
      await db.createCollection('records')
      console.log('✅ 创建 records 集合成功')
    } catch (err) {
      console.log('records 集合已存在或创建失败:', err.message)
    }

    // 数据库索引设置
    const indexes = {
      users: [
        { name: 'openid_index', fields: ['openid'], unique: true }
      ],
      tests: [
        { name: 'type_index', fields: ['type'] },
        { name: 'status_index', fields: ['status'] }
      ],
      questions: [
        { name: 'testId_index', fields: ['testId'] },
        { name: 'order_index', fields: ['testId', 'order'] }
      ],
      records: [
        { name: 'testId_index', fields: ['testId'] },
        { name: 'openid_index', fields: ['_openid'] },
        { name: 'createTime_index', fields: ['createTime'] }
      ]
    }

    // 5. 添加示例测试数据
    const sampleTests = [
      {
        _id: 'test_personality_001',
        title: '性格类型测试',
        description: '通过一系列问题了解你的性格类型，帮助你更好地认识自己',
        type: 'personality',
        typeName: '性格测试',
        coverImage: '',
        questionCount: 10,
        maxScore: 100,
        createTime: new Date(),
        status: 'active'
      },
      {
        _id: 'test_anxiety_001',
        title: '焦虑水平测试',
        description: '评估你当前的焦虑水平，了解自己的情绪状态',
        type: 'anxiety',
        typeName: '焦虑测试',
        coverImage: '',
        questionCount: 8,
        maxScore: 80,
        createTime: new Date(),
        status: 'active'
      }
    ]

    // 6. 添加示例题目数据
    const sampleQuestions = [
      {
        _id: 'question_personality_001',
        testId: 'test_personality_001',
        order: 1,
        question: '在社交场合中，你通常：',
        options: [
          { id: 'A', text: '主动与他人交谈，享受社交', score: 10 },
          { id: 'B', text: '等待他人来找你聊天', score: 6 },
          { id: 'C', text: '选择安静的角落观察他人', score: 3 },
          { id: 'D', text: '尽量避免社交场合', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_personality_002',
        testId: 'test_personality_001',
        order: 2,
        question: '面对新的挑战时，你通常：',
        options: [
          { id: 'A', text: '感到兴奋，迫不及待想尝试', score: 10 },
          { id: 'B', text: '仔细考虑后再决定', score: 7 },
          { id: 'C', text: '需要一些时间适应', score: 4 },
          { id: 'D', text: '感到担忧，尽量避免', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_001',
        testId: 'test_anxiety_001',
        order: 1,
        question: '最近一周，你感到紧张或焦虑的频率是：',
        options: [
          { id: 'A', text: '几乎每天都有', score: 10 },
          { id: 'B', text: '经常（每周3-4次）', score: 7 },
          { id: 'C', text: '偶尔（每周1-2次）', score: 4 },
          { id: 'D', text: '很少或没有', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_002',
        testId: 'test_anxiety_001',
        order: 2,
        question: '你的睡眠质量如何？',
        options: [
          { id: 'A', text: '经常失眠或睡眠质量差', score: 10 },
          { id: 'B', text: '偶尔失眠', score: 6 },
          { id: 'C', text: '基本正常', score: 3 },
          { id: 'D', text: '睡眠质量很好', score: 1 }
        ],
        createTime: new Date()
      }
    ]

    // 添加测试数据
    for (const test of sampleTests) {
      try {
        await db.collection('tests').add({ data: test })
        console.log(`✅ 添加测试数据: ${test.title}`)
      } catch (err) {
        console.log(`测试数据已存在: ${test.title}`)
      }
    }

    // 添加题目数据
    for (const question of sampleQuestions) {
      try {
        await db.collection('questions').add({ data: question })
        console.log(`✅ 添加题目数据: ${question.question}`)
      } catch (err) {
        console.log(`题目数据已存在: ${question.question}`)
      }
    }

    return {
      success: true,
      message: '数据库初始化完成！',
      collections: ['users', 'tests', 'questions', 'records'],
      dataAdded: {
        tests: sampleTests.length,
        questions: sampleQuestions.length
      }
    }

  } catch (error) {
    console.error('数据库初始化失败:', error)
    return {
      success: false,
      message: '数据库初始化失败',
      error: error.message
    }
  }
}