import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import generateQRCode from "./generateQR.js";

export const generateTicket = async (booking) => {
  const ticketDir = "/tmp";

  if (!fs.existsSync(ticketDir)) {
    fs.mkdirSync(ticketDir, { recursive: true });
  }

  const qrPath = await generateQRCode(booking);

  const ticketPath = path.join(
    ticketDir,
    `ticket-${booking.id}.pdf`
  );

  const logoPath = path.join(process.cwd(), "assets", "favicon.svg");

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const stream = fs.createWriteStream(ticketPath);

    doc.pipe(stream);

    // ===========================
    // LOGO
    // ===========================

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 235, 30, {
        width: 120,
      });

      doc.moveDown(5);
    }

    // ===========================
    // HEADER
    // ===========================

    doc
      .fontSize(28)
      .fillColor("#2563eb")
      .text("QUICKTICKET", {
        align: "center",
      });

    doc
      .fontSize(14)
      .fillColor("gray")
      .text("Movie Ticket", {
        align: "center",
      });

    doc.moveDown();

    // ===========================
    // Divider
    // ===========================

    doc
      .moveTo(50, 170)
      .lineTo(545, 170)
      .strokeColor("#d1d5db")
      .lineWidth(1)
      .stroke();

    doc.moveDown(2);

    // ===========================
    // BOOKING DETAILS
    // ===========================

    const bookingNumber = `QT-${booking.id
      .slice(-8)
      .toUpperCase()}`;

    doc
      .fontSize(15)
      .fillColor("black")
      .text(`🎬 Movie : ${booking.movie}`);

    doc.moveDown(0.4);

    doc.text(`🏢 Theatre : QuickTicket Cinema`);

    doc.moveDown(0.4);

    doc.text(`🎟 Screen : Screen 2`);

    doc.moveDown(0.4);

    doc.text(`📅 Date : ${booking.date}`);

    doc.moveDown(0.4);

    doc.text(`🕒 Time : ${booking.time}`);

    doc.moveDown(0.4);

    doc.text(`💺 Seats : ${booking.seats}`);

    doc.moveDown(0.4);

    doc.text(`💵 Amount : $${booking.amount}`);

    doc.moveDown(0.4);

    doc.text(`🆔 Booking ID : ${bookingNumber}`);

    doc.moveDown();

    // ===========================
    // PAYMENT STATUS
    // ===========================

    doc
      .fontSize(16)
      .fillColor("green")
      .text("✅ PAYMENT SUCCESSFUL", {
        align: "center",
      });

    doc.moveDown(2);

    // ===========================
    // QR CODE
    // ===========================

    doc
      .fontSize(14)
      .fillColor("black")
      .text("Entry QR Code", {
        align: "center",
      });

    doc.moveDown();

    if (fs.existsSync(qrPath)) {
      const imageWidth = 160;
      const x =
        (doc.page.width - imageWidth) / 2;

      doc.image(qrPath, x, doc.y, {
        width: imageWidth,
      });

      doc.moveDown(9);

      doc
        .fontSize(11)
        .fillColor("gray")
        .text(
          "Scan this QR at the theatre entrance",
          {
            align: "center",
          }
        );
    }

    doc.moveDown(2);

    // ===========================
    // FOOTER LINE
    // ===========================

    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor("#d1d5db")
      .stroke();

    doc.moveDown();

    doc
      .fontSize(11)
      .fillColor("gray")
      .text(
        "Thank you for booking with QuickTicket!",
        {
          align: "center",
        }
      );

    doc
      .fontSize(14)
      .fillColor("#16a34a")
      .text("Enjoy your movie 🍿", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(10)
      .fillColor("gray")
      .text("support@quickticket.com", {
        align: "center",
      });

    doc.text("www.quickticket.com", {
      align: "center",
    });

    doc.end();

    stream.on("finish", () => {
      resolve(ticketPath);
    });

    stream.on("error", reject);
  });
};