import { useState, useCallback } from 'react';
import { ApiError } from '@types/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook để xử lý API calls với loading và error states
 * @param apiFunction - Function API cần gọi
 * @returns Object chứa data, loading, error, execute và reset functions
 */
export const useApi = <T>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err: any) {
        const apiError: ApiError = {
          message: err.response?.data?.message || err.message || 'Đã có lỗi xảy ra',
          code: err.response?.data?.code,
          status: err.response?.status,
        };
        setError(apiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

