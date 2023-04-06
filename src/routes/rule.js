const router = require('express').Router();
const models = require('../db/mongo')

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

module.exports = router;