const router = require('express').Router();
const Rule = require('./routes/rule');

router.use('/rules', Rule);

module.exports = router;