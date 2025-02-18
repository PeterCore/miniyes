const db = uniCloud.database();
const studentsCollection = db.collection('student'); // 云数据库集合名为 'student'

exports.main = async (_, _context) => {
  try {
    // 查询所有学生数据
    const result = await studentsCollection
      .orderBy('create_time', 'desc') // 按创建时间降序排序
      .get(); // 获取所有学生数据
    const totalCountResult = await studentsCollection.count(); // 查询总记录数
    return {
      success: true,
      code: 200,
      message: '获取学生列表成功',
      data: result.data, // 返回学生数据
      total: totalCountResult, // 返回学生总数
    };
  }
  catch (error) {
    return {
      success: false,
      code: 500,
      message: '获取学生列表失败',
      error: error.message,
    };
  }
};
