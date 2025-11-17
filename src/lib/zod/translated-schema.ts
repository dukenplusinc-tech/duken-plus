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
        if (issue.validation === 'email') {
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
        if (issue.type === 'string') {
          message =
            issue.exact === true
              ? t('zod.string.exact', { length: issue.minimum })
              : t('zod.string.min', { min: issue.minimum });
        } else if (issue.type === 'number') {
          message =
            issue.exact === true
              ? t('zod.number.exact', { value: issue.minimum })
              : t('zod.number.min', { min: issue.minimum });
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

      case z.ZodIssueCode.custom:
        // If message is a translation key (starts with 'zod.'), try to translate it
        if (issue.message && issue.message.startsWith('zod.custom.')) {
          try {
            message = t(issue.message);
          } catch {
            message = t('zod.custom.default');
          }
        } else if (issue.message && issue.message.startsWith('zod.')) {
          try {
            message = t(issue.message);
          } catch {
            message = t('zod.custom.default');
          }
        } else {
          message = issue.message || t('zod.custom.default');
        }
        break;

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

