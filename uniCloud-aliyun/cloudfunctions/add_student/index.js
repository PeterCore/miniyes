const db = uniCloud.database();
const studentsCollection = db.collection('student'); // 云数据库集合名为 'students'

exports.main = async (event, context) => {
  const { name, remark, spell_name, genders, phone } = event;

  // 校验必填字段
  if (!name || !remark || !spell_name || genders === undefined) {
    return {
      success: false,
      code: 400,
      message: '缺少必要的学生信息',
    };
  }

  try {
    const currentTime = new Date();
    // 插入新学生记录
    const result = await studentsCollection.add({
      name,
      remark,
      spell_name,
      genders,
      phone: phone || '', // 可选字段
      create_time: currentTime, // 创建时间
      update_time: currentTime,
    });

    return {
      success: true,
      code: 200,
      message: '学生添加成功',
      id: result.id, // 返回学生的 ID
    };
  }
  catch (error) {
    return {
      success: false,
      code: 500,
      message: '学生添加失败',
      error: error.message,
    };
  }
};
