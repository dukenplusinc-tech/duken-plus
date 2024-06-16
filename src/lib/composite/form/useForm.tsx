import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useFormHook } from 'react-hook-form';
import * as z from 'zod';

import { useModalDialog } from '@/lib/primitives/modal/hooks';
// import { FetcherResult } from '@/lib/request/useFetcher';
import { toast } from '@/components/ui/use-toast';

// mock
type FetcherResult = any;

interface FormOptions<T, R, FResult = FetcherResult> {
  schema: T;
  defaultValues: R;
  setDefaultValues?: (key: string, value: any) => void;
  request: (values: R) => Promise<any>;
  fetcher?: FResult;
}

export function useForm<S extends z.ZodTypeAny, R, FResult = FetcherResult>({
  schema,
  defaultValues,
  request,
  fetcher: fetcherResult,
  setDefaultValues,
}: FormOptions<S, R, FResult>) {
  const dialog = useModalDialog();

  const fetcher = fetcherResult as never as FetcherResult;

  const isInitializedRef = useRef(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(undefined);

  const form = useFormHook<z.infer<S>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as never,
  });

  const { setError, setValue, formState } = form;

  const onSubmit = useCallback(
    async (values: z.infer<S>) => {
      setIsProcessing(true);

      try {
        const result = await request(values);
        setResult(result);

        if (fetcher?.mutate) {
          await fetcher.mutate(result);
        }

        toast({
          title: '🎉 Done',
          description: 'All changes successfully saved',
        });

        dialog.close();
      } catch (e) {
        toast({
          variant: 'destructive',
          title: '⚠️ Some error occurred',
          description: (
            <pre className="mt-2 max-h-[340px] w-[340px] overflow-y-hidden rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(e, null, 2)}</code>
            </pre>
          ),
        });
      }

      setIsProcessing(false);
    },
    [dialog, fetcher, request]
  );

  const setDefaultValuesFn = useMemo(() => {
    if (setDefaultValues) {
      return setDefaultValues;
    }

    return (key: string, value: any) => {
      setValue(key as never, value);
    };
  }, [setDefaultValues, setValue]);

  // initial data
  useEffect(() => {
    // fill initial data only at the very beginning
    if (!isInitializedRef.current && fetcher) {
      const { isLoading, error, data } = fetcher as never as FetcherResult;

      if (!isLoading && !error && data) {
        const keys = Object.keys(
          formState?.defaultValues ? formState.defaultValues : data
        );

        keys.forEach((key) => {
          setDefaultValuesFn(key, data[key] || '');
        });

        // prevent next time form fill in
        isInitializedRef.current = true;
      }
    }
  }, [fetcher, formState, setDefaultValuesFn, setValue]);

  return useMemo(() => {
    return {
      form,
      result,
      isProcessing,
      handleSubmit: form.handleSubmit(onSubmit),
    };
  }, [form, isProcessing, onSubmit, result]);
}
