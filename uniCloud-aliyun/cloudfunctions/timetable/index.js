// cloudfunctions/timetable/index.js
const db = uniCloud.database();
const cmd = db.command;
const timetableCollection = db.collection('timetable');
const teacherCollection = db.collection('teacher');
const studentCollection = db.collection('student');

// 创建课程表
async function createTimetable(event) {
  const {
    course_id,
    course_name,
    teacher,
    students,
    schedule_time,
    status,
    remark,
  } = event;

  // 参数校验
  if (!course_id || !course_name || !teacher?.teacher_id || !schedule_time || !students) {
    return { success: false, code: 400, message: '缺少必要参数' };
  }

  // 创建事务
  const transaction = await db.startTransaction();

  try {
    // 1. 创建课程表记录
    const timetableRes = await timetableCollection.add({
      course_id,
      course_name,
      teacher,
      students: students || [],
      schedule_time,
      remark,
      status,
      create_time: new Date(),
      update_time: new Date(),
    });

    // 2. 更新教师课程表关联
    await teacherCollection.doc(teacher.teacher_id).update({
      class_timetable: cmd.addToSet(timetableRes.id),
    });

    // 3. 更新学生课程表关联
    if (students && students.length > 0) {
      const studentIds = students.map(s => s.student_id);
      await studentCollection.where({
        _id: cmd.in(studentIds),
      }).update({
        class_timetable: cmd.addToSet(timetableRes.id),
      });
    }

    await transaction.commit();
    return { success: true, code: 200, data: {
      timetable_id: timetableRes.id,
      ...timetableRes,
    }, message: '创建成功' };
  }
  catch (e) {
    await transaction.rollback();
    return { success: false, code: 500, message: `创建失败: ${e.message}` };
  }
}

// 更新课程表
async function updateTimetable(event) {
  const {
    timetable_id,
    course_name,
    teacher: newTeacher,
    students: newStudents,
    schedule_time,
    status,
    remark,
  } = event;

  try {
    // 获取原课程表数据
    const oldTimetable = await timetableCollection.doc(timetable_id).get();
    const { teacher: oldTeacher, students: oldStudents } = oldTimetable.data[0];

    const transaction = await db.startTransaction();

    // 1. 更新课程表主体
    await timetableCollection.doc(timetable_id).update({
      course_name,
      teacher: newTeacher,
      students: newStudents,
      schedule_time,
      remark,
      status,
      update_time: new Date(),
    });

    // 2. 处理教师变更
    if (newTeacher.teacher_id !== oldTeacher.teacher_id) {
      // 移除旧教师关联
      await teacherCollection.doc(oldTeacher.teacher_id).update({
        class_timetable: cmd.pull(timetable_id),
      });
      // 添加新教师关联
      await teacherCollection.doc(newTeacher.teacher_id).update({
        class_timetable: cmd.addToSet(timetable_id),
      });
    }

    // 3. 处理学生变更
    const oldStudentIds = oldStudents.map(s => s.student_id);
    const newStudentIds = newStudents.map(s => s.student_id);

    // 移除不再关联的学生
    const removedStudents = oldStudentIds.filter(id => !newStudentIds.includes(id));
    if (removedStudents.length > 0) {
      await studentCollection.where({
        student_id: cmd.in(removedStudents),
      }).update({
        class_timetable: cmd.pull(timetable_id),
      });
    }

    // 添加新关联的学生
    const addedStudents = newStudentIds.filter(id => !oldStudentIds.includes(id));
    if (addedStudents.length > 0) {
      await studentCollection.where({
        student_id: cmd.in(addedStudents),
      }).update({
        class_timetable: cmd.addToSet(timetable_id),
      });
    }

    await transaction.commit();
    return { success: true, code: 200, message: '更新成功' };
  }
  catch (e) {
    await transaction.rollback();
    return { success: false, code: 500, message: `更新失败: ${e.message}` };
  }
}

// 删除课程表
async function deleteTimetable(event) {
  const { timetable_id } = event;

  try {
    const timetableData = await timetableCollection.doc(timetable_id).get();
    if (!timetableData.data[0]) {
      return { success: false, code: 404, message: '课程表不存在' };
    }

    const { teacher, students } = timetableData.data[0];
    const transaction = await db.startTransaction();

    // 1. 删除课程表
    await timetableCollection.doc(timetable_id).remove();

    // 2. 更新教师关联
    await teacherCollection.doc(teacher.teacher_id).update({
      class_timetable: cmd.pull(timetable_id),
    });

    // 3. 更新学生关联
    const studentIds = students.map(s => s.student_id);
    if (studentIds.length > 0) {
      await studentCollection.where({
        student_id: cmd.in(studentIds),
      }).update({
        class_timetable: cmd.pull(timetable_id),
      });
    }

    await transaction.commit();
    return { success: true, code: 200, message: '删除成功' };
  }
  catch (e) {
    await transaction.rollback();
    return { success: false, code: 500, message: `删除失败: ${e.message}` };
  }
}

async function getTimetables(event) {
  const {
    page = 1,
    pageSize = 10,
    courseName,
    teacherId,
    studentId,
    startTime,
    endTime,
  } = event;

  try {
    // 构建查询条件
    const query = timetableCollection.where({});
    // 课程名称模糊查询
    if (courseName) {
      query.where({
        course_name: new RegExp(courseName, 'i'),
      });
    }

    // 教师ID精确查询
    if (teacherId) {
      query.where({
        'teacher.teacher_id': teacherId,
      });
    }

    // 学生ID关联查询
    if (studentId) {
      query.where({
        'students.student_id': studentId,
      });
    }

    // 时间范围查询
    if (startTime && endTime) {
      query.where({
        schedule_time: cmd.and(cmd.gte(startTime), cmd.lte(endTime)),
      });
    }
    // 执行分页查询
    const res = await query
      .orderBy('schedule_time', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();

    // 获取总数
    const countRes = await query.count();

    return {
      success: true,
      code: 200,
      data: {
        list: res.data,
        pagination: {
          total: countRes.total,
          current: page,
          pageSize,
          totalPages: Math.ceil(countRes.total / pageSize),
        },
      },
      message: '查询成功',
    };
  }
  catch (e) {
    return {
      success: false,
      code: 500,
      message: `查询失败: ${e.message}`,
    };
  }
}

// 云函数入口
exports.main = async (event, context) => {
  const { action } = event;

  switch (action) {
    case 'create':
      return createTimetable(event);
    case 'update':
      return updateTimetable(event);
    case 'delete':
      return deleteTimetable(event);
    case 'list':
      return getTimetables(event);
    default:
      return { success: false, code: 400, message: '无效操作' };
  }
};
