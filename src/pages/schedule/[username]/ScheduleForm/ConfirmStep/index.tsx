import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { CalendarBlank, Clock } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../../../lib/axios";
import { ConfirmForm, FormActions, FormError, FormHeader } from "./styles";

const confirmFormSchema = z.object({
	name: z.string().min(3, { message: "O nome precisa no mínimo 3 caracteres" }),
	email: z.string().email({ message: "Digite um e-mail válido" }),
	observations: z.string().nullable(),
});

type ConfirmFormData = z.infer<typeof confirmFormSchema>;

interface ConfirmStepProps {
	schedulingDate: Date;
	onCancelConfirmation: () => void;
}

export function ConfirmStep({
	schedulingDate,
	onCancelConfirmation,
}: ConfirmStepProps) {
	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm<ConfirmFormData>({
		resolver: zodResolver(confirmFormSchema),
	});

	const router = useRouter();
	const username = String(router.query.username);

	async function handleConfirmScheduling(data: ConfirmFormData) {
		const { name, email, observations } = data;

		await api.post(`/users/${username}/schedule`, {
			name,
			email,
			observations,
			date: schedulingDate,
		});

		onCancelConfirmation();
	}

	const describedDate = dayjs(schedulingDate).format("DD[ de ]MMMM[ de ]YYYY");
	const describedTime = dayjs(schedulingDate).format("HH:mm[h]");

	return (
		<ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
			<FormHeader>
				<Text>
					<CalendarBlank />
					{describedDate}
				</Text>
				<Text>
					<Clock />
					{describedTime}
				</Text>
			</FormHeader>

			<label htmlFor="name">
				<Text size="sm">Your name</Text>
				<TextInput
					id="name"
					type="text"
					placeholder="Your Name"
					onPointerEnterCapture={() => {}}
					onPointerLeaveCapture={() => {}}
					crossOrigin=""
					{...register("name")}
				/>
				{errors.name && <FormError size="sm">{errors.name.message}</FormError>}
			</label>

			<label htmlFor="Email">
				<Text size="sm">Email Address</Text>
				<TextInput
					id="email"
					type="email"
					placeholder="johndoe@example.com"
					onPointerEnterCapture={() => {}}
					onPointerLeaveCapture={() => {}}
					crossOrigin=""
					{...register("email")}
				/>
				{errors.email && (
					<FormError size="sm">{errors.email.message}</FormError>
				)}
			</label>

			<label htmlFor="observations">
				<Text size="sm">Observations</Text>
				<TextArea {...register("observations")} />
			</label>

			<FormActions>
				<Button type="button" variant="tertiary" onClick={onCancelConfirmation}>
					Cancell
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					Confirm
				</Button>
			</FormActions>
		</ConfirmForm>
	);
}
