// 云环境配置模板
// 请根据您的实际情况替换以下配置

// 方案1：如果是新用户，还没有云环境
// 请在微信开发者工具中点击"云开发" -> "开通云开发"创建云环境

// 方案2：已经有云环境，但需要找到正确的环境ID
// 在微信开发者工具中：
// 1. 点击右上角"云开发"按钮
// 2. 进入云开发控制台
// 3. 在环境设置中查看"环境ID"

const CLOUD_CONFIG = {
  // 请将下面的 'test-1' 替换为您的实际云环境ID
  env: 'your-cloud-env-id-here', // 例如: 'cloud1-xxx' 或 'development-xxx'
  
  // 备用配置示例（根据您的环境选择其中一个）
  // env: 'prod-xxxxx',           // 生产环境
  // env: 'dev-xxxxx',            // 开发环境
  // env: 'test-xxxxx',           // 测试环境
}

// 使用示例：
// wx.cloud.init({
//   env: CLOUD_CONFIG.env,
//   traceUser: true
// })

console.log('请更新 CLOUD_CONFIG.env 为您的实际云环境ID')
console.log('云环境ID可以在微信开发者工具的云开发控制台中获取')

module.exports = CLOUD_CONFIG