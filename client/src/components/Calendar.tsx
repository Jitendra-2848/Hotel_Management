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

  React.useEffect(() => {
    if (value?.startDate !== undefined) setStartDate(value.startDate);
    if (value?.endDate !== undefined) setEndDate(value.endDate);
    if (value?.startDate) setCurrentMonth(dayjs(value.startDate));
  }, [value?.startDate, value?.endDate]);

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
      className={`w-full max-w-[calc(100vw-2rem)] sm:max-w-sm rounded-2xl z-50 border border-[#E2B4BD]/50 bg-white p-3 sm:p-4 shadow-xl ${className}`}
    >
      {label && (
        <div className="mb-2 pb-2 border-b border-[#E2B4BD]/30 text-[11px] font-bold text-[#4A4A4A] tracking-wider uppercase">
          {label}
        </div>
      )}

      {/* Dual Check-in / Check-out Manual Inputs */}
      <div className="grid grid-cols-2 gap-2 mb-3 bg-[#FFF5F5] p-2 rounded-xl border border-[#E2B4BD]/40 text-xs">
        <div className="p-1.5 rounded-lg bg-white shadow-2xs border border-[#E2B4BD]/30">
          <label className="block text-[10px] font-bold uppercase text-[#4A4A4A]/70 mb-0.5">
            Check-in
          </label>
          <input
            type="date"
            min={todayStr}
            value={startDate || ""}
            onChange={(e) => {
              const val = e.target.value;
              updateRange(val, endDate && val > endDate ? null : endDate);
              if (val) setCurrentMonth(dayjs(val));
            }}
            className="w-full text-xs font-semibold text-[#4A4A4A] bg-transparent focus:outline-none cursor-pointer"
          />
        </div>
        <div className="p-1.5 rounded-lg bg-white shadow-2xs border border-[#E2B4BD]/30">
          <label className="block text-[10px] font-bold uppercase text-[#4A4A4A]/70 mb-0.5">
            Check-out
          </label>
          <input
            type="date"
            min={startDate || todayStr}
            value={endDate || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (startDate && val < startDate) {
                updateRange(val, null);
              } else {
                updateRange(startDate, val);
              }
              if (val) setCurrentMonth(dayjs(val));
            }}
            className="w-full text-xs font-semibold text-[#4A4A4A] bg-transparent focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[#4A4A4A]">
            {currentMonth.format("MMMM YYYY")}
          </p>

          {nights > 0 && (
            <p className="mt-0.5 text-xs font-semibold text-[#4A4A4A] tabular-nums">
              {nights} {nights === 1 ? "night stay" : "nights stay"}
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
            styles = "text-[#4A4A4A]/30 cursor-not-allowed";
          } else if (isStart || isEnd) {
            styles = "bg-[#4A4A4A] text-brand-white font-semibold shadow-xs scale-105";
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
              className={`mx-auto flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg text-xs transition cursor-pointer ${styles}`}
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
              className="rounded-xl bg-[#4A4A4A] hover:bg-[#2D2D2D] px-4 py-1.5 text-xs font-semibold text-brand-white shadow-xs transition active:scale-95 cursor-pointer"
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