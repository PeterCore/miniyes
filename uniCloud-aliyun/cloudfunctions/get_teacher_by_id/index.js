const db = uniCloud.database();
const teachersCollection = db.collection('teacher');

exports.main = async (event, context) => {
  if (!event.teacher_id) {
    return {
      success: false,
      code: 400,
      message: '缺少教师ID',
    };
  }

  try {
    const res = await teachersCollection.doc(event.teacher_id).get();
    if (!res.data.length) {
      return {
        success: false,
        code: 404,
        message: '未找到该教师',
      };
    }
    return {
      success: true,
      code: 200,
      data: res.data[0],
    };
  }
  catch (err) {
    return {
      success: false,
      code: 500,
      message: '获取教师信息失败',
      error: err.message,
    };
  }
};
