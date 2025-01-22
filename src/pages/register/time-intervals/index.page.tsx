import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, Heading, Text, TextInput } from "@ignite-ui/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ArrowRight } from "phosphor-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z, ZodError } from "zod";
import { useState } from "react";
import { api } from "../../../lib/axios";
import { convertTimeStringToMinutes } from "../../../utils/convert-time-string-to-minutes";
import { getWeekDays } from "../../../utils/get-week-days";
import { Container, Header } from "../styles";
import { MultiStep } from "../components";
import {
	FormError,
	IntervalBox,
	IntervalContainer,
	IntervalDay,
	IntervalInputs,
	IntervalItem,
} from "./styles";

const timeIntervalsFormSchema = z.object({
	intervals: z
		.array(
			z.object({
				weekDay: z.number().min(0).max(6),
				enabled: z.boolean(),
				startTime: z.string(),
				endTime: z.string(),
			}),
		)
		.length(7)
		.refine(
			(intervals) =>
				intervals.filter((interval) => interval.enabled).length > 0,
			{
				message: "You must select at least one day of the week",
			},
		)
		.refine(
			(intervals) =>
				intervals
					.filter((interval) => interval.enabled)
					.every((interval) => {
						const start = convertTimeStringToMinutes(interval.startTime);
						const end = convertTimeStringToMinutes(interval.endTime);
						return end - start >= 60;
					}),
			{
				message:
					"The end time must be at least 1 hour later than the start time.",
			},
		),
});

type TimeIntervalsFormData = z.infer<typeof timeIntervalsFormSchema>;

export default function TimeIntervals() {
	const [formError, setFormError] = useState("");
	const {
		handleSubmit,
		control,
		watch,
		formState: { isSubmitting, errors },
	} = useForm<TimeIntervalsFormData>({
		resolver: zodResolver(timeIntervalsFormSchema),
		defaultValues: {
			intervals: [
				{ weekDay: 0, enabled: true, startTime: "08:00", endTime: "18:00" },
				{ weekDay: 1, enabled: true, startTime: "08:00", endTime: "18:00" },
				{ weekDay: 2, enabled: true, startTime: "08:00", endTime: "18:00" },
				{ weekDay: 3, enabled: true, startTime: "08:00", endTime: "18:00" },
				{ weekDay: 4, enabled: true, startTime: "08:00", endTime: "18:00" },
				{ weekDay: 5, enabled: false, startTime: "08:00", endTime: "18:00" },
				{ weekDay: 6, enabled: false, startTime: "08:00", endTime: "18:00" },
			],
		},
	});

	const router = useRouter();
	const weekDays = getWeekDays();
	const { fields } = useFieldArray({
		control,
		name: "intervals",
	});
	const intervals = watch("intervals");

	async function handleSetTimeIntervals(data: TimeIntervalsFormData) {
		try {
			const validIntervals = data.intervals
				.filter((interval) => interval.enabled)
				.map((interval) => ({
					weekDay: interval.weekDay,
					startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
					endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
				}));

			await api.post("/users/time-intervals", {
				intervals: validIntervals,
			});

			await router.push("/register/update-profile");
		} catch (error) {
			if (error instanceof ZodError) {
				setFormError(error.errors[0].message);
			} else {
				setFormError("An unexpected error occurred");
			}
		}
	}

	return (
		<>
			<NextSeo title="Set Your Availability | Taly" noindex />

			<Container>
				<Header>
					<Heading as="strong">Almost there</Heading>
					<Text>
						Define the time intervals you are available each day of the week.
					</Text>

					<MultiStep size={4} currentStep={3} />
				</Header>

				<IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
					<IntervalContainer>
						{fields.map((field, index) => {
							return (
								<IntervalItem key={field.id}>
									<IntervalDay>
										<Controller
											name={`intervals.${index}.enabled`}
											control={control}
											render={({ field }) => {
												return (
													<Checkbox
														onCheckedChange={(checked) =>
															field.onChange(checked === true)
														}
														checked={field.value}
													/>
												);
											}}
										/>
										<Text>{weekDays[field.weekDay]}</Text>
									</IntervalDay>
									<IntervalInputs>
										<Controller
											name={`intervals.${index}.startTime`}
											control={control}
											render={({ field }) => (
												<TextInput
													{...field}
													size="sm"
													type="time"
													step={60}
													disabled={!intervals[index].enabled}
													crossOrigin=""
													onPointerEnterCapture={() => {}}
													onPointerLeaveCapture={() => {}}
												/>
											)}
										/>
										<Controller
											name={`intervals.${index}.endTime`}
											control={control}
											render={({ field }) => (
												<TextInput
													size="sm"
													type="time"
													step={60}
													disabled={!intervals[index].enabled}
													crossOrigin=""
													onPointerEnterCapture={() => {}}
													onPointerLeaveCapture={() => {}}
													{...field}
												/>
											)}
										/>
									</IntervalInputs>
								</IntervalItem>
							);
						})}
					</IntervalContainer>

					{errors.intervals && (
						<FormError size="sm">{errors.intervals.message}</FormError>
					)}
					{formError && <FormError size="sm">{formError}</FormError>}

					<Button type="submit" disabled={isSubmitting}>
						Next step
						<ArrowRight />
					</Button>
				</IntervalBox>
			</Container>
		</>
	);
}
