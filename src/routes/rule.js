import { Router } from 'express';
import models from '~/db/mongo/index.js'
import { VMScript } from 'vm2'
import helper
  from '../utils/helper';
const router = Router();
const spiders = {};

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
  const rule = await models.Rule.findOne({ _id: req.params.id });
  const url = req.query.origin, preview = req.query.preview ? true : false;
  if (!rule) {
    res.fail('no rule');
  } else {
    let script = spiders[rule._id]
    if (script === undefined) {
      script = new VMScript(rule.script || '').compile();
      spiders[rule._id] = script;
    }
    if (!script) {
      return res.fail("脚本错误");
    }
    const fn = vm.run(script);
    if (typeof fn !== 'function') {
      return res.fail('脚本不是函数');
    }
    try {
      const data = await fn.apply({ models, helper }, rule, url, preview)
      res.success(data);
    } catch (e) {
      res.fail(`抓取失败: ${e.message}`);
    }
  }
})

export default router;