// app/components/calendar/CalendarHeader.tsx

'use client';

import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getMonthYearDisplay } from '@/lib/utils/dateUtils';

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onCreateEvent: () => void;
}

export default function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onCreateEvent,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
      {/* Month/Year Display */}
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {getMonthYearDisplay(currentDate)}
        </h2>
        
        <button
          onClick={onToday}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Today
        </button>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Month */}
        <button
          onClick={onPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Next Month */}
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* Create Event Button */}
        <button
          onClick={onCreateEvent}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Create Event</span>
        </button>
      </div>
    </div>
  );
}