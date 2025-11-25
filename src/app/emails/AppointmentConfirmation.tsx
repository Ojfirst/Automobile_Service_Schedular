import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Row,
  Column,
} from '@react-email/components'

interface AppointmentConfirmationEmailProps {
  customerName: string
  appointmentDate: string
  serviceName: string
  vehicleInfo: string
  duration: number
  price: number
  appointmentId: string
}

export function AppointmentConfirmationEmail({
  customerName,
  appointmentDate,
  serviceName,
  vehicleInfo,
  duration,
  price,
  appointmentId,
}: AppointmentConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Auto Service Appointment is Confirmed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>AutoCare Scheduler</Heading>
            <Text style={subtitle}>Service Appointment Confirmation</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Hello {customerName},</Text>
            <Text style={paragraph}>
              Your service appointment has been confirmed. Here are your appointment details:
            </Text>

            <Section style={details}>
              <Row>
                <Column>
                  <Text style={label}>Service:</Text>
                  <Text style={value}>{serviceName}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={label}>Vehicle:</Text>
                  <Text style={value}>{vehicleInfo}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={label}>Date & Time:</Text>
                  <Text style={value}>{appointmentDate}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={label}>Duration:</Text>
                  <Text style={value}>{duration} minutes</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={label}>Total:</Text>
                  <Text style={value}>${price}</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            <Section style={instructions}>
              <Heading style={h2}>What to Bring</Heading>
              <Text style={listItem}>• Vehicle registration documents</Text>
              <Text style={listItem}>• Insurance information</Text>
              <Text style={listItem}>• Your service history (if available)</Text>
            </Section>

            <Section style={instructions}>
              <Heading style={h2}>Reminders</Heading>
              <Text style={listItem}>• Please arrive 10-15 minutes before your scheduled time</Text>
              <Text style={listItem}>• Contact us if you need to reschedule</Text>
              <Text style={listItem}>• Appointment ID: {appointmentId}</Text>
            </Section>

            <Text style={footer}>
              Thank you for choosing AutoCare Scheduler. We look forward to serving you!
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
}

const header = {
  backgroundColor: '#3b82f6',
  padding: '30px',
  textAlign: 'center' as const,
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
}

const subtitle = {
  color: '#dbeafe',
  fontSize: '16px',
  margin: '8px 0 0 0',
}

const content = {
  padding: '30px',
}

const greeting = {
  fontSize: '18px',
  color: '#1f2937',
  margin: '0 0 20px 0',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#4b5563',
  margin: '0 0 20px 0',
}

const details = {
  backgroundColor: '#f8fafc',
  padding: '20px',
  borderRadius: '6px',
  margin: '20px 0',
}

const label = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0',
  fontWeight: 'bold',
}

const value = {
  fontSize: '16px',
  color: '#1f2937',
  margin: '0 0 12px 0',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '30px 0',
}

const h2 = {
  fontSize: '18px',
  color: '#1f2937',
  margin: '0 0 12px 0',
}

const instructions = {
  margin: '0 0 20px 0',
}

const listItem = {
  fontSize: '14px',
  color: '#4b5563',
  margin: '4px 0',
}

const footer = {
  fontSize: '14px',
  color: '#6b7280',
  textAlign: 'center' as const,
  margin: '30px 0 0 0',
}