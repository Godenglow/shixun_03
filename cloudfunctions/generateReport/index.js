const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { testId, answers, userInfo } = event
  const wxContext = cloud.getWXContext()
  
  try {
    // 获取测试信息
    const testRes = await db.collection('tests').doc(testId).get()
    const test = testRes.data
    
    // 获取题目信息
    const questionsRes = await db.collection('questions')
      .where({
        testId: testId
      })
      .orderBy('order', 'asc')
      .get()
    
    const questions = questionsRes.data
    
    // 计算得分
    let totalScore = 0
    const answerDetails = []
    
    for (let i = 0; i < answers.length; i++) {
      const question = questions[i]
      const userAnswer = answers[i]
      const option = question.options.find(opt => opt.id === userAnswer)
      
      if (option) {
        totalScore += option.score
        answerDetails.push({
          questionId: question._id,
          answer: userAnswer,
          score: option.score
        })
      }
    }
    
    // 生成报告
    let result = {}
    
    // 根据不同类型的测试生成不同的报告
    if (test.type === 'personality') {
      result = generatePersonalityReport(totalScore, test)
    } else if (test.type === 'anxiety') {
      result = generateAnxietyReport(totalScore, test)
    } else {
      result = generateGeneralReport(totalScore, test)
    }
    
    // 保存测试结果到数据库
    const recordData = {
      _openid: wxContext.OPENID,
      testId: testId,
      testTitle: test.title,
      answers: answerDetails,
      totalScore: totalScore,
      result: result,
      createTime: db.serverDate(),
      userInfo: userInfo
    }
    
    const recordRes = await db.collection('records').add({
      data: recordData
    })
    
    return {
      success: true,
      recordId: recordRes._id,
      result: result,
      totalScore: totalScore
    }
    
  } catch (error) {
    console.error('生成报告失败：', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 性格测试报告生成
function generatePersonalityReport(score, test) {
  let level = ''
  let description = ''
  let advice = ''
  
  if (score >= 80) {
    level = '外向型'
    description = '你是一个性格外向的人，喜欢与人交往，充满活力。'
    advice = '继续保持你的社交活力，但也要注意给自己一些独处的时间。'
  } else if (score >= 60) {
    level = '中间偏外向'
    description = '你的性格比较均衡，既有外向的一面，也有内向的一面。'
    advice = '你的适应能力很强，可以在不同场合下调整自己的状态。'
  } else if (score >= 40) {
    level = '中间偏内向'
    description = '你倾向于内向，喜欢安静的环境，但不排斥社交。'
    advice = '适当参与一些社交活动，有助于拓展人际关系。'
  } else {
    level = '内向型'
    description = '你是一个性格内向的人，喜欢独处，思考深入。'
    advice = '你的深度思考是你的优势，可以尝试在小范围内分享你的想法。'
  }
  
  return {
    level: level,
    description: description,
    advice: advice,
    score: score,
    maxScore: 100
  }
}

// 焦虑测试报告生成
function generateAnxietyReport(score, test) {
  let level = ''
  let description = ''
  let advice = ''
  
  if (score >= 70) {
    level = '重度焦虑'
    description = '你的焦虑水平较高，可能会影响到日常生活。'
    advice = '建议寻求专业心理咨询师的帮助，学习一些放松技巧。'
  } else if (score >= 50) {
    level = '中度焦虑'
    description = '你有一定程度的焦虑，需要注意情绪管理。'
    advice = '可以尝试一些放松训练，如深呼吸、冥想等。'
  } else if (score >= 30) {
    level = '轻度焦虑'
    description = '你的焦虑水平在轻度范围内，属于正常反应。'
    advice = '保持良好的生活习惯，适当运动有助于缓解焦虑。'
  } else {
    level = '正常'
    description = '你的焦虑水平在正常范围内。'
    advice = '继续保持良好的心理状态，定期进行自我检查。'
  }
  
  return {
    level: level,
    description: description,
    advice: advice,
    score: score,
    maxScore: 100
  }
}

// 通用测试报告生成
function generateGeneralReport(score, test) {
  const percentage = Math.round((score / test.maxScore) * 100)
  
  return {
    level: percentage >= 70 ? '优秀' : percentage >= 50 ? '良好' : percentage >= 30 ? '一般' : '需要改进',
    description: `你的得分是${score}分，占总分的${percentage}%。`,
    advice: '继续保持努力，关注自己的心理健康状态。',
    score: score,
    maxScore: test.maxScore || 100
  }
}