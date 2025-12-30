// 心理测试小程序数据库初始化脚本
// 在微信开发者工具的云开发控制台中执行

// 1. 创建用户集合
const usersCollection = db.collection('users')

// 2. 创建测试集合
const testsCollection = db.collection('tests')

// 3. 创建题目集合
const questionsCollection = db.collection('questions')

// 4. 创建测试记录集合
const recordsCollection = db.collection('records')

// 示例数据 - 性格测试
const sampleTests = [
  {
    _id: 'test_personality_001',
    title: '性格类型测试',
    description: '通过一系列问题了解你的性格类型，帮助你更好地认识自己',
    type: 'personality',
    typeName: '性格测试',
    coverImage: 'cloud://test-1.7465-test-1-1300000000/personality-test.jpg',
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
    coverImage: 'cloud://test-1.7465-test-1-1300000000/anxiety-test.jpg',
    questionCount: 8,
    maxScore: 80,
    createTime: new Date(),
    status: 'active'
  }
]

// 示例题目数据
const sampleQuestions = [
  // 性格测试题目
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
  // 焦虑测试题目
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

// 数据库索引设置
const indexes = {
  users: [
    { name: 'openid_index', fields: ['_openid'], unique: true }
  ],
  tests: [
    { name: 'type_index', fields: ['type'] },
    { name: 'status_index', fields: ['status'] },
    { name: 'createTime_index', fields: ['createTime'] }
  ],
  questions: [
    { name: 'testId_index', fields: ['testId'] },
    { name: 'order_index', fields: ['testId', 'order'] }
  ],
  records: [
    { name: 'openid_index', fields: ['_openid'] },
    { name: 'testId_index', fields: ['testId'] },
    { name: 'createTime_index', fields: ['_openid', 'createTime'] }
  ]
}

console.log('数据库初始化完成！')
console.log('请在微信开发者工具的云开发控制台中手动添加示例数据')