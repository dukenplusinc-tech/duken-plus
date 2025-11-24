import { z, ZodErrorMap } from 'zod';

type TranslationFunction = (key: string, params?: Record<string, any>) => string;

/**
 * Creates a Zod error map with translated messages
 */
export function createZodErrorMap(t: TranslationFunction): ZodErrorMap {
  return (issue, ctx) => {
    let message: string;

    switch (issue.code) {
      case z.ZodIssueCode.invalid_type:
        if (issue.received === 'undefined') {
          message = t('zod.invalid_type.required', { expected: issue.expected });
        } else {
          message = t('zod.invalid_type.invalid', {
            expected: issue.expected,
            received: issue.received,
          });
        }
        break;

      case z.ZodIssueCode.invalid_string:
        // Check if there's a custom message that's a translation key
        if (issue.message && issue.message.startsWith('zod.')) {
          try {
            message = t(issue.message);
          } catch {
            message = t('zod.string.invalid');
          }
        } else if (issue.validation === 'email') {
          message = t('zod.string.email');
        } else if (issue.validation === 'url') {
          message = t('zod.string.url');
        } else if (issue.validation === 'uuid') {
          message = t('zod.string.uuid');
        } else {
          message = t('zod.string.invalid');
        }
        break;

      case z.ZodIssueCode.too_small:
        // Check if there's a custom message that's a translation key
        if (issue.message && issue.message.startsWith('zod.')) {
          try {
            message = t(issue.message);
          } catch {
            message = t('zod.too_small', { minimum: issue.minimum });
          }
        } else if (issue.type === 'string') {
          // Check for specific debtor form fields
          const path = (issue as any).path?.[0];
          if (path === 'full_name' && issue.minimum === 1) {
            message = t('zod.custom.debtor_full_name_required');
          } else if (path === 'address' && issue.minimum === 1) {
            message = t('zod.custom.debtor_address_required');
          } else if (path === 'phone' && issue.minimum === 1) {
            message = t('zod.custom.debtor_phone_invalid');
          } else {
            message =
              issue.exact === true
                ? t('zod.string.exact', { length: issue.minimum })
                : t('zod.string.min', { min: issue.minimum });
          }
        } else if (issue.type === 'number') {
          // Check for max_credit_amount field
          const path = (issue as any).path?.[0];
          if (path === 'max_credit_amount' && issue.minimum === 1000) {
            message = t('zod.custom.debtor_max_credit_min');
          } else {
            message =
              issue.exact === true
                ? t('zod.number.exact', { value: issue.minimum })
                : t('zod.number.min', { min: issue.minimum });
          }
        } else if (issue.type === 'array') {
          message =
            issue.exact === true
              ? t('zod.array.exact', { length: issue.minimum })
              : t('zod.array.min', { min: issue.minimum });
        } else {
          message = t('zod.too_small', { minimum: issue.minimum });
        }
        break;

      case z.ZodIssueCode.too_big:
        if (issue.type === 'string') {
          message =
            issue.exact === true
              ? t('zod.string.exact', { length: issue.maximum })
              : t('zod.string.max', { max: issue.maximum });
        } else if (issue.type === 'number') {
          message =
            issue.exact === true
              ? t('zod.number.exact', { value: issue.maximum })
              : t('zod.number.max', { max: issue.maximum });
        } else if (issue.type === 'array') {
          message =
            issue.exact === true
              ? t('zod.array.exact', { length: issue.maximum })
              : t('zod.array.max', { max: issue.maximum });
        } else {
          message = t('zod.too_big', { maximum: issue.maximum });
        }
        break;

      case z.ZodIssueCode.invalid_enum_value:
        message = t('zod.enum.invalid', {
          options: issue.options.join(', '),
        });
        break;

      case z.ZodIssueCode.custom: {
        console.log('Custom issue:', {
          message: issue.message,
          path: (issue as any).path,
          params: (issue as any).params,
        });

        const paramsKey =
          typeof (issue as any).params?.i18nKey === 'string'
            ? ((issue as any).params.i18nKey as string)
            : undefined;

        const keyToTranslate =
          paramsKey ||
          (issue.message && issue.message.startsWith('zod.')
            ? issue.message
            : undefined);

        if (keyToTranslate) {
          try {
            const translated = t(keyToTranslate);
            if (translated === keyToTranslate) {
              console.warn('Translation returned the key itself, using default');
              message = t('zod.custom.default');
            } else {
              message = translated;
            }
          } catch (error) {
            console.error('Translation failed:', error);
            message = t('zod.custom.default');
          }
        } else {
          console.log('Using message as-is or default:', issue.message);
          message = issue.message || t('zod.custom.default');
        }
        break;
      }

      default:
        message = ctx.defaultError;
    }

    return { message };
  };
}

/**
 * Sets up Zod error map with translations
 * Call this function before using Zod schemas
 */
export function setupZodTranslations(t: TranslationFunction) {
  z.setErrorMap(createZodErrorMap(t));
}

