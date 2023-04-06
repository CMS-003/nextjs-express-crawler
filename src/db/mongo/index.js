const mongoose = require('mongoose')
const _ = require('lodash')
const config = require('../../config')
const fs = require('fs')
const path = require('path')
const createAttachment = require('./models/attachment')
const createChapter = require('./models/chapter')
const createImage = require('./models/image')
const createRecord = require('./models/record')
const createRule = require('./models/rule')
const createSegment = require('./models/segment')
const createVideo = require('./models/video')

/**
 * 遍历文件夹
 * @param {object} opt 参数
 * @param {function} cb 回调函数
 */
function loader(opt, cb = null) {
  scanner(opt.dir, cb, opt.filter, opt.recusive);
}

function scanner(dir, cb, filter, recusive) {
  fs.readdirSync(dir).forEach(file => {
    const fullpath = path.join(dir, file);
    const ext = path.extname(file).toLocaleLowerCase();
    const filename = file.substr(0, file.length - ext.length);
    if (recusive === true && fs.existsSync(fullpath) && fs.lstatSync(fullpath).isDirectory()) {
      scanner(fullpath, cb, filter, recusive);
    } else if (cb) {
      // filter处理
      cb({ fullpath, dir, filename, ext });
    }
  });
}

mongoose.connect(`mongodb://${config.mongo.user ? config.mongo.user + ':' + config.mongo.pass + '@' : ''}${config.mongo.host}:${config.mongo.port}/${config.mongo.db}?authSource=admin`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  return true;
}).catch(e => {
  console.log(e, 'mongo')
});

if (!global.models) {
  const models = {
    Attachment: createAttachment(),
    Image: createImage(),
    Chapter: createChapter(),
    Rule: createRule(),
    Record: createRecord(),
    Segment: createSegment(),
    Video: createVideo(),
  }
  // const models = {};
  // loader({ dir: __dirname + '/models' }, (info) => {
  //   const { fullpath, filename } = info;
  //   const name = filename[0].toUpperCase() + filename.substr(1);
  //   models[name] = require(fullpath)();
  // })
  global.models = models;
}


module.exports = global.models