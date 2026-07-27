import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import generateQRCode from "./generateQR.js";

export const generateTicket = (booking) => {
    return new Promise(async(resolve, reject) => {
        // Create tickets folder if it doesn't exist
        const ticketDir = path.join(process.cwd(), "tickets");

        if (!fs.existsSync(ticketDir)) {
            fs.mkdirSync(ticketDir);
        }
        const qrPath = await generateQRCode(booking);

        const ticketPath = path.join(
            ticketDir,
            `ticket-${booking.id}.pdf`
        );
        console.log(ticketPath);

        const doc = new PDFDocument({
            margin: 40,
            size: "A4",
        });

        const stream = fs.createWriteStream(ticketPath);

        doc.pipe(stream);

        // Header
        doc
            .fontSize(24)
            .fillColor("#2563eb")
            .text("🎬 QUICKTICKET", {
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

        doc.fontSize(14);

        doc.text(`Booking ID : ${booking.id}`);
        doc.moveDown();
        doc.moveDown(2);

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

        doc.text(`Movie      : ${booking.movie}`);
        doc.moveDown();

        doc.text(`Date       : ${booking.date}`);
        doc.moveDown();

        doc.text(`Time       : ${booking.time}`);
        doc.moveDown();

        doc.text(`Seats      : ${booking.seats}`);
        doc.moveDown();

        doc.text(`Amount     : $${booking.amount}`);
        doc.moveDown();

        doc.text(`Status     : PAID`);

        doc.moveDown(2);

        doc
            .fontSize(12)
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

