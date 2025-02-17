// courseService.ts
export interface CreateCourseResponse {
  success: boolean;
  code: number;
  message: string;
  course_id?: string;
}

export interface DeleteCourseResponse {
  success: boolean;
  code: number;
  message: string;
}

export interface UpdateCourseResponse {
  success: boolean;
  code: number;
  message: string;
}
// 调用函数，获取第1页，每页10条数据
// getCourses(1, 10);
export const getCourses = async (page: number, pageSize: number) => {
  try {
    const res = await uniCloud.callFunction({
      name: 'get_courses', // 云函数名
      data: { page, pageSize }, // 分页参数
    });

    if (res.result.success) {
      console.log('课程列表:', res.result.data);
      console.log('总记录数:', res.result.total);
      return { data: res.result.data, total: res.result.total, success: true, code: 200 };
    }
    else {
      console.error('获取课程列表失败:', res.result.message);
      return {
        success: false,
        code: 500,
        message: `${res.result.message}`,
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

export const createCourse = async (
  courseName: string,
  courseDuration: number,
  courseCost: number,
  courseType: string,
): Promise<CreateCourseResponse> => {
  try {
    const res = await uniCloud.callFunction({
      name: 'create_course',
      data: {
        course_name: courseName,
        course_duration: courseDuration,
        course_cost: courseCost,
        course_type: courseType,
      },
    });

    const result: CreateCourseResponse = res.result;
    return result;
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        code: 500,
        message: `调用云函数失败: ${error.message}`,
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

export const deleteCourse = async (courseId: string): Promise<DeleteCourseResponse> => {
  try {
    const res = await uniCloud.callFunction({
      name: 'delete_course',
      data: { course_id: courseId },
    });

    const result: DeleteCourseResponse = res.result;
    return result;
  }
  catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        code: 500,
        message: `调用云函数失败: ${error.message}`,
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

export const updateCourse = async (
  courseId: string,
  courseName: string,
  courseDuration: number,
  courseCost: number,
  courseType: string,
): Promise<UpdateCourseResponse> => {
  try {
    const res = await uniCloud.callFunction({
      name: 'update_course',
      data: {
        course_id: courseId,
        course_name: courseName,
        course_duration: courseDuration,
        course_cost: courseCost,
        course_type: courseType,
      },
    });

    const result: UpdateCourseResponse = res.result;
    return result;
  }
  catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        code: 500,
        message: `调用云函数失败: ${error.message}`,
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
