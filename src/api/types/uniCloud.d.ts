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
  /** 分页信息 */
  pagination?: {
    total: number;
    current: number;
    pageSize: number;
  };
}

/**
 * UniCloud调用响应类型（组合类型）
 * @template T 业务数据泛型
 */
type UniCloudResponse<T extends ApiResponse = ApiResponse> = UniCloud.CallFunctionResponse<T>;
