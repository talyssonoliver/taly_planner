import { globalCss } from "@ignite-ui/react";

export const globalStyles = globalCss({
	"*": {
		boxSizing: "border-box",
		padding: 0,
		margin: 0,
	},

	body: {
		fontFamily: "'Roboto', sans-serif",
		backgroundColor: "$gray900",
		color: "$gray100",
		"-webkit-font-smoothing": "antialiased",
	},
});
