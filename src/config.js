import dotenv from 'dotenv'

dotenv.config({ path: '.env.' + (process.env.NODE_ENV || 'development'), debug: false })

export default {
  'PORT': process.env.PORT,
  'mongo': {
    'user': process.env.mongo_user,
    'pass': process.env.mongo_pass,
    'host': process.env.mongo_host,
    'port': process.env.mongo_port,
    'db': process.env.mongo_db,
  },

  // 跨域
  'CORS': {
    'origins': '*',
    'headers': ['X-Token']
  },

  // 多语言
  'i18n': {
    'langs': ['en-us', 'zh-cn'],
    'default': 'zh-cn'
  },

  // 上传
  'UPLOAD': {
    'fileSize': '10mb',
    'fields': 100,
    'fieldNameSize': 255
  },

  // 系统基本信息
  'SYSTEM': {
    'language': 'nodejs',
    'title': '项目'
  },
  'PROJECT_NAME': 'demo'
};
