const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const { fileID, tempFilePath } = event
    
    if (!fileID && !tempFilePath) {
      throw new Error('缺少文件参数')
    }
    
    let uploadResult
    
    if (fileID) {
      // 如果已经有fileID，直接返回
      uploadResult = { fileID }
    } else {
      // 上传临时文件到云存储
      uploadResult = await cloud.uploadFile({
        cloudPath: `psychology-test/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`,
        fileContent: event.fileContent,
        contentType: 'image/png'
      })
    }
    
    // 获取临时下载URL
    const fileURL = await cloud.getTempFileURL({
      fileList: [uploadResult.fileID]
    })
    
    return {
      success: true,
      fileID: uploadResult.fileID,
      fileURL: fileURL.fileList[0].tempFileURL
    }
    
  } catch (error) {
    console.error('图片上传失败：', error)
    return {
      success: false,
      error: error.message
    }
  }
}