import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { signIn, useSession } from 'next-auth/react'

import { useRouter } from 'next/router'
import { AuthError, ConnectBox, ConnectItem } from './styles'

import { Container, Header } from '../styles'
import { ArrowRight, Check } from 'phosphor-react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Register() {
    const session = useSession()
    const router = useRouter()

    const hasAuthError = !!router.query.error
    const isSignedId = session.status === 'authenticated'
    async function handleConnectCalendar() {
        await signIn('google')
      }
    const notify = () => toast.success(AuthError);

    return (
        
        <Container>
            <ToastContainer />
            <Header>
                <Heading as="strong">Sync Google Calendar!</Heading>
                <Text>
                    Integrate and manage all your calendars in one place to keep your routine up to date and never miss an appointment!
                </Text>
                <MultiStep size={4} currentStep={2} />
            </Header>
            <ConnectBox>
                <ConnectItem>
                    <Text>Google Calendar</Text>
                    {isSignedId ? (
                        <Button size="sm" disabled>
                            Conectado
                            <Check />
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleConnectCalendar}
                            >
                            Conectar
                            <ArrowRight />
                        </Button>
                    )}
                </ConnectItem>
                {hasAuthError && (
                    <AuthError size="sm">
                        Failed to connect to Google, make sure you have enabled the Google Calendar access permissions.
                    </AuthError>
                ) && notify()}
                <Button type="submit" disabled={!isSignedId}>
                    Next step
                    <ArrowRight />
                </Button>
            </ConnectBox>
        </Container>
    )
}