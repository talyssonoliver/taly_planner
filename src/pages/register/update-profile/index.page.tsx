import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, Button, Heading, Text, TextArea } from "@ignite-ui/react";
import type { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../lib/axios";
import { Container, Header } from "../styles";
import { MultiStep } from "../components";
import {
  FormAnnotation,
  ProfileBox,
  StyledTextArea,
  StyledButton,
  Preview,
} from "./styles";
import authHandler from "@/pages/api/auth/[...nextauth].api";

const updateProfileSchema = z.object({
  bio: z.string(),
});

type UpdateProfileData = z.infer<typeof updateProfileSchema>;

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  });

  interface ExtendedUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
  }

  const session = useSession() as { data: { user: ExtendedUser } };
  const router = useRouter();

  async function handleUpdateProfile(data: UpdateProfileData) {
    await api.put("/users/profile", {
      bio: data.bio,
    });

    if (session.data?.user?.username) {
      await router.push(`/schedule/${session.data.user.username}`);
    }
  }

  return (
    <>
      <NextSeo title="Update Profile | Taly" noindex />

      <Container>
        <Header>
          <Heading as="strong">Welcome to Taly!</Heading>
          <Text>
            We need some information to create your profile! Oh, you can edit
            this information later.
          </Text>

          <MultiStep size={4} currentStep={3} />
        </Header>

        <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <label htmlFor="avatar">
            <Text>Profile Picture</Text>
            <Avatar
              id="avatar"
              src={session.data?.user?.image || ""}
              referrerPolicy="no-referrer"
              alt={session.data?.user?.name || ""}
            />
          </label>

          <Preview>
            <label htmlFor="bio">
              <Text size="sm">About yourself</Text>
              <StyledTextArea maxLength={200} id="bio" {...register("bio")} />
              <FormAnnotation size="sm">
                Tell us a little about yourself. This will be displayed on your
                personal page.
              </FormAnnotation>
            </label>
          </Preview>

          <StyledButton type="submit" disabled={isSubmitting}>
            Finish
            <ArrowRight />
          </StyledButton>
        </ProfileBox>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req as NextApiRequest,
    res as NextApiResponse,
    authHandler(req as NextApiRequest, res as NextApiResponse),
  );

  return {
    props: {
      session,
    },
  };
};
