import React, { useState } from "react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface DateRangeValue {
  startDate: string | null;
  endDate: string | null;
  startTime?: string | null;
  endTime?: string | null;
}

interface CalendarProps {
  value?: DateRangeValue;
  onChange?: (range: DateRangeValue) => void;
  onClose?: () => void;
  className?: string;
  showApplyButton?: boolean;
  label?: string;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  onClose,
  className = "",
  showApplyButton = true,
  label,
}) => {
  const today = dayjs();
  const todayStr = today.format("YYYY-MM-DD");

  const [startDate, setStartDate] = useState<string | null>(
    value?.startDate ?? null
  );

  const [endDate, setEndDate] = useState<string | null>(
    value?.endDate ?? null
  );

  const [hoverDate, setHoverDate] = useState<string | null>(null);

  const [currentMonth, setCurrentMonth] = useState(
    value?.startDate ? dayjs(value.startDate) : today
  );

  const updateRange = (
    start: string | null,
    end: string | null
  ) => {
    setStartDate(start);
    setEndDate(end);

    onChange?.({
      startDate: start,
      endDate: end,
      startTime: value?.startTime,
      endTime: value?.endTime,
    });
  };

  const handleDateClick = (date: string) => {
    if (date < todayStr) return;

    // Start a new range
    if (!startDate || endDate) {
      updateRange(date, null);
      return;
    }

    // Complete the range
    if (date >= startDate) {
      updateRange(startDate, date);
    } else {
      updateRange(date, startDate);
    }
  };

  const previousMonth = () => {
    setCurrentMonth((month) => month.subtract(1, "month"));
  };

  const nextMonth = () => {
    setCurrentMonth((month) => month.add(1, "month"));
  };

  const daysInMonth = currentMonth.daysInMonth();
  const firstDay = currentMonth.startOf("month").day();

  const days = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      currentMonth.date(i + 1).format("YYYY-MM-DD")
    ),
  ];

  const nights =
    startDate && endDate
      ? dayjs(endDate).diff(dayjs(startDate), "day")
      : 0;

  return (
    <div
      className={`w-full max-w-sm rounded-2xl border border-[#E2B4BD]/50 bg-white p-4 shadow-xl ${className}`}
    >
      {label && (
        <div className="mb-2 pb-2 border-b border-[#E2B4BD]/30 text-[11px] font-bold text-[#4A4A4A] tracking-wider uppercase">
          {label}
        </div>
      )}

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[#4A4A4A]">
            {currentMonth.format("MMMM YYYY")}
          </p>

          {nights > 0 && (
            <p className="mt-0.5 text-xs font-semibold text-[#4A4A4A]">
              {nights} {nights === 1 ? "night selected" : "nights selected"}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={previousMonth}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#4A4A4A] hover:bg-[#F7D6D0]/40 transition cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={nextMonth}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#4A4A4A] hover:bg-[#F7D6D0]/40 transition cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close calendar"
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg text-[#4A4A4A]/60 hover:bg-[#F7D6D0]/40 hover:text-[#4A4A4A] transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Weekdays */}
      <div className="mb-2 grid grid-cols-7 text-center">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-1.5 text-[11px] font-semibold text-[#4A4A4A]/60"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />;
          }

          const isPast = date < todayStr;
          const isStart = date === startDate;
          const isEnd = date === endDate;

          const isInRange =
            startDate &&
            endDate &&
            date > startDate &&
            date < endDate;

          const isHoverRange =
            startDate &&
            !endDate &&
            hoverDate &&
            hoverDate > startDate &&
            date > startDate &&
            date <= hoverDate;

          let styles =
            "text-[#4A4A4A] hover:bg-[#F7D6D0]/30";

          if (isPast) {
            styles = "text-stone-300 cursor-not-allowed";
          } else if (isStart || isEnd) {
            styles = "bg-[#4A4A4A] text-white font-semibold shadow-xs scale-105";
          } else if (isInRange) {
            styles = "bg-[#F7D6D0]/50 text-[#4A4A4A] font-semibold border-y border-[#E2B4BD]/40 rounded-none";
          } else if (isHoverRange) {
            styles = "bg-[#FFF5F5] text-[#4A4A4A]";
          }

          return (
            <button
              key={date}
              type="button"
              disabled={isPast}
              onClick={() => handleDateClick(date)}
              onMouseEnter={() => setHoverDate(date)}
              onMouseLeave={() => setHoverDate(null)}
              className={`mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-xs transition ${styles}`}
            >
              {dayjs(date).date()}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      {(startDate || endDate) && (
        <div className="mt-4 flex items-center justify-between border-t border-[#E2B4BD]/30 pt-3">
          <div className="text-xs text-[#4A4A4A] font-medium">
            {startDate && dayjs(startDate).format("MMM D")}
            {endDate && <> → {dayjs(endDate).format("MMM D, YYYY")}</>}
          </div>

          {showApplyButton && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#4A4A4A] hover:bg-[#2D2D2D] px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition active:scale-95 cursor-pointer"
            >
              Apply
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;