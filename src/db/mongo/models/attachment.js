import constant from '~/constant'
import mongoose, { Schema } from 'mongoose';
import { Static } from '..';

// content内或封面用attachment.video、chapter、image分表
export default function createAttachment() {
  const schema = new Schema({
    _id: {
      type: String,
      comment: 'guid'
    },
    resource_id: {
      type: String,
      default: '',
    },
    media_type: {
      type: String, // image,video,audio,file
    },
    more: {
      width: Number,
      height: Number,
      rotate: Number,
      size: Number,
      duration: Number,
    },
    title: {
      type: String,
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
      comment: 'audio/video的封面可以通过ffmpeg写到文件里,图片的缩略图',
    },
    url: {
      type: String,
      default: '',
    },
    filepath: {
      type: String,
      default: '',
    },
    temppath: {
      type: String, // 如果是需要转码.m3u8
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: Number,
      default: constant.ATTACHMENT.STATUS.CREATED,
    },
    message: String, // 错误信息
  }, {
    strict: true,
    collections: 'attachment',
  });
  schema.loadClass(Static);
  return mongoose.model('attachment', schema);
};