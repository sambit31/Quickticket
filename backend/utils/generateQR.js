import QRCode from "qrcode";
import fs from "fs";
import path from "path";

const generateQRCode = async (booking) => {
  const qrFolder = path.join(process.cwd(), "tickets");

  if (!fs.existsSync(qrFolder)) {
    fs.mkdirSync(qrFolder);
  }

  const qrPath = path.join(
    qrFolder,
    `qr-${booking.id}.png`
  );

  await QRCode.toFile(
    qrPath,
    JSON.stringify({
      bookingId: booking.id,
      movie: booking.movie,
      seats: booking.seats,
      date: booking.date,
      time: booking.time,
    }),
    {
      width: 220,
    }
  );

  return qrPath;
};

export default generateQRCode;