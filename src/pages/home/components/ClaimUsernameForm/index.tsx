import { Button, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { Form } from './styles'

export function ClaimUsernameForm() {
  return (
    <Form as="form">
      <TextInput 
        size="sm" 
        prefix="taly.dev/" 
        placeholder="your-username" 
        onPointerEnterCapture={() => {}} 
        onPointerLeaveCapture={() => {}} 
        crossOrigin=""
      />
      <Button size="sm" type="submit">
        Booking
        <ArrowRight />
      </Button>
    </Form>
  )
}