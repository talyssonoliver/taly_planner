import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { CaretLeft, CaretRight } from "phosphor-react";
import { useMemo, useState } from "react";
import type React from "react";
import { api } from "@/lib/axios";
import { getWeekDays } from "@/utils/get-week-days";
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from "@/components/Calendar/styles";

interface CalendarWeek {
  week: number;
  days: Array<{
    date: dayjs.Dayjs;
    disabled: boolean;
  }>;
}

type CalendarWeeks = CalendarWeek[];

interface BlockedDates {
  blockedWeekDays: number[];
  blockedDates: number[];
}

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelected: React.Dispatch<React.SetStateAction<Date | null>>;
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().date(1);
  });

  const router = useRouter();
  const username = String(router.query.username || "");

  function handlePreviousMonth() {
    const previousMonth = currentDate.subtract(1, "month");
    setCurrentDate(previousMonth);
  }

  function handleNextMonth() {
    const nextMonth = currentDate.add(1, "month");
    setCurrentDate(nextMonth);
  }

  const shortWeekDays = getWeekDays();

  const currentMonth = currentDate.format("MMMM");
  const currentYear = currentDate.format("YYYY");

  const { data: blockedDates } = useQuery<BlockedDates>({
    queryKey: ["blocked-dates", currentDate.year(), currentDate.month()],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.year(),
          month: currentDate.month() + 1,
        },
      });
      return response.data as BlockedDates;
    },
  });

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return [] as CalendarWeeks;
    }

    const daysInMonth = currentDate.daysInMonth();

    const daysInMonthArray = Array.from({ length: daysInMonth }).map((_, i) => {
      return currentDate.date(i + 1);
    });

    const firstWeekDay = currentDate.day();

    const previousMonthFillArray = Array.from({ length: firstWeekDay })
      .map((_, i) => {
        return currentDate.date(1).subtract(i + 1, "day");
      })
      .reverse();

    const lastDayInCurrentMonth = currentDate.date(daysInMonth);
    const lastWeekDay = lastDayInCurrentMonth.day();

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, "day");
    });

    const calendarDays = [
      ...previousMonthFillArray.map((day) => {
        return { date: day, disabled: true };
      }),
      ...daysInMonthArray.map((day) => {
        return {
          date: day,
          disabled:
            day.endOf("day").isBefore(new Date()) ||
            blockedDates.blockedWeekDays.includes(day.day()) ||
            blockedDates.blockedDates.includes(day.date()),
        };
      }),
      ...nextMonthFillArray.map((day) => {
        return { date: day, disabled: true };
      }),
    ];

    const weeks = calendarDays.reduce<CalendarWeeks>((acc, _, i, original) => {
      if (i % 7 === 0) {
        acc.push({
          week: i / 7 + 1,
          days: original.slice(i, i + 7),
        });
      }
      return acc;
    }, []);

    return weeks;
  }, [currentDate, blockedDates]);

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button
            type="button"
            onClick={handlePreviousMonth}
            title="Previous month"
          >
            <CaretLeft />
          </button>
          <button type="button" onClick={handleNextMonth} title="Next month">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay: string) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => (
            <tr key={week}>
              {days.map(({ date, disabled }) => (
                <td key={date.toString()}>
                  <CalendarDay
                    onClick={() => {
                      if (!disabled) {
                        onDateSelected(date.toDate());
                      }
                    }}
                    disabled={disabled}
                  >
                    {date.date()}
                  </CalendarDay>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  );
}
