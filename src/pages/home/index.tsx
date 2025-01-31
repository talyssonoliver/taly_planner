import { Heading, Text } from "@ignite-ui/react";
import Image from "next/image";
import { Container, Hero, Preview } from "./styles";
import previewImage from "../../assets/app-preview.png";
import { ClaimUsernameForm } from "./components/ClaimUsernameForm";
import { NextSeo } from "next-seo";

export default function Home() {
	return (
		<>
			<NextSeo
				title="Uncomplicated scheduling | Taly Planner"
				description="Connect your calendar and let people book you when you're free!"
			/>

			<Container>
				<Hero>
					<Heading as="h1" size="4xl">
						Uncomplicated scheduling
					</Heading>
					<Text size="xl">
						Connect your calendar and let people book you when you&apos;re free!
					</Text>
					<ClaimUsernameForm />
				</Hero>
				<Preview>
					<Image
						src={previewImage}
						height={400}
						quality={100}
						priority
						alt="Simbolic Calendar Preview"
					/>
				</Preview>
			</Container>
		</>
	);
}
