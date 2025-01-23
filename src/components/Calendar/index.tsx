import { useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { CaretLeft, CaretRight } from "phosphor-react";

import { api } from "../../lib/axios";
import { getWeekDays } from "../../utils/get-week-days";
import {
	CalendarActions,
	CalendarBody,
	CalendarContainer,
	CalendarDay,
	CalendarHeader,
	CalendarTitle,
} from "./styles";

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
	onDateSelected: (date: Date) => void;
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
	const [currentDate, setCurrentDate] = useState(() => {
		return dayjs().set("date", 1);
	});

	const router = useRouter();
	const username = String(router.query.username);

	const handlePreviousMonth = useCallback(() => {
		setCurrentDate((date) => date.subtract(1, "month"));
	}, []);

	const handleNextMonth = useCallback(() => {
		setCurrentDate((date) => date.add(1, "month"));
	}, []);

	const shortWeekDays = getWeekDays({ short: true });
	const currentMonth = currentDate.format("MMMM");
	const currentYear = currentDate.format("YYYY");

	// Busca dados de dias bloqueados da API
	const { data: blockedData } = useQuery<BlockedDates>({
		queryKey: [
			"blocked-dates",
			currentDate.get("year"),
			currentDate.get("month"),
		],
		queryFn: async () => {
			const response = await api.get(`/users/${username}/blocked-dates`, {
				params: {
					year: currentDate.get("year"),
					month: currentDate.get("month") + 1,
				},
			});
			return response.data as BlockedDates;
		},
	});

	const calendarWeeks = useMemo(() => {
		if (!blockedData) {
			return [];
		}

		const { blockedWeekDays, blockedDates } = blockedData;

		// Lista dos dias do mês atual
		const daysInMonthArray = Array.from({
			length: currentDate.daysInMonth(),
		}).map((_, i) => {
			return currentDate.set("date", i + 1);
		});

		// Preenchimento dos dias do mês anterior (no início da grid)
		const firstWeekDay = currentDate.get("day");
		const previousMonthFill = Array.from({ length: firstWeekDay })
			.map((_, i) => currentDate.subtract(i + 1, "day"))
			.reverse();

		// Preenchimento dos dias do mês seguinte (no final da grid)
		const lastDayInCurrentMonth = currentDate.set(
			"date",
			currentDate.daysInMonth(),
		);
		const lastWeekDay = lastDayInCurrentMonth.get("day");
		const nextMonthFill = Array.from({
			length: 7 - (lastWeekDay + 1),
		}).map((_, i) => lastDayInCurrentMonth.add(i + 1, "day"));

		// Combina todos os dias (mês anterior, mês atual, mês seguinte)
		const calendarDays = [
			...previousMonthFill.map((date) => ({ date, disabled: true })),
			...daysInMonthArray.map((date) => ({
				date,
				disabled:
					date.endOf("day").isBefore(new Date()) ||
					blockedWeekDays.includes(date.get("day")) ||
					blockedDates.includes(date.get("date")),
			})),
			...nextMonthFill.map((date) => ({ date, disabled: true })),
		];

		// Agrupa cada 7 dias para formar as semanas
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
	}, [currentDate, blockedData]);

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
						{shortWeekDays.map((weekDay) => (
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
										onClick={() => onDateSelected(date.toDate())}
										disabled={disabled}
									>
										{date.get("date")}
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
