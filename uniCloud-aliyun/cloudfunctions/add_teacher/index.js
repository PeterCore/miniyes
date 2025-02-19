const db = uniCloud.database();
const teachersCollection = db.collection('teacher');

exports.main = async (event, context) => {
  const { name, remark, spell_name, genders, role, phone, class_timetable } = event;

  // 校验必填字段
  if (!name || !remark || !spell_name || !role || !phone || genders === undefined) {
    return {
      success: false,
      code: 400,
      message: '缺少必要的老师信息',
    };
  }
  // const requiredFields = ['name', 'remark', 'spell_name', 'genders', 'role', 'phone', 'class_timetable'];
  // const missingFields = requiredFields.filter((field) => {
  //   if (field === 'genders') {
  //     if (event[field] === undefined) {
  //       return true;
  //     }
  //   }
  //   return !event[field];
  // });
  // console.log('missingFields', missingFields);
  // if (missingFields.length > 0) {
  //   return {
  //     success: false,
  //     code: 400,
  //     message: `缺少必填字段：${missingFields.join(', ')}`,
  //   };
  // }

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
