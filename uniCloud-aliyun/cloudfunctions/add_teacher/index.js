const db = uniCloud.database();
const teachersCollection = db.collection('teacher');

exports.main = async (event, context) => {
  const requiredFields = ['name', 'remark', 'spell_name', 'genders', 'role', 'class_timetable'];
  const missingFields = requiredFields.filter(field => !event[field]);

  if (missingFields.length > 0) {
    return {
      success: false,
      code: 400,
      message: `缺少必填字段：${missingFields.join(', ')}`,
    };
  }

  if (event.phone && event.phone.length !== 11) {
    return {
      success: false,
      code: 400,
      message: '手机号必须为11位',
    };
  }

  const teacherData = {
    ...event,
    create_time: new Date(),
    update_time: new Date(),
  };

  try {
    const result = await teachersCollection.add(teacherData);
    return {
      success: true,
      code: 200,
      data: {
        teacher_id: result.id,
        ...teacherData,
      },
    };
  }
  catch (err) {
    return {
      success: false,
      code: 500,
      message: '创建教师失败',
      error: err.message,
    };
  }
};
