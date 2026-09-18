import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, CalendarDays, Check } from "lucide-react";

export interface DateRangeValue {
  startDate: string | null;
  endDate: string | null;
  startTime?: string | null;
  endTime?: string | null;
}

export type CalendarActiveField = "checkIn" | "checkOut";

interface CalendarProps {
  value?: DateRangeValue;
  onChange?: (range: DateRangeValue) => void;
  onClose?: () => void;
  className?: string;
  showApplyButton?: boolean;
  label?: string;
  activeField?: CalendarActiveField;
  onActiveFieldChange?: (field: CalendarActiveField) => void;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  onClose,
  className = "",
  showApplyButton = true,
  label,
  activeField: controlledActiveField,
  onActiveFieldChange,
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

  // Active selection mode: 'checkIn' or 'checkOut'
  const [internalActiveField, setInternalActiveField] = useState<CalendarActiveField>(
    controlledActiveField || (value?.startDate && !value?.endDate ? "checkOut" : "checkIn")
  );

  const currentActiveField = controlledActiveField ?? internalActiveField;

  const setActiveField = (field: CalendarActiveField) => {
    setInternalActiveField(field);
    onActiveFieldChange?.(field);
  };

  const [currentMonth, setCurrentMonth] = useState(
    value?.startDate ? dayjs(value.startDate) : today
  );

  useEffect(() => {
    if (value?.startDate !== undefined) setStartDate(value.startDate);
    if (value?.endDate !== undefined) setEndDate(value.endDate);
    if (value?.startDate) setCurrentMonth(dayjs(value.startDate));
  }, [value?.startDate, value?.endDate]);

  useEffect(() => {
    if (controlledActiveField) {
      setInternalActiveField(controlledActiveField);
    }
  }, [controlledActiveField]);

  const updateRange = (start: string | null, end: string | null) => {
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

    if (currentActiveField === "checkIn") {
      // User is selecting Check-In date
      if (endDate && date < endDate) {
        // Keep existing valid checkout
        updateRange(date, endDate);
        setActiveField("checkOut");
      } else {
        // Clear checkout or date is after current checkout
        updateRange(date, null);
        setActiveField("checkOut");
      }
    } else {
      // User is selecting Check-Out date
      if (!startDate) {
        // If no check-in exists yet, treat as check-in
        updateRange(date, null);
        setActiveField("checkOut");
      } else if (date > startDate) {
        // Valid checkout date
        updateRange(startDate, date);
      } else {
        // Clicked date is before or equal to checkin: make this the new checkin
        updateRange(date, null);
        setActiveField("checkOut");
      }
    }
  };

  const handleClear = () => {
    updateRange(null, null);
    setActiveField("checkIn");
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
      className={`w-full max-w-[calc(100vw-1.5rem)] sm:max-w-[360px] rounded-2xl z-50 border border-[#E2B4BD]/50 bg-white p-3.5 sm:p-4 shadow-2xl touch-manipulation select-none ${className}`}
      role="dialog"
      aria-label="Date range picker"
    >
      {label && (
        <div className="mb-2.5 pb-2 border-b border-[#E2B4BD]/30 text-[11px] font-bold text-[#4A4A4A] tracking-wider uppercase flex items-center justify-between">
          <span>{label}</span>
          {nights > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7D6D0]/50 text-[#4A4A4A]">
              {nights} {nights === 1 ? "night" : "nights"}
            </span>
          )}
        </div>
      )}

      {/* Interactive Check-in / Check-out Tab Chips */}
      <div className="grid grid-cols-2 gap-2 mb-3 bg-gradient-to-br from-[#FFF5F5] to-[#FFEEF0] p-1.5 rounded-xl border border-[#E2B4BD]/40 text-xs">
        {/* Check-in Chip Button */}
        <button
          type="button"
          onClick={() => setActiveField("checkIn")}
          className={`p-2.5 rounded-lg text-left transition-all duration-200 cursor-pointer focus:outline-none ${
            currentActiveField === "checkIn"
              ? "bg-white border-2 border-[#4A4A4A] ring-2 ring-[#4A4A4A]/10 shadow-md transform scale-[1.02]"
              : "bg-white/70 hover:bg-white border border-[#E2B4BD]/30 opacity-80 hover:opacity-100"
          }`}
        >
          <div className="flex items-center justify-between mb-0.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A]/70 flex items-center gap-1">
              <CalendarIcon className="w-2.5 h-2.5 text-[#4A4A4A]" />
              <span>Check-in</span>
            </span>
            {currentActiveField === "checkIn" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A4A4A] animate-ping" />
            )}
          </div>
          <span
            className={`block text-xs font-bold truncate transition-colors ${
              startDate ? "text-[#4A4A4A]" : "text-[#4A4A4A]/40 italic"
            }`}
          >
            {startDate ? dayjs(startDate).format("ddd, MMM D") : "Select date"}
          </span>
        </button>

        {/* Check-out Chip Button */}
        <button
          type="button"
          onClick={() => setActiveField("checkOut")}
          className={`p-2.5 rounded-lg text-left transition-all duration-200 cursor-pointer focus:outline-none ${
            currentActiveField === "checkOut"
              ? "bg-white border-2 border-[#4A4A4A] ring-2 ring-[#4A4A4A]/10 shadow-md transform scale-[1.02]"
              : "bg-white/70 hover:bg-white border border-[#E2B4BD]/30 opacity-80 hover:opacity-100"
          }`}
        >
          <div className="flex items-center justify-between mb-0.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A]/70 flex items-center gap-1">
              <CalendarDays className="w-2.5 h-2.5 text-[#4A4A4A]" />
              <span>Check-out</span>
            </span>
            {currentActiveField === "checkOut" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A4A4A] animate-ping" />
            )}
          </div>
          <span
            className={`block text-xs font-bold truncate transition-colors ${
              endDate ? "text-[#4A4A4A]" : "text-[#4A4A4A]/40 italic"
            }`}
          >
            {endDate ? dayjs(endDate).format("ddd, MMM D") : "Select date"}
          </span>
        </button>
      </div>

      {/* Dynamic Status / Instruction Banner */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#4A4A4A] text-center mb-3 bg-[#FFF5F5] border border-[#E2B4BD]/40 py-1.5 px-3 rounded-lg shadow-2xs">
        {currentActiveField === "checkIn" ? (
          <span>👉 Click any date below for your <strong className="text-[#2A2A2A]">Check-in</strong></span>
        ) : !endDate ? (
          <span className="animate-pulse">👉 Now click a date for your <strong className="text-[#2A2A2A]">Check-out</strong></span>
        ) : (
          <span className="flex items-center gap-1 text-emerald-700">
            <Check className="w-3.5 h-3.5" />
            <span>Dates chosen: <strong>{nights} night{nights > 1 ? "s" : ""}</strong> stay</span>
          </span>
        )}
      </div>

      {/* Month Navigator Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[#4A4A4A]">
            {currentMonth.format("MMMM YYYY")}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={previousMonth}
            aria-label="Previous month"
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-[#4A4A4A] hover:bg-[#F7D6D0]/50 active:bg-[#F7D6D0] transition cursor-pointer focus:outline-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={nextMonth}
            aria-label="Next month"
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-[#4A4A4A] hover:bg-[#F7D6D0]/50 active:bg-[#F7D6D0] transition cursor-pointer focus:outline-none"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close calendar"
              className="ml-1 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-[#4A4A4A]/60 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="mb-1.5 grid grid-cols-7 text-center border-b border-[#E2B4BD]/20 pb-1.5">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-0.5 text-[11px] font-bold text-[#4A4A4A]/70 uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Day Grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-8 w-8 sm:h-9 sm:w-9 mx-auto" />;
          }

          const isPast = date < todayStr;
          const isToday = date === todayStr;
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

          let styles = "text-[#4A4A4A] hover:bg-[#F7D6D0]/50 hover:scale-105 active:scale-95";
          let wrapperStyles = "";

          if (isPast) {
            styles = "text-[#4A4A4A]/25 cursor-not-allowed line-through hover:bg-transparent hover:scale-100";
          } else if (isStart || isEnd) {
            styles = "bg-[#4A4A4A] text-white font-bold shadow-md scale-105 z-10 relative ring-2 ring-[#4A4A4A]/20";
          } else if (isInRange) {
            styles = "bg-[#F7D6D0]/60 text-[#4A4A4A] font-semibold rounded-none";
            wrapperStyles = "bg-[#F7D6D0]/30";
          } else if (isHoverRange) {
            styles = "bg-[#FFF5F5] text-[#4A4A4A] border border-dashed border-[#E2B4BD]";
          } else if (isToday) {
            styles += " ring-1 ring-[#4A4A4A]/30 font-semibold";
          }

          return (
            <div key={date} className={`relative flex items-center justify-center ${wrapperStyles}`}>
              <button
                type="button"
                disabled={isPast}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => !isPast && setHoverDate(date)}
                onMouseLeave={() => setHoverDate(null)}
                aria-label={`${isStart ? "Check-in: " : isEnd ? "Check-out: " : ""}${dayjs(date).format("MMMM D, YYYY")}`}
                aria-pressed={isStart || isEnd}
                className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#4A4A4A]/40 ${styles}`}
              >
                {dayjs(date).date()}
                {isToday && !isStart && !isEnd && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#4A4A4A] rounded-full" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Interactive Bottom Action Toolbar */}
      <div className="mt-3 flex items-center justify-between border-t border-[#E2B4BD]/30 pt-3 gap-2">
        <div>
          {(startDate || endDate) ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-[#4A4A4A]/70 hover:text-[#4A4A4A] font-medium underline underline-offset-2 transition cursor-pointer hover:opacity-90"
            >
              Clear dates
            </button>
          ) : (
            <span className="text-[11px] text-[#4A4A4A]/50">Select dates</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showApplyButton && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#4A4A4A] hover:bg-[#2D2D2D] px-4 py-1.5 sm:px-5 sm:py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg transition-all duration-150 active:scale-95 cursor-pointer focus:outline-none"
            >
              {endDate ? "Apply Dates" : "Close"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;