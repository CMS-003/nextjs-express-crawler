import { Router } from 'express';
import constant from '~/constant';
import models from '~/db/mongo/index.js'

const router = Router();

router.post('/', async (req, res) => {
  const result = await models.Rule.create(req.body);
  res.success(result);
});

router.get('/', async (req, res) => {
  const items = await models.Rule.find().lean(true);
  const total = await models.Rule.countDocuments();
  res.success({ items, total });
})

router.delete('/:id', async (req, res) => {
  await models.Rule.deleteOne({ _id: req.params.id })
  res.success();
})

router.put('/:id', async (req, res) => {
  await models.Rule.updateOne({ _id: req.params.id }, { $set: req.body });
  res.success();
})

router.patch('/:id', async (req, res) => {
  const rule = await models.Rule.findOne({ _id: req.params.id }).lean(true);
  if (rule.status !== constant.RULE.STATUS.RUNNING) {
    res.fail({ message: 'rule未完成!' })
  } else {
    res.success()
  }
})

export default router;