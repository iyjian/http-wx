const conf = {
  apiDomain: 'http://admin.wkgjhome.com',
  apiKey: '94648a67abad5b75aa4935af8cc6edfa62920080d4e4dfc2e7696eb43e391202',
  userName: '15601752476',
  passwd: 'webot12369852',
  callback: {
    CREATEROOM: `${endpoint}/callback/createroom`,
    COMMON: `${endpoint}/callback/other`,
    DELFRIEND: `${endpoint}/callback/delfriendlog`,
    NEWFRIEND: `${endpoint}/callback/newfriendlog`,
    MESSAGE: `${endpoint}/callback/messagelog`,
    GROUPMESSAGE: `${endpoint}/callback/crowdlog`,
    ADDFRIEND: `${endpoint}/callback/addfriendlog`,
    STATUS: `${endpoint}/callback/wacatout`,
    GROUPEVENT: `${endpoint}/callback/addgrouplog`,
    CONTACTS: `${endpoint}/callback/contacts`,
    QRCODE: `${endpoint}/callback/loginqr`
  }
}