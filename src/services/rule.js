import _ from 'lodash'
import * as models from '~/db/mongo'

export default {
  async getRules(hql = {}) {
    const total = await models.Rule.countDocuments();
    const items = await models.Rule.find().lean(true);
    return { total, items };
  },
  async createRule(data) {
    data = _.pick(data, ['type', 'name', 'desc', 'script', 'matches', 'status', '_id'])
    try {
      new VMScript(data.script).compile();
    } catch (e) {

    }
    return await models.Rule.create(data);
  }
}