import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useFiltersCtx } from '@/lib/composite/filters/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const SearchInput: FC<{
  searchBy?: string;
  digitsSearchByField?: string;
  placeholder?: string;
}> = ({ searchBy = 'title', digitsSearchByField, placeholder }) => {
  const t = useTranslations();

  const { setFilters, removeFilter, reset } = useFiltersCtx();

  const resetRef = useRef(reset);

  useEffect(() => {
    resetRef.current = reset;
  }, [reset]);

  useEffect(() => {
    return () => {
      resetRef.current();
    };
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();

      if (digitsSearchByField && !Number.isNaN(parseInt(searchTerm, 10))) {
        // "or" search
        setFilters([
          {
            key: digitsSearchByField,
            like: `${searchTerm}%`,
          },
        ]);
      } else {
        // normal search
        setFilters([
          {
            key: searchBy,
            search: searchTerm,
          },
        ]);
      }
    },
    [digitsSearchByField, searchBy, searchTerm, setFilters]
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target: { value } }) => {
      setSearchTerm(value);

      if (!value) {
        removeFilter(searchBy);
      }
    },
    [removeFilter, searchBy]
  );

  return (
    <form
      className="relative flex-1 flex items-center rounded-md bg-white overflow-hidden h-[38px]"
      onSubmit={handleSubmit}
    >
      <Input
        type="search"
        placeholder={placeholder || t('filters.search')}
        className="flex-1 border-4 border-primary focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
        value={searchTerm}
        onChange={handleChange}
      />
      <Button
        type="submit"
        variant="default"
        size="sm"
        className="rounded-none bg-primary hover:bg-primary/90 text-white px-4 h-full absolute right-0"
      >
        <Search className="mr-2 h-4 w-4" />
        {t('filters.action')}
      </Button>
    </form>
  );
};
