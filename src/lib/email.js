import { Resend } from 'resend'

export async function sendBookingConfirmation({
  to,
  guestName,
  hotelName,
  roomName,
  pricePerNight,
  checkIn,
  checkOut,
  totalPrice,
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set, skipping email')
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: 'Hotel Booking <onboarding@resend.dev>',
    to,
    subject: `Booking Confirmation - ${hotelName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #007bff;">Booking Confirmation</h1>
        <p>Dear ${guestName},</p>
        <p>Thank you for your booking! Here are your details:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Hotel</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${hotelName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Room</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${roomName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Price per night</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${pricePerNight} €</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Check-in</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${checkIn}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Check-out</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${checkOut}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Total</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #007bff;">${totalPrice} €</td>
          </tr>
        </table>

        <p>We look forward to welcoming you!</p>
        <p style="color: #666; font-size: 0.9em;">This is an automated message from Hotel Booking System.</p>
      </div>
    `,
  })
}
