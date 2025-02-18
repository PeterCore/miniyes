const db = uniCloud.database();
const studentsCollection = db.collection('student');

exports.main = async (event, context) => {
  const { student_id, name, remark, spell_name, genders, phone, class_timetable } = event;

  if (!student_id) {
    return {
      success: false,
      code: 400,
      message: '缺少学生 ID',
    };
  }

  // 构造更新的数据
  const updateData = {};
  if (name) updateData.name = name;
  if (remark) updateData.remark = remark;
  if (spell_name) updateData.spell_name = spell_name;
  if (genders !== undefined) updateData.genders = genders;
  if (phone) updateData.phone = phone;
  if (class_timetable) updateData.class_timetable = class_timetable;
  updateData.update_time = new Date(); // 更新时自动设置更新时间

  try {
    // 更新学生记录
    const result = await studentsCollection.doc(student_id).update(updateData);
    if (result.updated === 0) {
      return {
        success: false,
        code: 404,
        message: '未找到指定的学生',
      };
    }

    return {
      success: true,
      code: 200,
      message: '学生信息更新成功',
    };
  }
  catch (error) {
    return {
      success: false,
      code: 500,
      message: '学生信息更新失败',
      error: error.message,
    };
  }
};
