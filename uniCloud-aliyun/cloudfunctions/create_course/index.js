// 云函数：createCourse.js
const db = uniCloud.database();
const coursesCollection = db.collection('course');

exports.main = async (event, _context) => {
  const { course_name, course_duration, course_cost, course_type } = event;

  // 检查必填字段
  if (!course_name || !course_duration || !course_cost || !course_type) {
    return {
      success: false,
      code: 400,
      message: '缺少必要的课程信息',
    };
  }

  try {
    const currentTime = new Date();
    // 插入课程数据
    const result = await coursesCollection.add({
      course_name,
      course_duration,
      course_cost,
      course_type,
      create_time: currentTime, // 创建时间
      update_time: currentTime,
    });

    return {
      success: true,
      code: 200,
      message: '课程创建成功',
      course_id: result.id, // 返回课程的唯一 ID
    };
  }
  catch (error) {
    return {
      success: false,
      code: 500,
      message: '课程创建失败',
      error: error.message,
    };
  }
};
