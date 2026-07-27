import transporter from "../configs/mail.js";

const sendBookingEmail = async (email, booking, ticketPath) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: email,

      subject: "🎬 QuickTicket Booking Confirmed",

      attachments: [
        {
          filename: "QuickTicket.pdf",
          path: ticketPath,
        },
      ],


      html: `
      <div style="font-family:Arial;padding:20px">

        <h2>Booking Confirmed ✅</h2>

        <p>Thank you for booking with <b>QuickTicket</b>.</p>

        <hr>

        <h3>${booking.movie}</h3>

        <p><b>Date:</b> ${booking.date}</p>

        <p><b>Time:</b> ${booking.time}</p>

        <p><b>Seats:</b> ${booking.seats}</p>

        <p><b>Amount:</b> $${booking.amount}</p>

        <p><b>Booking ID:</b> ${booking.id}</p>

        <br>

        <p>Your movie ticket is attached as a PDF.</p>

        <h3>Enjoy your movie 🍿</h3>

      </div>
      `,
    });

    console.log(info);
    console.log(ticketPath);
  } catch (error) {
    console.error(error);
  }
};

export default sendBookingEmail;