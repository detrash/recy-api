import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface CalculatorSupportEmailProps {
  companyType: string;
  employeesQuantity: number;
  wasteFootPrint: number;
}

const CalculatorSupportEmail = ({
  companyType,
  employeesQuantity,
  wasteFootPrint,
}: CalculatorSupportEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Recy Network Waste Footprint Calculator</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://detrash-public.s3.amazonaws.com/images/recy-logo.png"
            width="48"
            alt="Recy Networking"
          />
          <Section>
            <Text style={text}>
              Thank you for contacting us, we wanted to inform you that we will
              be reaching out to you shortly. Please stay tuned for our upcoming
              communication.{' '}
            </Text>

            <Text style={text}>Company Type: {companyType}</Text>
            <Text style={text}>Employees Quantity: {employeesQuantity} </Text>
            <Text style={text}>Waste Footprint: {wasteFootPrint} </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

CalculatorSupportEmail.PreviewProps = {
  companyType: 'Acme Inc.',
  employeesQuantity: 40,
  wasteFootPrint: 2400,
} as CalculatorSupportEmailProps;

export default CalculatorSupportEmail;

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
};

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#020817',
  lineHeight: '26px',
};
