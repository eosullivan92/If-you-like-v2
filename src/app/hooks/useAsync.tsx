/* eslint-disable @typescript-eslint/ban-types */
import { useCallback, useEffect, useState } from 'react';
import { CommentType, PostType, PostTitleType } from '../types/types';

type DependenciesType = [id: string, posts?: PostTitleType[]] | [];

export function useAsync(func: Function, dependencies: DependenciesType = []) {
  // used in useEffect, execute runs immediately, reinvokes when dependencies change
  const { execute, ...state } = useAsyncInternal(func, dependencies, true);

  useEffect(() => {
    execute();
  }, [execute]);

  return state;
}

export function useAsyncFn(
  func: Function,
  dependencies: DependenciesType = []
) {
  //returns a function instead of running automatically
  return useAsyncInternal(func, dependencies, false);
}

export function useAsyncInternal(
  func: Function,
  dependencies: DependenciesType,
  initialLoading = false
) {
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<string>();
  const [value, setValue] = useState<
    PostType | PostType[] | PostTitleType[] | CommentType | undefined
  >(undefined);

  const execute = useCallback((...params) => {
    setLoading(true);
    return func(...params)
      .then((data: PostType) => {
        setValue(data);
        setError(undefined);
        return data;
      })
      .catch((error: string) => {
        setValue(undefined);
        setError(error);
        return Promise.reject(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, dependencies);

  return { loading, error, value, execute };
}
