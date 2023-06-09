const mongoose = require('mongoose')
const constant = require('../../../constant')
const Custom = require('../custom');
const Schema = mongoose.Schema;

module.exports = function createRule() {
  const schema = new Schema({
    _id: {
      type: String,
      comment: 'shortid'
    },
    type: {
      type: String,
      default: '',
      comment: 'single,page',
    },
    resource_type: String,
    name: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    urls: {
      type: [String],
      comment: 'regpath格式',
    },
    script: {
      type: String,
      default: '// js business code here',
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: Number,
      default: constant.RULE.STATUS.WAITING,
    },
  }, {
    strict: true,
    collections: 'rule',
  });
  schema.loadClass(Custom);
  return mongoose.model('rule', schema);
};