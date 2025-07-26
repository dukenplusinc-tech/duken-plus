'use client';

import { FC, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import DayView from './day-view';
import MonthView from './month-view';

export const CalendarDelivers: FC = () => {
  const t = useTranslations('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'month'>('day');

  const monthNames = t.raw('months') as string[];

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setMonth(
        currentDate.getMonth() + (direction === 'next' ? 1 : -1)
      );
    }
    setCurrentDate(newDate);
  };

  const getHeaderTitle = () => {
    if (view === 'day') {
      return `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
  };

  return (
    <div className="-m-4">
      {/* Calendar Header */}
      <Card className="rounded-none border-x-0 border-t-0">
        <CardContent className="p-3 bg-primary text-primary-foreground">
          <div className="flex items-center mb-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => navigateDate('prev')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">{getHeaderTitle()}</h1>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => navigateDate('next')}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* View Toggle */}
          <Tabs
            value={view}
            onValueChange={(value) => setView(value as 'day' | 'month')}
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="day">{t('day')}</TabsTrigger>
              <TabsTrigger value="month">{t('month')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Calendar Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={view} className="h-full">
          <TabsContent value="day" className="h-full mt-0">
            <DayView currentDate={currentDate} />
          </TabsContent>
          <TabsContent value="month" className="h-full mt-0">
            <MonthView
              currentDate={currentDate}
              onDateSelect={setCurrentDate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
