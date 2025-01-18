import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Container, Form, Header, FormError} from "./styles";   
import { ArrowRight } from "phosphor-react";
import { z } from "zod";
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { AxiosError } from 'axios'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/lib/axios";

type RegisterFormData = z.infer<typeof registerFormSchema>

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Must have at least 3 letters.' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'Can only use letters and hyphens.',
    })
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, { message: 'Must have at least trhee letters.' }),
})

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const router = useRouter()
  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      })
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        alert(err.response.data.message)
        return
      }
      console.error(err)
    }
  }

  return (
    <Container>
      <Header>
        <Heading as="strong" size="3xl">Welcome to TALY!</Heading>
        <Text size="xl" >We need some information to create your account. Oh, you can edit this later.</Text>
        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label htmlFor="Username">
          <Text size="sm">Username</Text>
          <TextInput id="username" prefix="taly.dev/" placeholder="your username" { ...register('username', { required: true }) } crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>
          
          {errors.username && (
            <FormError size="sm">{errors.username.message}</FormError>
          )}
        </label>
        <label htmlFor="name">
          <Text size="lg">Name and Surname</Text>
          <TextInput placeholder="Your Name" { ...register('name', { required: true }) } crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          {errors.name && (
            <FormError size="sm">{errors.name.message}</FormError>
          )}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Next
        <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
