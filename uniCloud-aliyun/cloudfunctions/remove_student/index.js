const db = uniCloud.database();
const studentsCollection = db.collection('student');

exports.main = async (event, context) => {
  const { student_id } = event;

  if (!student_id) {
    return {
      success: false,
      code: 400,
      message: '缺少学生 ID',
    };
  }

  try {
    // 删除指定的学生记录
    const result = await studentsCollection.doc(student_id).remove();

    if (result.deleted === 0) {
      return {
        success: false,
        code: 404,
        message: '未找到指定的学生',
      };
    }

    return {
      success: true,
      code: 200,
      message: '学生删除成功',
    };
  }
  catch (error) {
    return {
      success: false,
      code: 500,
      message: '学生删除失败',
      error: error.message,
    };
  }
};
