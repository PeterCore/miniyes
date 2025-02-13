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
