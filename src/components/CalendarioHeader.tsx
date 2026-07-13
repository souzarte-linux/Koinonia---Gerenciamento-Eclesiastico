import React from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarioHeaderProps {
  currentDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
}

export default function CalendarioHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarioHeaderProps) {
  return (
    <div className="flex items-center justify-between flex-1">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <button
          onClick={onToday}
          className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition"
        >
          Hoje
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevMonth}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onNextMonth}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
