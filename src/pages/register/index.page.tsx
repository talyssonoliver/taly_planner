import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Container, Form, Header } from "./styles";   
import { ArrowRight } from "phosphor-react";
import styled from "styled-components";

const CustomMultiStep = styled(MultiStep)
  `color: blue;
  .step-active {
    color: green;
  }
  .step-inactive {
    color: gray;
  }`
;

<CustomMultiStep size={4} currentStep={1} />;
export default function Register() {
  return (
    <Container>
      <Header>
        <Heading as="strong" size="3xl">Welcome to TALY!</Heading>
        <Text size="xl" >We need some information to create your account. Oh, you can edit this later.</Text>
        <CustomMultiStep size={4} currentStep={1} />
        
      </Header>

      <Form as="form">
        <label htmlFor="username">
          <Text size="lg">User Name</Text>
          <TextInput id="username" prefix="taly.dev/" placeholder="your username" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>
        </label>
        <label htmlFor="name">
          <Text size="lg">Name and Surname</Text>
          <TextInput placeholder="Your Name" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
        </label>

        <Button type="submit">
          Next
        <ArrowRight />
        </Button>
      </Form>


    </Container>
  )
}
