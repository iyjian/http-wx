const axios = require('axios')
const axiosRetry = require('axios-retry')
const moment = require('moment')
const crypto = require('crypto')
var randomstring = require("randomstring")
const querystring = require('querystring')
const _ = require('lodash')

class APIClient {
  constructor (conf) {
    this.apiKey = ''
    this.client = axios.create({
      baseURL: conf.apiDomain,
      timeout: 60000
    })

    axiosRetry(this.client, {
      retryDelay: axiosRetry.exponentialDelay,
      retries: 3
    })

    // request
    this.client.interceptors.request.use(config => {

      // 加授权
      const randChar = randomstring.generate({charset: 'alphabetic'})
      const hswebtime = moment().format('x') + '_' + randChar
      config.headers.hswebtime = hswebtime
      if (this.apiKey) {
        config.headers.apiKey = this.apiKey
        config.headers.token = crypto.createHash('md5').update(`${hswebtime}${conf.apiKey}`).digest('hex')
      } else {
        const token = crypto.createHash('md5').update(hswebtime).digest('hex')
        config.headers.token = token
      }

      // 处理post的payload
      config.data = querystring.stringify(config.data)
      // console.log(config)
      return config
    }, function (error) {
      return Promise.reject(error)
    })
    // response
    this.client.interceptors.response.use((response) => {
      if (response.data.code === 1) {
        console.log(response.data)
        return Promise.resolve(response.data.data || {})
      } else {
        return Promise.reject(new Error(response.data.msg))
      }
    }, function (error) {
      return Promise.reject(error)
    })
  }

  /**
   * TODO: 添加好友申请
   *
   * URL：foreign/friends/add
   * extend  OPTIONAL  string  自定义字段，通用回调--'加好友通知'原样返回
   * my_account  REQUIRED  string  登录微信号
   * account REQUIRED  string  微信号|手机号（多个用英文状态下的逗号隔开）
   * content REQUIRED  string  验证消息
   *

   response
   {
    "code": 1,
    "msg": "添加好友申请成功",
   }
   */
  // async addContact () {
  //   //
  // }

  /** TODO: 删除好友
   * URL：foreign/friends/del
   *
   * request
   *
   * my_account  REQUIRED  string  登录微信号
   * to_account  REQUIRED  string  好友微信号
   *
   * response
   * {
   *    "code": 1,
   *    "msg": "发送成功",
   * }
   */
  async delContact () {

  }


  /** TODO: 修改好友备注
   * URL：foreign/friends/remark  remark  REQUIRED  string  备注信息
   my_account  REQUIRED  string  登录微信号
   to_account  REQUIRED  string  好友微信号


   * {
     "code": 1,
     "msg": "发送成功",
     }
   */
  async modifyRemark () {

  }

   /** TODO: 检测僵尸粉
   * URL：foreign/Friends/checkZombie
   * callback_url  OPTIONAL  string  回调地址
     my_account  REQUIRED  string  登录微信号
     account REQUIRED  string  要检测的微信号
   *
   */
  async checkFriendship () {

  }


   /** TODO: 获取单聊信息
   * URL：foreign/group/getSingle
   * page  OPTIONAL  integer 当前页码 ：默认1
     num OPTIONAL  integer 每页显示条数 ：默认30
     day OPTIONAL  integer 获取最近多少天的记录（默认全部）
     start_day OPTIONAL  string  开始日期
     end_day OPTIONAL  string  结束日期
     content OPTIONAL  string  消息内容
     content_type  OPTIONAL  integer 消息类型：1文字、2图片、3表情、4语音、5视频、6文件
     my_account  REQUIRED  string  登录微信号
     account REQUIRED  string  好友微信号


   * {
     "code": 1,
     "msg": "获取成功",
     "total": 68,
     "per_page": 30,
     "current_page": 1,
     "data": [
     {
     "id": 82203,
     "my_id": 2975903,
     "to_id": 3370101,
     "type": 1,
     "content": "asasddsa",
     "content_type": 1,
     "status": 1,
     "create_time": 1564969089,
     "file_name": "",
     "voice_len": 0,
     "title": "",
     "describe": "",
     "my_thumb": "http://wx.qlogo.cn/mmhead/ver_1/WBpznyBYp7Dslex9YWual3KVia1HrrlPFOxD72hGg7H4Zr9yQzrA8JGM3cG5gB29A5qKzOicOzX6ed0ms2icL0JosmsejCMcOiax5wBKtsf9ekc/0",
     "my_account": "Forever4664666",
     "to_thumb": "http://wx.qlogo.cn/mmhead/ver_1/38VJ1b4zbRCwEK0UXLkXpo8NTotHzb3KeOjNRYs7tWZX8iaB1tWZ1Uj8JVtaAgvFGlkAVunfIIEQBRt83NG97VKLOoNk8axCLQmaibwu754A0/132",
     "to_name": "Gun🦑",
     "to_account": "sy158507wyz",
     "to_sex": 2,
     "to_area": "江苏 南京",
     "date": "2019-08-05 09:38:09",
     "form_name": "鱿小鱼"
     },
     ]
     }
   */
  async getPrivateMessages () {

  }


  // 搜索微信号信息 (此接口是回调性质，缓存需开发者自行处理)
   /**
   * URL：/foreign/wacat/newGetWacatInfo
   *
   * request:
   *
   * extend      OPTIONAL  string  扩展字段回调时原样返回
     my_account  REQUIRED  string  微信号
     account     REQUIRED  string  要查询的微信号或者微信ID

     response:

   * {
      "code": 1,
      "msg": "xxxxx",
     }
   */
  async searchContactInfo (from, to, extend) {
    return this.client.post('/foreign/wacat/newGetWacatInfo', {
      my_account: from,
      account: to,
      extend
    })
  }

  /** TODO: 好友待添加列表
   * URL:foreign/friends/newFriendList
   * my_account  REQUIRED  string  登录微信号
     status  REQUIRED  integer -1：所有、 0：待验证、 1：已通过 、2：已过期


   * {
      "code": 1,
      "msg": "成功",
      "data": [
        {
      "id": 26276,
      "my_account": "Forever4664666",
      "account": "Wangyr319",
      "nickname": "彭顺袭",
      "sex": 0,
      "sign": "",
      "headHDImgUrl": "",
      "status": 2,
      "start_time": "2019-08-21 14:23:35",
      "check_msg": "1234564",
      "source": "通过微信号搜索添加",
      "sourceNickname": "",
      "sourceAccount": "",
      "sourceGroupNumber": ""
     },
     ]
     }
   */
  async getFriendRequestList () {

  }

  /**
   * 通过好友添加申请
   *
   * URL:foreign/friends/passAddFriends
   *
   * request
   *
   * my_account  REQUIRED  string  登录微信号
   * account     REQUIRED  string  对方微信号
   *
   *
   */
  async acceptFriendship (from, to) {
    return this.client.post('/foreign/friends/passAddFriends', {
      my_account: from,
      account: to
    })
  }

  /** TODO: 获取微信好友列表
   * URL: /foreign/Friends/syncFriendList
   *
   *  my_account  REQUIRED  string  扫码登录的微信号
      callback_url  REQUIRED  string  回调地址


   * {
       'currentPage': ['1'],
        'info': ['[
       {
         "account":"Wangyr319",
        "form_name":"六合吴彦祖",
        "area":"阿尔巴尼亚",
        "disturb":3,,
        "account_alias":"wxid_86vtqdxxup5q12",
        "thumb":"http:\\/\\/wx.qlogo.cn\\/mmhead\\/ver_1\\/B0gzzsbgXsoSbqdT2aGt9YYbMthXYibIy8Z4eaJ25Mttobd4DcibtZrUQzHLxxMgHSeibLkKZwPUIicrGSjeEQmF82iaDQCECrichXnefwCC6OQzc\\/0",
        "tag":"",
        "description":"男人要有担当",
        "v1":"v1_fc035736479df7f0cb6072b5aa1baa82419f4d2b4f6f4e62ac7da03753bf79035d3e54359e251732882ae53c56ad17fa@stranger",
        "name":"华哥",
        "sex":1
         }
        ]'],
        'my_account': ['Forever4664666'],
        'total': ['21']
             }
   */
  async getAllContacts (from) {
    return this.client.post('/foreign/Friends/syncFriendList', {
      my_account: from,
      callback_url: conf.callback.CONTACTS
    })
  }

  /**
  *
  * 获取微信信息
  *
  * URL: /foreign/message/wxInfo
  *
  /**
   * 获取微信群列表
   */
  async getAllGroups (from){
    return this.client.post('/foreign/group/groupList', {
      my_account: from,
      type: 1
    })
  }

  /**
   * 获取某个群的详细信息
   */
  async getGroupInfo (from, to){
    return this.client.post('/foreign/group/getGroupInfo', {
      my_account: from,
      g_number: to
    })
  }


  /** 获取微信信息
  *
  * URL: /foreign/message/wxInfo
  *
  * request:
  *
  * my_account  REQUIRED  string  微信号
  *
  * response:
  *
  * {
      "code": 1,
      "msg": "获取成功",
      "data": {
        "account": "Forever4664666",
        "account_alias": "wxid_6mq1pu8ngj3r22",
        "name": "为了更美好的明天而战",
        "thumb": "http://wx.qlogo.cn/mmhead/ver_1/OQOjicibeQpueibfsV9ib1mRR0eygKxWial1xOwOOR36j4wZYyYsINbHb1JUcL2oleLxnenffFuGd6bprvpyhicBVdXJhibb25mrXs9E3hJPQnRTtw/0",
        "sex": 2,
        "area": "",
        "description": "",
        "is_online": 1
      }
    }
  */
  async getBotInfo (from) {
    return this.client.post('/foreign/message/wxInfo', {
      my_account: from
    })
  }

  /** 发送文本消息
   * URL:foreign/message/send
     file_name     OPTIONAL  string  文件名称
     my_account    REQUIRED  string  扫码登录的微信号
     to_account    REQUIRED  string  好友微信号|微信群号
     content       REQUIRED  string  内容 （语音、文件、图片都是链接地址）
     content_type  REQUIRED  string  1文本|2图片|4语音必须是silk文件，MP3的代码可以自己处理|5视频|6文件|15动图
     type          OPTIONAL  string  1单聊，2群聊（默认1）
     img_md5       OPTIONAL  string  动图必须图片的MD5
     img_size      OPTIONAL  string  动图的文件大小

   * {
     "code": 1,
     "msg": "发送成功",
     }

   */
  async sendTextMessage (from, to, content) {
    let type = 1 // 单聊
    if (from.indexOf('@chatroom') !== -1) type = 2

    return this.client.post('/foreign/message/send', {
      my_account: from,
      to_account: to,
      content,
      content_type: 1, //  1文本|2图片|4语音必须是silk文件，MP3的代码可以自己处理|5视频|6文件|15动图
      type
    })
  }

  /**
   * 发送图片消息和发送文本消息用的是同一个接口哦
   * @param {*} from
   * @param {*} to
   * @param {*} imageUrl
   */
  async sendImageMessage (from, to, imageUrl) {
    let type = 1 // 单聊
    if (to.indexOf('@chatroom') !== -1) type = 2

    return this.client.post('/foreign/message/send', {
      my_account: from,
      to_account: to,
      content: imageUrl,
      content_type: 2, //  1文本|2图片|4语音必须是silk文件，MP3的代码可以自己处理|5视频|6文件|15动图
      type
    })
  }

  /** TODO: 发送名片消息
   * URL:foreign/message/wacatCard
   *
   * request
   *
     my_account  REQUIRED  string  扫码登录的微信号
     to_account  REQUIRED  string  好友微信号|微信群号
     card_name REQUIRED  string  推荐人微信号/公众号微信号（支持个人名片、公众号名片）
     type  OPTIONAL  string  1单聊，2群聊

   * response
   *
   * {
     "code": 1,
     "msg": "发送成功",
     }
   *
   */
  async sendContactCard () {

  }

  /**
   * 发送URL链接
   * URL: /foreign/message/sendUrl
   *
   * request
   *
     thumb        OPTIONAL  string  链接图片地址
     describe     OPTIONAL  string  链接描述
     my_account   REQUIRED  string  扫码登录的微信号
     to_account   REQUIRED  string  好友微信号|微信群号
     url          REQUIRED  object  链接地址
     title        REQUIRED  string  链接标题
     type         OPTIONAL  integer 1单聊，2群聊

     response:

     {
      "code": 1,
      "msg": "发送成功",
     }
   */
  async sendUrlMessage (from, to, title, desc, url, thumb) {
    let type = 1 // 单聊
    if (to.indexOf('@chatroom') !== -1) type = 2

    return this.client.post('/foreign/message/sendUrl', {
      my_account: from,
      to_account: to,
      url,
      title,
      describe: desc,
      thumb,
      type
    })
  }

  /**
   *  发送小程序
   * 小程序[DNA LobbyHobby]
   * [ID:gh_beaec24a0c9d@app]
   * [标题:欢迎加入DNA Cafe大家庭]
   * [描述:DNA LobbyHobby]
   * [预览图地址: 30570201000450304e0201000204a897175902030f5259020430dccdcb02045da593ee0429777875706c6f61645f777869645f763575687a30667a35737471323238335f313537313133323339370204010c00030201000400]
   * [预览图密钥: 7aee0f9d216d503f17f3bd4e1263a366]
   * [页面:pages/vip-index/vip-index.html]
   */
   /**
    *
    *
    * URL: /foreign/message/sendApp
    *
    * request
    *
      page_path    OPTIONAL  string  小程序跳转页面
      app_name     REQUIRED  string  小程序的id (小程序相关参数如不清楚，可以发送小程序消息，通过消息回调获取到)
      title        REQUIRED  string  小程序名称
      thumb_key    OPTIONAL  string  小程序预览图密钥
      my_account   REQUIRED  string  扫码登录的微信号
      to_account   REQUIRED  string  好友微信号|微信群号
      describe     OPTIONAL  string  小程序描述
      thumb_url    OPTIONAL  string  小程序预览图地址
      type         OPTIONAL  integer 1单聊，2群聊

      response:

      {
        "code": 1,
        "msg": "发送成功",
      }
    */
    async sendAppMessage (from, to, pagePath, appName, title, thumbKey, desc, thumbUrl) {

      let type = 1 // 单聊

      if (to.indexOf('@chatroom') !== -1) type = 2

      return this.client.post('/foreign/message/sendApp', {
        page_path: pagePath,
        app_name: appName,
        title,
        thumb_key: thumbKey,
        my_account: from,
        to_account: to,
        describe: desc,
        thumb_url: thumbUrl,
        type
      })
    }

  /** 设置群公告
   * URL: /foreign/Group/setGroupNotic
   *
   * request
     my_account  REQUIRED  string  登录微信号
     number      REQUIRED  string  微信群号
     notice      REQUIRED  string  公告内容

    response

    {
      "code": 1,
      "msg": "设置群公告成功",
    }
   */
  async setRoomAnnocement (from, to, content) {

    return this.client.post('/foreign/Group/setGroupNotic', {
      my_account: from,
      number: to,
      notice: content
    })
  }


  //
  /** 创建微信群
   * URL: /foreign/group/found
   *
   * request
   *
      group_name  REQUIRED  string  创建群昵称
      extend  OPTIONAL  string  扩充字段,可传入自定义数据
      my_account  REQUIRED  string  登录微信号
      account REQUIRED  string  微信号（多个用英文状态下的逗号隔开）
      callback_url  OPTIONAL  string  回调地址url（接收结果)

      response

      "data": {
        "account": "22156949594@chatroom",
        "extend": " ",
        "name": "从来处来从去处去",
        "headerImage": "",
      }
   */
  async createRoom (from, groupName, wxIds, extend) {
    return this.client.post('/foreign/group/found', {
      my_account: from,
      group_name: groupName || '默认群',
      account: _.isArray(wxIds) ? wxIds.join(',') : wxIds,
      extend,
      callback_url: conf.callback.CREATEROOM
    })
  }

  /**
   * TODO: 退出微信群
   * URL:foreign/group/outGroup
   * my_account  REQUIRED  string  微信号
     g_number  REQUIRED  string  微信群群号

     {
     "code": 1,
     "msg": "发送成功",
     }
   */
  async exitRoom () {

  }


  /**
   * TODO: 修改群名称
   * URL:  /foreign/group/setName
     name         REQUIRED  string  微信群名称
     my_account   REQUIRED  string  登录微信号
     g_number     REQUIRED  string  微信群群号

     {
     "code": 1,
     "msg": "发送成功",
     }
   */
  async setRoomTopic (from, to, roomName) {
    return this.client.post('/foreign/group/setName', {
      my_account: from,
      g_number: to,
      name: roomName
    })
  }


  /**
   * 邀请新成员
   * URL: /foreign/group/addMember
   *
     g_number     REQUIRED  string  微信群群号
     my_account   REQUIRED  string  登录微信号
     account      REQUIRED  string  群成员微信号（多个用英文状态下的逗号隔开）

     {
     "code": 1,
     "msg": "发送成功",
     }
   */
  async addRoomMember (from, groupId, wxIds) {
    return this.client.post('/foreign/group/addMember', {
      g_number: groupId,
      my_account: from,
      account: wxIds
    })
  }


  /**
   * 踢出群成员
   * URL: /foreign/group/delMember
   *
   * request
   *
     account     REQUIRED  string  群成员微信号
     my_account  REQUIRED  string  登录微信号
     g_number    REQUIRED  string  微信群群号

     {
     "code": 1,
     "msg": "发送成功",
     }
   */
  async deleteRoomMember (from, groupId, wxId) {
    return this.client.post('/foreign/group/delMember', {
      g_number: groupId,
      my_account: from,
      account: wxId
    })
  }


  /**
   *
   * 群聊@成员
   *
   * URL: /foreign/group/groupAt
   *
     my_account  REQUIRED  string  登录微信号 (有wxid优先传wxid)
     account REQUIRED  string  微信群号
     atUser  REQUIRED  string  微信用户id（假如@多人，用英文逗号, 拼接）
     content REQUIRED  string  '@'+成员的昵称+空格+内容

     {
     "code": 1,
     "msg": "发送成功",
     }
   */
  async atRoomMember (from, to, atList, content) {

    return this.client.post('/foreign/group/groupAt', {
      my_account: from,
      account: to,
      atUser: atList,
      content
    })

  }

  /**
   * TODO: 获取群二维码
   * URL: /foreign/group/qrcode
   *
   * request
   *
     my_account    REQUIRED  string  登录微信号
     g_number      REQUIRED  string  微信群群号（先调用获取群列表接口）
     callback_url  REQUIRED  string  回调地址url（接收结果）

     {
        'group_nickname': '',
        'group_number': '22096545806@chatroom',
        'headimg': '',
        'owner': '',
        'qrcode': 'https://wkgj.oss-cn-beijing.aliyuncs.com/images/20190908/7002da41c1f70de8e098cde079cb09d0.png',
        'type': 'getqrcode',
      }
   */
  async getRoomQRCode () {

  }


  //
  /** TODO: 获取群聊信息
   * URL: /foreign/group/getGroup
   *
   * request
   *
     page       OPTIONAL  integer 当前页码 ：默认1
     num        OPTIONAL  integer 每页显示条数 ：默认30
     day        OPTIONAL  integer 获取最近多少天的记录（默认全部）
     start_day  OPTIONAL  string  开始日期
     end_day    OPTIONAL  string  结束日期
     content    OPTIONAL  string  消息内容
     content_type  OPTIONAL  integer 消息类型：1文字、2图片、3表情、4语音、5视频、6文   件
     my_account    REQUIRED  string  登录微信号
     account       REQUIRED  string  微信群号

     {
          "code": 1,
           "msg": "获取群聊记录成功",
          "total": 12,
          "per_page": 30,
          "current_page": 1,
          "data": [
            {
          "id": 201231,
          "gro_id": 11579,
           "wac_id": 2975903,
          "content": "你将\"🍍老菠萝s\"移出了群聊",
          "content_type": 10,
          "status": 1,
          "create_time": 1564973007,
          "file_name": "",
          "voice_len": 0,
          "title": "",
          "describe": "",
          "wac_thumb": "http://wx.qlogo.cn/mmhead/ver_1/WBpznyBYp7Dslex9YWual3KVia1HrrlPFOxD72hGg7H4Zr9yQzrA8JGM3cG5gB29A5qKzOicOzX6ed0ms2icL0JosmsejCMcOiax5wBKtsf9ekc/0",
          "wac_name": "为了更美好的明天而战",
          "wac_account": "Forever4664666",
          "wac_sex": 2,
          "wac_area": "",
          "date": "2019-08-05 10:43:27",
          "is_friend": 1,
          "form_name": ""
             },
             ]
              }
   */
  async getRoomMessages () {

  }


  //
  /**
   *  TODO: 自动加入群聊 (我不明白这个什么意思，也不知道怎么起名字)
   *
   *  URL: /foreign/group/groupSet
   *
   *  request
      account REQUIRED  string  微信号
      status  OPTIONAL  integer 0-关闭 1-开启

     {
     "code": 1,
     "msg": "发送成功",
     }
   */
  // async () {

  // }


  //
  /**
   * TODO: 获取群详细信息
   * URL:foreign/group/groupInfo
     y_account  REQUIRED  string  微信号
     g_number  REQUIRED  string  群号

     {
     "code": 1,
     "msg": "XXXX",
     }
   */
  async getRoomBasicInfo () {

  }


  /** 获取微信群列表
   *
   * URL: /foreign/group/get
     account  REQUIRED  string  微信号
     page     OPTIONAL  integer 分页（默认第1页
     num      OPTIONAL  integer 每页条数，取值范围10-100（默认10）

     {
       "code": 1,
       "msg": "获取成功",
       "page": 1,
       "total": 11,
       "data": [
       {
        "number": "17957579876@chatroom",
        "name": "测试发消息",
        "thumb":"http://wx.qlogo.cn/mmcrhead/qE9MKluetOnricdax5XnxVibcLS2AiaYl1RCUFZZOIkEy9dtjjS7jA3NSb7iaGJKesyQtZ1R4AHpMGHSR6Uia6SanMAYaZ56x6V91/0",
        "disturb": 2
        "author": "wxid_86vtqdxxup5q12"
       },
       {
        "number": "23587646413@chatroom",
        "name": "at dawn,12,为了更美好的明天而战",
        "thumb": "http://wx.qlogo.cn/mmcrhead/k7dZEF2QGU5Wl6JuBiamlE0YSj25xSXVXYx0O04xQ02L8BQKQSvAOCSDGZfTAsF3jibHahAk8ib35Sfy8OPo9bDZfx5Mpkj2Ve3/0",
        "disturb": 2
        "author": "wxid_86vtqdxxup5q12"
       },
       ]
       }
   */
  async getRoomList (from) {
    let page = 1
    let num = 100

    return this.client.post('/foreign/group/get', {
      account: from,
      page,
      num
    })
  }


  /**
   *  TODO: 获取微信群群主
   *  URL: /foreign/group/owner
   *
   *  request
   *
      my_account  REQUIRED  string  登录微信号
      g_number    REQUIRED  string  微信群群号


      {
       "code": 1,
       "msg": "获取成功",
       "data":{
       "author": "wxid_6mq1pu8ngj3r22"
      },
      }
   */
  async getRoomOwner () {

  }


  /**
   *  TODO: 获取微信群成员
   *
   *  URL: /foreign/Group/getAllMembers
   *
   *  request
   *
      number  REQUIRED  string  群号
      my_account  REQUIRED  string  扫码登录的微信号
      callback_url  REQUIRED  string  回调地址


      {
          "code": 1,
          "msg": "发送成功",
      }
   */
  async getRoomMembers () {

  }


  /**
   *  发送群邀请链接 （需本人同意方可入群）
   *
   *  URL: /foreign/group/invateMember
   *
   *  request
   *
      g_number    REQUIRED  string  微信群群号
      my_account  REQUIRED  string  登录微信号
      account     REQUIRED  string  要邀请的微信 【优先微信id】


            {
          "code": 1,
          "msg": "发送成功",
      }
   */
  async sendRoomInvitation (from, groupId, wxId) {
    return this.client.post('/foreign/group/invateMember', {
      g_number: groupId,
      my_account: from,
      account: wxId
    })
  }


  /** TODO: 发送朋友圈
   *  URL:foreign/FriendCircle/release
      my_account  REQUIRED  string  登录的微信号
      text  REQUIRED  string  发送朋友圈内容
      media_url REQUIRED  string  图片url最多9张, 用{#}号分隔 | 视频{#}缩略图| 链接URL{#}缩略图，没有缩略图也要带上{#}
      media_type  REQUIRED  string  1:图片  2:文字  3:视频
      callback_url  OPTIONAL  string  回调地址url(接收结果)
      title OPTIONAL  string  链接标题

            {
          "code": 1,
          "msg": "发送成功",
      }
   */
  async sendMoment () {

  }

  /**
   *  朋友圈 -朋友圈点赞
   *
   *  URL:foreign/FriendCircle/point
      my_account  REQUIRED  string  登录的微信号
      circle_id REQUIRED  string  朋友圈id
      content OPTIONAL  string  评论内容
      point_type  REQUIRED  string  1-点赞 2-评论

            {
          "code": 1,
          "msg": "发送成功",
      }
   */

  async praiseMoment () {

  }

  /**
   *  获取朋友圈列表
   *  URL:foreign/FriendCircle/getList
      statusId  OPTIONAL  string  根据id获取指定朋友圈信息
      extend  OPTIONAL  string  自定义拓展字段 回调时会原样返回
      my_account  REQUIRED  string  登录的微信号
      to_account  OPTIONAL  string  查询指定微信号的个人相册
      load  REQUIRED  integer 请求加载次数 第一次请求传 1 （获取最新的朋友圈） 第二次后都传 2 (获取上一次之后的朋友圈记录)
      callback_url  REQUIRED  string  获取列表数据回调的url

            {
          "code": 1,
          "msg": "发送成功",
      }
   */
  async getSnsTimeline () {

  }

  /**
   *  登陆并获取apikey
   *  URL:foreign/auth/login
      password  REQUIRED  string  开发者密码
      phone REQUIRED  string  开发者账号

      {
        "code": 1,
        "msg": "登录成功",
        "data": {
          "apikey": "rP3CkHJkkn5WvnAHCNcwde27s_kyCNY1NesqGAFcaz6AfZCvxl_DUdc5tmUuKo3",
          "type": 1
               }
      }
   */
  async login () {
    const response = await this.client.post('/foreign/auth/login', {
      phone: conf.userName,
      password: conf.passwd
    })
    this.apiKey = response.apikey
    return this.client.post('/foreign/user/setUrl', {
      callbackSend: conf.callback.COMMON,
      delfriendlog: conf.callback.DELFRIEND,
      newfriendlog: conf.callback.NEWFRIEND,
      messagelog: conf.callback.MESSAGE,
      crowdlog: conf.callback.GROUPMESSAGE,
      addfriendlog: conf.callback.ADDFRIEND,
      wacatout: conf.callback.STATUS,
      addgrouplog: conf.callback.GROUPEVENT
    })

  }

  // 获取登陆二维码
   /**
   *  URL:foreign/message/scanNew
      extend  OPTIONAL  string  用户自定义内容，回调时返回
      account OPTIONAL  string  微信号(微信第一次扫码不传，以后必须传，否则您可能会出现登录设备已满，封号等情况）
      callback_url  REQUIRED  string  回调地址url（用于接收二维码、开发者需提供外网可访  访问的接口方法）

      {
          "code": 1,
          "msg": "添加设备登录任务成功",
          "data": {
                "task_id": 33950
                 }
      }
   */
  async getLoginQRCode (account, extend) {
    return this.client.post('/foreign/message/scanNew', {
      extend,
      account,
      callback_url: conf.callback.QRCODE
    })
  }

  // 登出
  /**
   *  URL: foreign/user/out
   *
   * {
         "code": 1,
         "msg": "退出登录成功",
      }
   */
  async logout (wxId) {
    return this.client.post('/foreign/wacat/out', {
      my_account: wxId
    })
  }

  /**
   * 查看微信在线状态
   * URL: /foreign/message/wxStatus
   *
   * request:
   *
   * my_account REQUIRED  string  微信号
   *
   * response:
   *
   * {
        "code": 1,
        "msg": "获取成功",
        "data": {
          "status": 1  //1-在线 0-离线
        }
      }
   *
   */
  async getLoginStatus (from) {
    return this.client.post('/foreign/message/wxStatus', {
      my_account: from
    })
  }

}

module.exports = apiClient
