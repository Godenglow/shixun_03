// 云函数部署检查脚本
// 在微信开发者工具控制台中运行此代码，检查云函数状态

async function checkCloudFunctions() {
  console.log('=== 云函数状态检查 ===')
  
  const functions = ['login', 'generateReport', 'uploadImage', 'initDatabase']
  
  for (const funcName of functions) {
    try {
      console.log(`检查云函数: ${funcName}`)
      const res = await wx.cloud.callFunction({
        name: funcName,
        data: { check: true }
      })
      console.log(`✅ ${funcName}: 部署成功`, res)
    } catch (err) {
      console.error(`❌ ${funcName}: 部署失败`, err.message)
    }
  }
}

// 运行检查
console.log('请在微信开发者工具控制台中运行: checkCloudFunctions()')
console.log('或者手动检查每个云函数是否已部署')

// 导出函数供控制台使用
if (typeof window !== 'undefined') {
  window.checkCloudFunctions = checkCloudFunctions
}