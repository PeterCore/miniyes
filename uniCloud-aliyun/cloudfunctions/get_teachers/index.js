const db = uniCloud.database();
const teachersCollection = db.collection('teacher');

exports.main = async (event, context) => {
  try {
    const res = await teachersCollection.get();
    return {
      success: true,
      code: 200,
      data: res.data,
    };
  }
  catch (err) {
    return {
      success: false,
      code: 500,
      message: '获取教师列表失败',
      error: err.message,
    };
  }
};
