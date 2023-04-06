const mongoose = require('mongoose')
const constant = require('../../../constant')
const Custom = require('../custom');
const Schema = mongoose.Schema;

module.exports = function createChapter() {
  const schema = new Schema({
    _id: {
      type: String,
    },
    resource_id: {
      type: String,
      default: '',
    },
    segment_id: {
      type: String,
      default: '',
      comment: 'novel',
    },
    title: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    nth: {
      type: Number,
      default: 1
    },
  }, {
    strict: true,
    collections: 'chapter',
  });
  schema.loadClass(Custom);
  return mongoose.model('chapter', schema);
};