const db = uniCloud.database();
const coursesCollection = db.collection('course');

exports.main = async (event, _) => {
  const { page = 1, pageSize = 10 } = event; // 设置默认分页参数

  try {
    // 查询课程列表，分页查询
    const skipCount = (page - 1) * pageSize; // 计算跳过的记录数
    const result = await coursesCollection
      .limit(pageSize) // 限制返回的条数
      .skip(skipCount) // 跳过指定数量的记录
      .orderBy('create_time', 'desc') // 按创建时间降序排序
      .get(); // 获取课程数据
    const restotal = await coursesCollection.count(); // 查询总记录数
    return {
      success: true,
      code: 200,
      message: '获取课程列表成功',
      data: result.data, // 返回课程数据
      total: restotal.total, // 返回总记录数，用于分页
    };
  }
  catch (error) {
    return {
      success: false,
      code: 500,
      message: '获取课程列表失败',
      error: error.message,
    };
  }
};
