import { Box, styled, Text } from "@ignite-ui/react";

export const Form = styled(Box, {
	gridTemplateColumns: "1fr auto",
	gap: "$2",
	padding: "$4",
	marginTop: "$4",
	display: "grid",

	"@media(max-width: 600px)": {
		gridTemplateColumns: "1fr",
	},
});

export const FormAnnotation = styled("div", {
	[`> ${Text}`]: {
		color: "$gray400",
	},
	marginTop: "$2.01",
});
