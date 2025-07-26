"use client"

import { Card, CardContent } from "@/components/ui/card"

interface Event {
  id: string
  title: string
  time: string
  duration: number
  color: string
}

interface DayViewProps {
  currentDate: Date
}

export default function DayView({ currentDate }: DayViewProps) {
  // Sample events for demonstration
  const events: Event[] = [
    { id: "1", title: "Встреча с поставщиком", time: "09:00", duration: 60, color: "bg-green-200" },
    { id: "2", title: "Проверка товара", time: "10:30", duration: 90, color: "bg-blue-200" },
    { id: "3", title: "Обед с партнером", time: "13:00", duration: 60, color: "bg-yellow-200" },
    { id: "4", title: "Инвентаризация", time: "15:00", duration: 120, color: "bg-purple-200" },
    { id: "5", title: "Закрытие смены", time: "18:00", duration: 30, color: "bg-red-200" },
  ]

  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

  const dayNames = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
  const dayName = dayNames[currentDate.getDay()]

  return (
    <div className="h-full overflow-y-auto px-3">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-center text-primary">
          {dayName}, {currentDate.getDate()} {currentDate.toLocaleDateString("ru-RU", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </h2>
      </div>

      <div className="space-y-1">
        {hours.map((hour) => {
          const hourEvents = events.filter((event) => {
            const eventHour = Number.parseInt(event.time.split(":")[0])
            return eventHour === hour
          })

          return (
            <div key={hour} className="flex">
              <div className="w-16 flex-shrink-0 text-right pr-3 py-2">
                <span className="text-sm text-muted-foreground">{hour}:00</span>
              </div>
              <div className="flex-1 min-h-[60px] border-l border-gray-200 pl-3 relative">
                {hourEvents.map((event, index) => (
                  <Card key={event.id} className={`${event.color} border-l-4 border-l-primary mb-2`}>
                    <CardContent className="p-3">
                      <div className="font-medium text-sm">{event.title}</div>
                      <div className="text-xs text-muted-foreground">{event.time}</div>
                    </CardContent>
                  </Card>
                ))}
                {hourEvents.length === 0 && <div className="h-full border-b border-gray-100"></div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
