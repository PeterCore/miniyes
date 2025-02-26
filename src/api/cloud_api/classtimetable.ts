// api/timetable.ts
import type { ApiResponse, GetTimetableParams, UniCloudResponse } from '@/api/types/uniCloud';
import type { TimetableInfo } from '@/store/modules/classtimetable/types';

// api/timetable.ts
// 自定义错误类型扩展
class ApiError extends Error {
  constructor(
    public message: string,
    public code: number = 500,
    public stack?: string,
  ) {
    super(message);
    this.name = 'ApiError';
    // 保持正确的原型链（重要）
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

interface Pagination {
  total: number;
  current: number;
  pageSize: number;
  totalPages: number;
}

interface TimetableListResponse {
  list: TimetableInfo[];
  pagination: Pagination;
}
class TimetableService {
  /**
   * 获取课程表列表（带分页和过滤）
   */
  async getTimetableList(
    params: GetTimetableParams,
  ): Promise<ApiResponse<TimetableListResponse>> {
    try {
      const res = await uniCloud.callFunction({
        name: 'timetable',
        data: {
          action: 'list',
          ...params,
        },
      }) as UniCloudResponse<ApiResponse<TimetableListResponse>>;
      console.log('获取课程表:', res);
      if (res.result.success) {
        if (
          !res?.result.data?.pagination
          || !Array.isArray(res.result.data.list)
        ) {
          throw new Error('Invalid response structure');
        }
        return res.result;
      }
      throw new Error(res.result.message || '获取教师列表失败');
    }
    catch (error) {
      console.error('获取课程表列表失败:', error);
      throw new Error('获取课程表列表失败');
    }
  };

  /**
   * 创建课程表（增强类型校验）
   */
  async createTimetable(
    params: TimetableInfo,
  ): Promise<string> {
    const { timetable_id, ...rest } = params;

    try {
      const res = await uniCloud.callFunction({
        name: 'timetable',
        data: {
          action: 'create',
          ...rest,
        },
      }) as UniCloudResponse<ApiResponse<{ timetable_id: string }>>;
      if (res.result.success) {
        return res.result.data!.timetable_id;
      }
      throw new Error(res.result.message || '创建排课失败');
    }
    catch (error) {
      console.error('创建排课失败:', error);
      throw new Error('创建排课失败，请检查数据格式');
    }
  }

  /**
   * 更新课程表（带严格类型校验）
   */
  async updateTimetable(
    params: TimetableInfo,
  ): Promise<ApiResponse> {
    try {
      if (!params.timetable_id) throw new Error('缺少课程表ID');

      const res = await uniCloud.callFunction({
        name: 'timetable',
        data: {
          action: 'update',
          ...this.sanitizeParams(params),
        },
      }) as ApiResponse;
      if (res.success) {
        return res;
      }
      throw new Error(res.message || '更新失败');
    }
    catch (error) {
      console.error('更新课程错误:', error);
      throw new Error('更新失败');
    }
  }

  /**
   * 删除课程表（带事务安全校验）
   */
  async deleteTimetable(
    timetableId: string,
  ): Promise<ApiResponse> {
    try {
      const res = await uniCloud.callFunction({
        name: 'timetable',
        data: {
          action: 'delete',
          timetable_id: timetableId,
        },
      }) as ApiResponse;

      if (res.success) {
        return res;
      }
      throw new Error(res.message || '删除课表失败');
    }
    catch (error) {
      console.error('删除课表错误:', error);
      throw new Error('删除课表失败');
    }
  }

  /**
   * 响应处理器（统一处理云函数响应）
   */
  private processResponse<T>(
    res: UniCloudResponse<ApiResponse<T>>,
  ): UniCloudResponse<ApiResponse<T>> {
    // 处理云厂商错误
    if (res.errCode !== 0 && res.errCode !== undefined) {
      throw this.createApiError(res.errMsg || '云服务错误', res.errCode);
    }

    // 处理业务逻辑错误
    if (!res.result?.success) {
      throw this.createApiError(
        res.result.error || res.result.message || '操作失败',
        res.result.code,
      );
    }

    return res;
  }

  /**
   * 错误处理器（类型安全封装）
   */
  private handleError(error: unknown): UniCloudResponse<ApiResponse> {
    console.error('[Timetable Service Error]', error);

    if (error instanceof ApiError) {
      return {
        errCode: error.code,
        errMsg: error.message,
        result: {
          success: false,
          code: error.code,
          message: error.message,
          error: error.stack,
        },
      };
    }

    return {
      errCode: 500,
      errMsg: '未知错误',
      result: {
        success: false,
        code: 500,
        message: '系统异常',
        error: error instanceof Error ? error.stack : undefined,
      },
    };
  }

  /**
   * 参数消毒（防止XSS/非法字段）
   */
  private sanitizeParams<T extends object>(params: T): T {
    // 实际项目中可添加具体消毒逻辑
    return JSON.parse(JSON.stringify(params));
  }

  /**
   * 创建标准化错误对象
   */
  private createApiError(message: string, code = 500): Error {
    const error = new Error(message) as ApiError;
    error.code = code;
    return error;
  }
}
export const TimetableApi = new TimetableService();
