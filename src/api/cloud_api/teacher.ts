import type { UniCloudResponse } from '@/api/types/uniCloud';
import type { TeacherInfo } from '@/store/modules/teacher/types';

// 教师类型定义
// export interface Teacher {
//   _id?: string;
//   name: string;
//   remark: string;
//   spell_name: string;
//   genders: number;
//   phone?: string;
//   role: string;
//   class_timetable: string[];
//   create_time?: Date;
//   update_time?: Date;
// }

// 接口响应类型
interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message?: string;
  data?: T;
  error?: string;
}

// 分页参数
interface PaginationParams {
  page?: number;
  pageSize?: number;
}

class TeacherService {
  /**
   * 获取教师列表
   * @param params 分页参数
   */
  async getTeachers(params?: PaginationParams): Promise<TeacherInfo[]> {
    try {
      const res = await uniCloud.callFunction({
        name: 'get_teachers',
        data: {
          page: params?.page || 1,
          pageSize: params?.pageSize || 20,
        },
      }) as UniCloudResponse<ApiResponse<TeacherInfo[]>>;

      if (res.result.success) {
        return res.result.data || [];
      }
      throw new Error(res.result.message || '获取教师列表失败');
    }
    catch (error) {
      console.error('获取教师列表错误:', error);
      throw new Error('网络请求失败，请稍后重试');
    }
  }

  /**
   * 获取教师详情
   * @param teacherId 教师ID
   */
  async getTeacherById(teacherId: string): Promise<TeacherInfo> {
    if (!teacherId) throw new Error('教师ID不能为空');

    try {
      const res = await uniCloud.callFunction({
        name: 'get_teacher_by_id',
        data: { teacher_id: teacherId },
      }) as UniCloudResponse<ApiResponse<TeacherInfo>>;

      if (res.result.success) {
        return res.result.data!;
      }
      throw new Error(res.result.message || '教师信息获取失败');
    }
    catch (error) {
      console.error('获取教师详情错误:', error);
      throw new Error('获取教师信息失败');
    }
  }

  /**
   * 创建教师
   * @param teacherData 教师数据
   */
  async createTeacher(teacherData: TeacherInfo): Promise<string> {
    try {
      const { teacher_id, create_time, update_time, ...rest } = teacherData;
      const res = await uniCloud.callFunction({
        name: 'add_teacher',
        data: rest,
      }) as UniCloudResponse<ApiResponse<{ teacher_id: string }>>;

      if (res.result.success) {
        return res.result.data!.teacher_id;
      }
      throw new Error(res.result.message || '创建教师失败');
    }
    catch (error) {
      console.error('创建教师错误:', error);
      throw new Error('创建教师失败，请检查数据格式');
    }
  }

  /**
   * 更新教师信息
   * @param teacherId 教师ID
   * @param updateData 更新数据
   */
  async updateTeacher(
    teacherId: string,
    updateData: TeacherInfo,
  ): Promise<void> {
    if (!teacherId) throw new Error('教师ID不能为空');
    const { teacher_id, ...rest } = updateData;

    try {
      const res = await uniCloud.callFunction({
        name: 'update_teacher',
        data: {
          teacher_id: teacherId,
          ...rest,
        },
      }) as UniCloudResponse<ApiResponse>;

      if (!res.result.success) {
        throw new Error(res.result.message || '更新失败');
      }
    }
    catch (error) {
      console.error('更新教师错误:', error);
      throw new Error('更新教师信息失败');
    }
  }

  /**
   * 删除教师
   * @param teacherId 教师ID
   */
  async deleteTeacher(teacherId: string): Promise<void> {
    if (!teacherId) throw new Error('教师ID不能为空');

    try {
      const res = await uniCloud.callFunction({
        name: 'delete_teacher',
        data: { teacher_id: teacherId },
      }) as UniCloudResponse<ApiResponse>;

      if (!res.result.success) {
        throw new Error(res.result.message || '删除失败');
      }
    }
    catch (error) {
      console.error('删除教师错误:', error);
      throw new Error('删除教师失败');
    }
  }
}

export const TeacherApi = new TeacherService();
/**
 * 该函数用于计算两个数的和。
 *
 * @param a - 第一个加数，类型为数字。
 * @param b - 第二个加数，类型为数字。
 * @returns 返回两个加数的和，类型为数字。
 */
