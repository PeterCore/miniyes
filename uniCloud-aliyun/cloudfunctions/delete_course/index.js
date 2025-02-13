// 云函数：deleteCourse.js
const db = uniCloud.database();
const coursesCollection = db.collection('course');

exports.main = async (event, context) => {
  const { course_id } = event;

  if (!course_id) {
    return {
      success: false,
      code: 400,
      message: '课程ID不能为空',
    };
  }

  try {
    // 删除指定的课程
    const result = await coursesCollection.doc(course_id).remove();

    if (result.deleted === 0) {
      return {
        success: false,
        code: 404,
        message: '未找到指定课程',
      };
    }

    return {
      success: true,
      code: 200,
      message: '课程删除成功',
    };
  }
  catch (error) {
    return {
      success: false,
      code: 500,
      message: '课程删除失败',
      error: error.message,
    };
  }
};
