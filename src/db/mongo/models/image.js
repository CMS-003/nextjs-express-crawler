import constant from '~/constant'
import mongoose, { Schema } from 'mongoose';
import { Static } from '..';

export default function createImage() {
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
      comment: 'gallery',
    },
    width: Number,
    height: Number,
    size: Number,
    title: {
      type: String,
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    filepath: {
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
    status: {
      type: Number,
      default: constant.ATTACHMENT.STATUS.CREATED,
    },
    message: String, // 错误信息
  }, {
    strict: true,
    collections: 'image',
  });
  schema.loadClass(Static);
  return mongoose.model('image', schema);
};