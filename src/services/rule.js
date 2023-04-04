import _ from 'lodash'
import models from 'src/db/mongo'

export default {
  async getRules(hql = {}) {
    const total = await models.Rule.countDocuments();
    return { total };
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