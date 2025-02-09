'use client';

import { FC } from 'react';
import { Loader2 as Loader, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useEmployees } from '@/lib/entities/employees/hooks/useEmployees';
import { ErrorScreen } from '@/components/ui/page/screen/error';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EmployeeSelectProps {
  selectedEmployeeId: string;
  onSelect: (id: string) => void;
}

export const EmployeeSelect: FC<EmployeeSelectProps> = ({
  selectedEmployeeId,
  onSelect,
}) => {
  const t = useTranslations('employees.login');

  const { data, isLoading, error } = useEmployees();

  // Flatten the paginated result into a single array.
  const employees = data?.flat() ?? [];

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Loader className="animate-spin ml-2 h-10 w-10" />
      </div>
    );
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="space-y-2">
      <Select value={selectedEmployeeId} onValueChange={onSelect}>
        <SelectTrigger className="h-14 text-left">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <SelectValue placeholder={t('select_profile_label')} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {employees.map((employee) => (
            <SelectItem key={employee.id} value={employee.id} className="h-12">
              {employee.full_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
