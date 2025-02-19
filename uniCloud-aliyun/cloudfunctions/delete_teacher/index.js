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
    const result = await teachersCollection.doc(event.teacher_id).remove();
    if (result.deleted === 0) {
      return {
        success: false,
        code: 404,
        message: '未找到指定教师',
      };
    }
    return {
      success: true,
      code: 200,
      message: '删除成功',
    };
  }
  catch (err) {
    return {
      success: false,
      code: 500,
      message: '删除教师失败',
      error: err.message,

    };
  }
};
