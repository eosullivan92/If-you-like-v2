/* eslint-disable @typescript-eslint/ban-types */
import { useCallback, useEffect, useState } from 'react';

type UseAsync<T, A extends unknown[], E = string> = {
  value: T | undefined;
  loading: boolean;
  error: E | undefined;
  execute: (...args: A) => Promise<T>;
};

export function useAsync<T>(asyncFunc: () => Promise<T>) {
  // used in useEffect, execute runs immediately, reinvokes when dependencies change
  const { execute, ...state } = useAsyncInternal(asyncFunc);

  useEffect(() => {
    execute();
  }, [execute]);

  return state;
}

export function useAsyncFn<T, A extends unknown[]>(
  asyncFunc: (...params: A) => Promise<T>
) {
  //returns a function instead of running automatically
  return useAsyncInternal(asyncFunc);
}

export function useAsyncInternal<T, A extends unknown[], E = string>(
  asyncFunc: (...args: A) => Promise<T>
): UseAsync<T, A, E> {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<E | undefined>(undefined);
  const [value, setValue] = useState<T | undefined>(undefined);

  const execute = useCallback((...args: A) => {
    setLoading(true);
    return asyncFunc(...args)
      .then((data: T) => {
        setValue(data);
        setError(undefined);
        return data;
      })
      .catch((error: E) => {
        setValue(undefined);
        setError(error);
        return Promise.reject(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, error, value, execute };
}
