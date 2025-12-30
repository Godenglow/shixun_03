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
        questionCount: 20,
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
        questionCount: 20,
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
        _id: 'question_personality_003',
        testId: 'test_personality_001',
        order: 3,
        question: '在团队合作中，你更倾向于：',
        options: [
          { id: 'A', text: '担任领导者角色', score: 10 },
          { id: 'B', text: '积极参与讨论', score: 8 },
          { id: 'C', text: '倾听他人意见', score: 5 },
          { id: 'D', text: '负责具体执行', score: 6 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_personality_004',
        testId: 'test_personality_001',
        order: 4,
        question: '处理压力时，你通常：',
        options: [
          { id: 'A', text: '保持冷静，理性分析', score: 10 },
          { id: 'B', text: '寻求他人帮助', score: 8 },
          { id: 'C', text: '暂时避开压力源', score: 5 },
          { id: 'D', text: '感到焦虑不安', score: 2 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_personality_005',
        testId: 'test_personality_001',
        order: 5,
        question: '做决定时，你更依赖：',
        options: [
          { id: 'A', text: '逻辑分析和事实', score: 10 },
          { id: 'B', text: '直觉和感受', score: 7 },
          { id: 'C', text: '他人的建议', score: 5 },
          { id: 'D', text: '过往经验', score: 6 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_personality_006',
        testId: 'test_personality_001',
        order: 6,
        question: '在工作环境中，你更喜欢：',
        options: [
          { id: 'A', text: '充满变化和挑战', score: 10 },
          { id: 'B', text: '稳定且有规律', score: 8 },
          { id: 'C', text: '团队合作氛围', score: 7 },
          { id: 'D', text: '独立完成工作', score: 5 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_personality_007',
        testId: 'test_personality_001',
        order: 7,
        question: '对于批评，你通常：',
        options: [
          { id: 'A', text: '虚心接受并改进', score: 10 },
          { id: 'B', text: '感到受伤但会反思', score: 6 },
          { id: 'C', text: '立即为自己辩护', score: 4 },
          { id: 'D', text: '避免听到批评', score: 2 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_personality_008',
        testId: 'test_personality_001',
        order: 8,
        question: '学习新技能时，你更喜欢：',
        options: [
          { id: 'A', text: '理论学习和分析', score: 9 },
          { id: 'B', text: '实践和动手操作', score: 8 },
          { id: 'C', text: '跟随指导步骤', score: 6 },
          { id: 'D', text: '自己摸索尝试', score: 7 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_personality_009',
        testId: 'test_personality_001',
        order: 9,
        question: '在空闲时间，你更愿意：',
        options: [
          { id: 'A', text: '外出社交活动', score: 9 },
          { id: 'B', text: '在家放松休息', score: 7 },
          { id: 'C', text: '学习新知识', score: 8 },
          { id: 'D', text: '运动锻炼身体', score: 8 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_personality_010',
        testId: 'test_personality_001',
        order: 10,
        question: '遇到挫折时，你的第一反应是：',
        options: [
          { id: 'A', text: '立即寻找解决方案', score: 10 },
          { id: 'B', text: '寻求他人的帮助', score: 8 },
          { id: 'C', text: '暂时逃避问题', score: 4 },
          { id: 'D', text: '感到沮丧和失望', score: 2 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_personality_011',
        testId: 'test_personality_001',
        order: 11,
        question: '在购物时，你通常：',
        options: [
          { id: 'A', text: '制定详细清单和预算', score: 8 },
          { id: 'B', text: '随心所欲，喜欢就买', score: 6 },
          { id: 'C', text: '反复比较多家店', score: 7 },
          { id: 'D', text: '很少购物，需求导向', score: 9 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_personality_012',
        testId: 'test_personality_001',
        order: 12,
        question: '对于规则和制度，你的态度是：',
        options: [
          { id: 'A', text: '严格遵守，很少打破', score: 8 },
          { id: 'B', text: '视情况而定，灵活处理', score: 9 },
          { id: 'C', text: '有时会觉得约束太多', score: 5 },
          { id: 'D', text: '更愿意创造自己的规则', score: 6 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_personality_013',
        testId: 'test_personality_001',
        order: 13,
        question: '在家庭聚会中，你通常：',
        options: [
          { id: 'A', text: '主动组织活动', score: 9 },
          { id: 'B', text: '积极参与讨论', score: 7 },
          { id: 'C', text: '安静倾听，偶尔发言', score: 5 },
          { id: 'D', text: '感到不自在，想尽快离开', score: 2 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_personality_014',
        testId: 'test_personality_001',
        order: 14,
        question: '处理金钱时，你更倾向于：',
        options: [
          { id: 'A', text: '谨慎储蓄，以备不时之需', score: 9 },
          { id: 'B', text: '适度消费，享受生活', score: 8 },
          { id: 'C', text: '投资理财，追求收益', score: 8 },
          { id: 'D', text: '金钱不是重要考虑因素', score: 5 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_personality_015',
        testId: 'test_personality_001',
        order: 15,
        question: '在工作中遇到困难时，你更愿意：',
        options: [
          { id: 'A', text: '独自解决，挑战自己', score: 8 },
          { id: 'B', text: '寻求团队协助', score: 9 },
          { id: 'C', text: '向上级寻求指导', score: 7 },
          { id: 'D', text: '回避困难，寻求其他任务', score: 3 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_personality_016',
        testId: 'test_personality_001',
        order: 16,
        question: '对于变化，你的反应是：',
        options: [
          { id: 'A', text: '很快适应，并寻找机会', score: 9 },
          { id: 'B', text: '需要时间消化，但能接受', score: 7 },
          { id: 'C', text: '感到不安，希望保持现状', score: 4 },
          { id: 'D', text: '强烈抗拒，拒绝改变', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_personality_017',
        testId: 'test_personality_001',
        order: 17,
        question: '在朋友关系中，你更重视：',
        options: [
          { id: 'A', text: '深度理解和情感连接', score: 9 },
          { id: 'B', text: '互相支持和信任', score: 8 },
          { id: 'C', text: '共同兴趣和活动', score: 7 },
          { id: 'D', text: '保持距离，君子之交', score: 5 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_personality_018',
        testId: 'test_personality_001',
        order: 18,
        question: '对于学习，你的动力来源是：',
        options: [
          { id: 'A', text: '内在好奇心和求知欲', score: 10 },
          { id: 'B', text: '外部奖励和认可', score: 6 },
          { id: 'C', text: '实际需要和应用', score: 8 },
          { id: 'D', text: '竞争压力和他人期望', score: 5 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_personality_019',
        testId: 'test_personality_001',
        order: 19,
        question: '在休闲娱乐中，你更喜欢：',
        options: [
          { id: 'A', text: '刺激冒险的活动', score: 8 },
          { id: 'B', text: '轻松愉快的聚会', score: 7 },
          { id: 'C', text: '安静舒适的环境', score: 7 },
          { id: 'D', text: '有意义的体验', score: 8 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_personality_020',
        testId: 'test_personality_001',
        order: 20,
        question: '对于未来，你的心态是：',
        options: [
          { id: 'A', text: '充满期待，积极规划', score: 10 },
          { id: 'B', text: '理性分析，稳妥推进', score: 8 },
          { id: 'C', text: '顺其自然，接受安排', score: 6 },
          { id: 'D', text: '有些担忧，感到不安', score: 3 }
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
      },
      {
        _id: 'question_anxiety_003',
        testId: 'test_anxiety_001',
        order: 3,
        question: '面对压力时，你的身体反应通常是：',
        options: [
          { id: 'A', text: '心跳加速、出汗、颤抖', score: 9 },
          { id: 'B', text: '肌肉紧张、头痛', score: 7 },
          { id: 'C', text: '呼吸急促', score: 6 },
          { id: 'D', text: '很少有身体反应', score: 2 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_004',
        testId: 'test_anxiety_001',
        order: 4,
        question: '在公众场合发言时，你会：',
        options: [
          { id: 'A', text: '非常紧张，几乎无法开口', score: 10 },
          { id: 'B', text: '有些紧张但能完成', score: 7 },
          { id: 'C', text: '轻微紧张，但表现正常', score: 4 },
          { id: 'D', text: '不紧张，甚至很享受', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_005',
        testId: 'test_anxiety_001',
        order: 5,
        question: '对于未来可能发生的问题，你经常：',
        options: [
          { id: 'A', text: '过度担心，无法停止思考', score: 10 },
          { id: 'B', text: '偶尔会担心', score: 6 },
          { id: 'C', text: '理性分析可能的解决方案', score: 3 },
          { id: 'D', text: '很少为未来担忧', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_006',
        testId: 'test_anxiety_001',
        order: 6,
        question: '在处理重要任务时，你是否容易分心？',
        options: [
          { id: 'A', text: '经常分心，无法集中注意力', score: 9 },
          { id: 'B', text: '偶尔会分心', score: 6 },
          { id: 'C', text: '能够较好地保持专注', score: 3 },
          { id: 'D', text: '很少分心，专注力很好', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_007',
        testId: 'test_anxiety_001',
        order: 7,
        question: '当别人对你的表现进行评价时，你感到：',
        options: [
          { id: 'A', text: '非常焦虑和不安', score: 10 },
          { id: 'B', text: '有些紧张', score: 6 },
          { id: 'C', text: '能够理性接受', score: 3 },
          { id: 'D', text: '欢迎并感谢反馈', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_008',
        testId: 'test_anxiety_001',
        order: 8,
        question: '你是否有反复检查门窗、电器等行为的习惯？',
        options: [
          { id: 'A', text: '经常这样做，无法控制', score: 10 },
          { id: 'B', text: '偶尔会重复检查', score: 6 },
          { id: 'C', text: '很少有这种行为', score: 3 },
          { id: 'D', text: '从来没有', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_009',
        testId: 'test_anxiety_001',
        order: 9,
        question: '在社交场合，你通常感到：',
        options: [
          { id: 'A', text: '极度不安，想要逃离', score: 10 },
          { id: 'B', text: '有些紧张和不自在', score: 7 },
          { id: 'C', text: '基本舒适', score: 4 },
          { id: 'D', text: '轻松自在，享受其中', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_010',
        testId: 'test_anxiety_001',
        order: 10,
        question: '对于突发事件，你的反应通常是：',
        options: [
          { id: 'A', text: '惊慌失措，不知如何应对', score: 10 },
          { id: 'B', text: '感到紧张，但能处理', score: 6 },
          { id: 'C', text: '能够冷静应对', score: 3 },
          { id: 'D', text: '觉得是挑战，兴奋应对', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_011',
        testId: 'test_anxiety_001',
        order: 11,
        question: '你是否经常感到心跳加速或胸闷？',
        options: [
          { id: 'A', text: '经常出现这些症状', score: 10 },
          { id: 'B', text: '偶尔会这样', score: 6 },
          { id: 'C', text: '很少出现', score: 3 },
          { id: 'D', text: '从来没有', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_012',
        testId: 'test_anxiety_001',
        order: 12,
        question: '在工作中，你是否经常担心自己做不好？',
        options: [
          { id: 'A', text: '总是担心，压力大', score: 10 },
          { id: 'B', text: '经常担心', score: 7 },
          { id: 'C', text: '偶尔担心', score: 4 },
          { id: 'D', text: '很少担心', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_013',
        testId: 'test_anxiety_001',
        order: 13,
        question: '你是否容易因为小事而烦躁？',
        options: [
          { id: 'A', text: '经常因为小事烦躁不安', score: 10 },
          { id: 'B', text: '偶尔会这样', score: 6 },
          { id: 'C', text: '很少这样', score: 3 },
          { id: 'D', text: '几乎不会', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_014',
        testId: 'test_anxiety_001',
        order: 14,
        question: '对于自己的健康状况，你是否经常担心？',
        options: [
          { id: 'A', text: '经常担心，频繁检查身体', score: 10 },
          { id: 'B', text: '偶尔会担心', score: 6 },
          { id: 'C', text: '很少担心', score: 3 },
          { id: 'D', text: '从不担心', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_015',
        testId: 'test_anxiety_001',
        order: 15,
        question: '在需要做决定时，你是否感到特别困难？',
        options: [
          { id: 'A', text: '经常因为做决定而焦虑', score: 10 },
          { id: 'B', text: '有时会感到困难', score: 6 },
          { id: 'C', text: '能够较容易做决定', score: 3 },
          { id: 'D', text: '做决定对我来说很容易', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_016',
        testId: 'test_anxiety_001',
        order: 16,
        question: '你是否经常感到疲劳，即使休息充足？',
        options: [
          { id: 'A', text: '经常感到疲劳', score: 9 },
          { id: 'B', text: '偶尔感到疲劳', score: 6 },
          { id: 'C', text: '很少感到疲劳', score: 3 },
          { id: 'D', text: '精力充沛', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_017',
        testId: 'test_anxiety_001',
        order: 17,
        question: '在人多或嘈杂的环境中，你是否感到不适？',
        options: [
          { id: 'A', text: '经常感到非常不适', score: 10 },
          { id: 'B', text: '偶尔会感到不适', score: 6 },
          { id: 'C', text: '基本能够适应', score: 3 },
          { id: 'D', text: '没有任何不适', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_018',
        testId: 'test_anxiety_001',
        order: 18,
        question: '你是否经常因为焦虑而影响食欲？',
        options: [
          { id: 'A', text: '经常因为焦虑吃不下或暴饮暴食', score: 10 },
          { id: 'B', text: '偶尔会这样', score: 6 },
          { id: 'C', text: '很少影响食欲', score: 3 },
          { id: 'D', text: '焦虑从不影响我的食欲', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_019',
        testId: 'test_anxiety_001',
        order: 19,
        question: '你是否经常需要寻求他人的安慰或保证？',
        options: [
          { id: 'A', text: '经常需要他人的安慰', score: 9 },
          { id: 'B', text: '偶尔会需要', score: 6 },
          { id: 'C', text: '很少需要', score: 3 },
          { id: 'D', text: '几乎不需要', score: 1 }
        ],
        createTime: new Date()
      },
      {
        _id: 'question_anxiety_020',
        testId: 'test_anxiety_001',
        order: 20,
        question: '总体而言，你对生活的满意度如何？',
        options: [
          { id: 'A', text: '经常感到不满意和焦虑', score: 10 },
          { id: 'B', text: '偶尔感到不满意', score: 6 },
          { id: 'C', text: '基本满意', score: 3 },
          { id: 'D', text: '非常满意，生活很美好', score: 1 }
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