import { Text, Button, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { Form, FormAnnotation } from './styles'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

const ClaimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Must have at least 3 letters.' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'Can only use letters and hyphens.',
    })
    .transform((username) => username.toLowerCase()),
})

type ClaimUsernameFormData = z.infer<typeof ClaimUsernameFormSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(ClaimUsernameFormSchema),
  })
  
  const router = useRouter()
  
  async function handleClaimUsername(data: ClaimUsernameFormData) {
    const { username } = data
    router.push(`/register?username=${username}`)
  }
  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput 
          size="sm" 
          prefix="taly.dev/" 
          placeholder="your-username" 
          {...register('username', { required: true })}
          onPointerEnterCapture={() => {}} 
          onPointerLeaveCapture={() => {}} 
          crossOrigin=""
        />
        <Button size="sm" type="submit" disabled={isSubmitting}>
          Register
          <ArrowRight />
        </Button>
      </Form> 
      
      <FormAnnotation>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : 'Type your desired username'}
        </Text>
      </FormAnnotation>
    </>
  )
}