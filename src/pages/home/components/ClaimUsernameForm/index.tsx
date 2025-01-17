import { Text, Button, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { Form, FormAnnotation } from './styles'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'

const ClaimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'User must have at least 3 letters.' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'The user can only have letters and hyphens.',
    })
    .transform((username) => username.toLowerCase()),
})

type ClaimUsernameFormData = z.infer<typeof ClaimUsernameFormSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(ClaimUsernameFormSchema),
  })

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    console.log(data)
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
        <Button size="sm" type="submit">
          Register
          <ArrowRight />
        </Button>
      </Form> 
      
      <FormAnnotation>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : 'Type the desired username'}
        </Text>
      </FormAnnotation>
    </>
  )
}