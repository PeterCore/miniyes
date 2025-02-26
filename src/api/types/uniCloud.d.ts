import { TimetableInfo } from '@/store/modules/classtimetable/types';

export declare namespace UniCloud {
  /**
   * 云函数调用基础响应结构
   * @template T 业务数据泛型
   */
  interface CallFunctionResponse<T = any> {
    /** 云厂商请求ID（可用于排查问题） */
    requestId?: string;
    /** 云函数执行结果 */
    result: T;
    /** 错误码（0表示成功） */
    errCode?: number;
    /** 错误信息 */
    errMsg?: string;
    /** 原始响应头 */
    header?: Record<string, string>;
    /** 原始响应内容 */
    data?: string;
  }
}

// 分页请求参数
export interface GetTimetableParams {
  /** 当前页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 课程名称模糊查询 */
  courseName?: string;
  /** 教师ID精确查询 */
  teacherId?: string;
  /** 学生ID关联查询 */
  studentId?: string;
  /** 开始时间（YYYY-MM-DD） */
  startTime?: string;
  /** 结束时间（YYYY-MM-DD） */
  endTime?: string;
}
/**
 * 业务层统一响应格式
 * @template T 业务数据泛型
 */
interface ApiResponse<T = any> {
  /** 请求是否成功 */
  success: boolean;
  /** 业务状态码 */
  code: number;
  /** 业务提示信息 */
  message?: string;
  /** 业务数据 */
  data?: T;
  /** 调试用错误信息 */
  error?: string;
}

/**
 * UniCloud调用响应类型（组合类型）
 * @template T 业务数据泛型
 */
type UniCloudResponse<T extends ApiResponse = ApiResponse> = UniCloud.CallFunctionResponse<T>;
