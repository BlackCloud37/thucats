const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

/* Create all collections needed
*  event: {
     collections: ['name1', 'name2']
   }
*/
exports.main = async (event, context) => {
  console.log(event);
  console.log(context);
  const { collections } = event;
  try {
    if (!collections || collections.length === 0) {
      throw Error('param `collections` cannot be empty');
    }
    await Promise.all(collections.map((collectionName) => db.createCollection(collectionName)));
    console.log('ok');
    return {};
  } catch (err) {
    console.log(err);
    return {
      err_msg: err.toString()
    };
  }
};
