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

  const allowedFields = ['name', 'remark', 'spell_name', 'genders', 'phone', 'role', 'class_timetable'];
  const updateData = {
    update_time: new Date(),
  };

  Object.keys(event).forEach((key) => {
    if (allowedFields.includes(key) && event[key] !== undefined) {
      updateData[key] = event[key];
    }
  });

  try {
    const result = await teachersCollection.doc(event.teacher_id).update(updateData);
    if (result.updated === 0) {
      return {
        success: false,
        code: 404,
        message: '未找到指定教师',
      };
    }
    return {
      success: true,
      code: 200,
      data: {
        teacher_id: event.teacher_id,
        ...updateData,
      },
    };
  }
  catch (err) {
    return {
      success: false,
      code: 500,
      message: '更新教师信息失败',
      error: err.message,

    };
  }
};
