import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import generateQRCode from "./generateQR.js";

export const generateTicket = async (booking) => {
  const ticketDir = path.join(process.cwd(), "tickets");

  if (!fs.existsSync(ticketDir)) {
    fs.mkdirSync(ticketDir, { recursive: true });
  }

  // Generate QR Code
  const qrPath = await generateQRCode(booking);

  const ticketPath = path.join(
    ticketDir,
    `ticket-${booking.id}.pdf`
  );

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const stream = fs.createWriteStream(ticketPath);

    doc.pipe(stream);

    // Header
    doc
      .fontSize(24)
      .fillColor("#2563eb")
      .text("QUICKTICKET", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(18)
      .fillColor("black")
      .text("Movie Ticket", {
        align: "center",
      });

    doc.moveDown(2);

    doc.fontSize(13);

    doc.text(`Booking ID : ${booking.id}`);
    doc.text(`Movie      : ${booking.movie}`);
    doc.text(`Date       : ${booking.date}`);
    doc.text(`Time       : ${booking.time}`);
    doc.text(`Seats      : ${booking.seats}`);
    doc.text(`Amount     : $${booking.amount}`);
    doc.text(`Status     : PAID`);

    doc.moveDown(2);

    // QR Code
    if (fs.existsSync(qrPath)) {
      doc.image(qrPath, {
        fit: [180, 180],
        align: "center",
      });

      doc.moveDown();

      doc
        .fontSize(12)
        .fillColor("gray")
        .text("Scan this QR at theatre entrance", {
          align: "center",
        });
    }

    doc.moveDown(2);

    doc
      .fontSize(14)
      .fillColor("green")
      .text("Enjoy your movie 🍿", {
        align: "center",
      });

    doc.end();

    stream.on("finish", () => {
      resolve(ticketPath);
    });

    stream.on("error", reject);
  });
};

