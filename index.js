const { Wechaty } = require('wechaty')
const schedule = require('./schedule/index')

const config = require('./config/index')
const superagent = require('./superagent/index')

//  二维码生成
function onScan(qrcode, status) {

  require('qrcode-terminal').generate(qrcode) // 在console端显示二维码

  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')

  console.log(qrcodeImageUrl)
}

async function onLogin(user) {
  console.log(`贴心小助理${user}登录了`)

  let contact = await bot.Contact.find({ name: config.NICKNAME })
  await contact.say('hello') 
  schedule.setSchedule('00 00 14 * * *', () => {
    console.log('你的贴心小助理开始工作啦！')
    main()
  })
  schedule.setSchedule('00 00 00 * * *', () => {
    async function name(){
      let contact = await bot.Contact.find({ name: config.NICKNAME }) // 获取你要发送的联系人
      let one = await superagent.getOne() //获取每日一句
      let weather = await superagent.getWeather() //获取天气信息
      // let today = await untils.formatDate(new Date()) //获取今天的日期
      let data = getDistanceSpecifiedTime()
      let str = '早安'
      try {
        logMsg = str
        await contact.say(str) // 发送消息
      } catch (e) {
        logMsg = e.message
      }
    }
    name()
    
  })
}

function getDistanceSpecifiedTime(dateTime='2018-11-29ss') {
  // 指定日期和时间
  var EndTime = new Date(dateTime);
  // 当前系统时间
  var NowTime = new Date();
  var t = NowTime.getTime() - EndTime.getTime()
  var d = Math.floor(t / 1000 / 60 / 60 / 24);

  return d
}


async function main() {
  let logMsg
  let contact = await bot.Contact.find({ name: config.NICKNAME }) || await bot.Contact.find({ alias: config.NAME }) // 获取你要发送的联系人
  let one = await superagent.getOne() //获取每日一句
  let weather = await superagent.getWeather() //获取天气信息
  // let today = await untils.formatDate(new Date()) //获取今天的日期
  let data = getDistanceSpecifiedTime()
  let str = `<br>相识${data}天<br>` +
    '<br>今日天气<br>' + weather.weatherTips + '<br>' + weather.todayWeather + '<br>每日一句:<br>' + one + '<br><br>' + '————————最爱你的hyy'
  try {
    logMsg = str
    await contact.say(str) // 发送消息
  } catch (e) {
    logMsg = e.message
  }
  console.log(logMsg)
}

const onMessage = async (msg) => {
  const contact = msg.from() // 发消息人
  const content = msg.text() //消息内容
  const room = msg.room() //是否是群消息

  if (msg.self()) {
    return
  }

}

const bot = new Wechaty({ name: 'WechatEveryDay' })
bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('message', onMessage)
bot.start()
  .then(() => console.log('开始登陆微信'))
  .catch(e => console.error(e))