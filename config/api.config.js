const isPro = Object.is(process.env.NODE_ENV, 'production')

module.exports = {
  baseUrl: isPro ? 'https://smp.hengtech.com.cn/iot-controller/api' : 'api/'
}
