// 云函数：updateCourse.js
const db = uniCloud.database();
const coursesCollection = db.collection('course');

exports.main = async (event, context) => {
  const { course_id, course_name, course_duration, course_cost, course_type } = event;

  if (!course_id) {
    return {
      success: false,
      code: 400,
      message: '课程ID不能为空',
    };
  }

  const updateData = {};
  if (course_name) updateData.course_name = course_name;
  if (course_duration) updateData.course_duration = course_duration;
  if (course_cost) updateData.course_cost = course_cost;
  if (course_type) updateData.course_type = course_type;
  updateData.update_time = new Date(); // 更新时自动设置更新时间

  try {
    // 更新指定课程
    const result = await coursesCollection.doc(course_id).update(updateData);

    if (result.updated === 0) {
      return {
        success: false,
        code: 404,
        message: '未找到指定课程',
      };
    }

    return {
      success: true,
      code: 200,
      message: '课程更新成功',
    };
  }
  catch (error) {
    return {
      success: false,
      code: 500,
      message: '课程更新失败',
      error: error.message,
    };
  }
};
