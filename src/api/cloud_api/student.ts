// studentService.ts

import type { StudentInfo } from '@/store/modules/student/types';

export const addStudent = async (studentInfo: StudentInfo) => {
  try {
    // 调用云函数添加学生
    const res = await uniCloud.callFunction({
      name: 'add_student', // 云函数名
      data: studentInfo, // 传递的学生信息
    });

    // 处理云函数返回的结果
    if (res.result.success) {
      console.log('学生添加成功', res.result.id);
      return {
        success: true,
        id: res.result.id,
        code: res.code,
        message: res.result.message,
      };
    }
    else {
      console.error('学生添加失败', res.result.message);
      return {
        success: false,
        code: res.code,
        message: res.result.message,
      };
    }
  }
  catch (error) {
    if (error instanceof Error) {
      console.error('云函数调用失败:', error);
      return {
        success: false,
        code: 500,
        message: `调用云函数失败: ${error.message}`,
      };
    }
  }
};

export const updateStudent = async (studentInfo: StudentInfo) => {
  try {
    // 调用云函数添加学生
    const res = await uniCloud.callFunction({
      name: 'update_student', // 云函数名
      data: studentInfo, // 传递的学生信息
    });

    // 处理云函数返回的结果
    if (res.result.success) {
      console.log('学生添加成功', res.result.id);
      return {
        success: true,
        id: res.result.id,
        code: res.code,
        message: res.result.message,
      };
    }
    else {
      console.error('学生添加失败', res.result.message);
      return {
        success: false,
        code: res.code,
        message: res.result.message,
      };
    }
  }
  catch (error) {
    if (error instanceof Error) {
      console.error('云函数调用失败:', error);
      return {
        success: false,
        code: 500,
        message: `调用云函数失败: ${error.message}`,
      };
    }
  }
};

export const deleteStudent = async (studentId: string) => {
  try {
    const res = await uniCloud.callFunction({
      name: 'remove_student',
      data: { student_id: studentId },
    });
    return res.result;
  }
  catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        code: 500,
        message: `${error.message}`,
      };
    }
    else {
      return {
        success: false,
        code: 500,
        message: `调用云函数失败: 发生了未知错误`,
      };
    }
  }
};

// studentService.ts
interface GetStudentListResponse {
  success: boolean;
  code: number;
  message: string;
  data: StudentInfo[];
  total: number;
}

export const getStudentList = async (): Promise<GetStudentListResponse> => {
  try {
    // 调用云函数获取所有学生列表
    const res = await uniCloud.callFunction({
      name: 'get_students', // 云函数名
      data: {}, // 无分页参数，获取所有学生
    });

    return res.result;
  }
  catch (error) {
    console.error('调用云函数失败', error);
    return {
      success: false,
      code: 500,
      message: '获取学生列表失败',
      data: [],
      total: 0,
    };
  }
};
