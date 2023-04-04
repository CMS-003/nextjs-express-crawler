import constant from 'src/constant';
import mongoose, { Schema } from 'mongoose';
import { Static } from '..';

export default function createSegment() {
  const schema = new Schema({
    _id: {
      type: String,
    },
    resource_id: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      comment: '漫画的集话,小说的章节,视频的分段',
    },
    time: [Number],
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
    collections: 'segment',
  });
  schema.loadClass(Static);
  return mongoose.model('segment', schema);
};