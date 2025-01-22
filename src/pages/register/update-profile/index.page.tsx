import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, Button, Heading, Text, TextArea } from "@ignite-ui/react";
import { getServerSession, unstable_getServerSession } from "next-auth/next";

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
  Preview,
} from "./styles";
import type { GetServerSideProps } from "next";
import { buildNextAuthOptions } from "@/pages/api/auth/[...nextauth].api";

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

  const session = useSession()
  const router = useRouter()

  async function handleUpdateProfile(data: UpdateProfileData) {
    await api.put("/users/profile", {
      bio: data.bio,
    });

    await router.push(`/schedule/${session.data?.user.username}`)
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

          <MultiStep size={4} currentStep={4} />
        </Header>

        <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <label htmlFor="avatar">
            <Text>Profile Picture</Text>
            <Avatar 
              id="avatar"
              src={session.data?.user.avatar_url}
              referrerPolicy="no-referrer"
              alt={session.data?.user.name}
            />
          </label>

          <Preview>
            <label htmlFor="bio">
              <Text size="sm">About yourself</Text>
              <TextArea maxLength={200} id="bio" {...register('bio')} />
              <FormAnnotation size="sm">
                Tell us a little about yourself. This will be displayed on your
                personal page.
              </FormAnnotation>
            </label>
          </Preview>

          <Button type="submit" disabled={isSubmitting}>
            Finish
            <ArrowRight />
          </Button>
        </ProfileBox>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  );

  return {
    props: {
      session,
    },
  };
};
