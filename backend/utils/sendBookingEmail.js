import transporter from "../configs/mail.js";

const sendBookingEmail = async (email, booking, ticketPath) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🎬 QuickTicket Booking Confirmed",

    html: `
      <h2>Booking Confirmed ✅</h2>

      <p><b>Movie:</b> ${booking.movie}</p>

      <p><b>Date:</b> ${booking.date}</p>

      <p><b>Time:</b> ${booking.time}</p>

      <p><b>Seats:</b> ${booking.seats}</p>

      <p><b>Amount:</b> $${booking.amount}</p>

      <p><b>Booking ID:</b> ${booking.id}</p>

      <br>

      <b>Your PDF Ticket is attached.</b>
    `,

    attachments: [
      {
        filename: `QuickTicket-${booking.id}.pdf`,
        path: ticketPath,
      },
    ],
  });
};

export default sendBookingEmail;