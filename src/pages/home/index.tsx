import { Heading, Text } from '@ignite-ui/react'
import Image from 'next/image'
import { Container, Hero, Preview } from './styles'
import previewImage from '../../assets/app-preview.png'
import { ClaimUsernameForm } from './components/ClaimUsernameForm'
import { Smiley } from 'phosphor-react'


export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading as="h1" size="4xl">Uncomplicated scheduling</Heading>
        <Text>Organize your appointments in a simple and efficient way.</Text>
        <ClaimUsernameForm />
        <Text size="sm" >Connect your calendar and let people book you when you're free!</Text>
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
  )
}