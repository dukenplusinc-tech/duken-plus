import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm as useFormHook } from 'react-hook-form';
import * as z from 'zod';

import { FormValidationError } from '@/lib/composite/form/errors';
import { useModalDialog } from '@/lib/primitives/modal/hooks';
import { QueryByIdResult } from '@/lib/supabase/useQueryById';
import { toast } from '@/components/ui/use-toast';

interface FormOptions<T, R> {
  schema: T;
  defaultValues: R;
  setDefaultValues?: (key: string, value: any) => void;
  request: (values: R) => Promise<any>;
  fetcher?: QueryByIdResult<R>;
}

export function useForm<S extends z.ZodTypeAny, R>({
  schema,
  defaultValues,
  request,
  fetcher,
  setDefaultValues,
}: FormOptions<S, R>) {
  const t = useTranslations('validation');

  const dialog = useModalDialog();

  const isInitializedRef = useRef(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(undefined);

  const form = useFormHook<z.infer<S>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as never,
  });

  const { setValue, formState } = form;

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
          title: t('success.title'),
          description: t('success.description'),
        });

        dialog.close();
      } catch (e) {
        const isFormValidation = e instanceof FormValidationError;

        toast({
          variant: 'destructive',
          title: `⚠️ ${t(isFormValidation ? 'errors.validation_title' : 'errors.title')}`,
          description: (
            <p>
              <b>{String(isFormValidation ? e.message : e)}</b>

              {!isFormValidation && (
                <pre className="mt-2 max-h-[340px] w-[340px] overflow-y-hidden rounded-md bg-slate-950 p-4">
                  <code className="text-white">
                    {JSON.stringify(e, null, 2)}
                  </code>
                </pre>
              )}
            </p>
          ),
        });
      }

      setIsProcessing(false);
    },
    [dialog, fetcher, request, t]
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
      const { isLoading, error, data } = fetcher;

      if (!isLoading && !error && data) {
        const keys = Object.keys(
          formState?.defaultValues ? formState.defaultValues : data
        );

        keys.forEach((key) => {
          setDefaultValuesFn(key, (data as any)[key] || '');
        });

        // prevent next time form fill in
        isInitializedRef.current = true;
      }
    }
  }, [fetcher, formState, setDefaultValuesFn, setValue]);

  const isUpdating = Boolean(fetcher?.isLoading || fetcher?.isValidating);

  return useMemo(() => {
    return {
      form,
      result,
      data: fetcher?.data,
      isProcessing: isProcessing || isUpdating,
      handleSubmit: form.handleSubmit(onSubmit),
    };
  }, [fetcher?.data, form, isProcessing, isUpdating, onSubmit, result]);
}
