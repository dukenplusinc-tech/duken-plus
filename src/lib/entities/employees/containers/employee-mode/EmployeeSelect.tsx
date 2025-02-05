'use client';

import { FC } from 'react';
import { Users } from 'lucide-react';

import { useEmployees } from '@/lib/entities/employees/hooks/useEmployees';
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
  const { data, isLoading, error } = useEmployees();

  // Flatten the paginated result into a single array.
  const employees = data?.flat() ?? [];

  if (isLoading) {
    return <div>Loading employees...</div>;
  }

  if (error) {
    return <div>Error loading employees.</div>;
  }

  return (
    <div className="space-y-2">
      <Select value={selectedEmployeeId} onValueChange={onSelect}>
        <SelectTrigger className="h-14 text-left">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <SelectValue placeholder="Select your profile" />
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
