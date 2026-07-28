import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import generateQRCode from "./generateQR.js";

// ============================================================
// THEME — matches QuickTicket's ink-black + gold marquee identity
// ============================================================
const THEME = {
  bgDark: "#0b0b0f",       // ink black
  panel: "#141319",        // slightly lighter panel
  gold: "#d4af37",         // marquee gold
  goldSoft: "#f1d68f",
  curtain: "#7a1f2b",      // curtain red accent
  white: "#f5f5f0",
  grayText: "#9a978f",
  divider: "#2a2830",
  success: "#3ecf8e",
};

export const generateTicket = async (booking) => {
  const ticketDir = "/tmp";

  if (!fs.existsSync(ticketDir)) {
    fs.mkdirSync(ticketDir, { recursive: true });
  }

  const qrPath = await generateQRCode(booking);

  const ticketPath = path.join(ticketDir, `ticket-${booking.id}.pdf`);

  // Correct relative path from backend root: backend/assets/favicon.svg
  const logoPath = path.join(process.cwd(), "assets", "favicon.svg");

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 0, // full control over layout ourselves
    });

    const stream = fs.createWriteStream(ticketPath);
    doc.pipe(stream);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const marginX = 50;
    const contentWidth = pageWidth - marginX * 2;

    // ============================================================
    // FULL PAGE BACKGROUND — ink black
    // ============================================================
    doc.rect(0, 0, pageWidth, pageHeight).fill(THEME.bgDark);

    // ============================================================
    // HEADER BAND (curtain-red gradient feel via layered rects)
    // ============================================================
    const headerHeight = 150;
    doc.rect(0, 0, pageWidth, headerHeight).fill(THEME.panel);
    doc
      .rect(0, headerHeight - 4, pageWidth, 4)
      .fill(THEME.gold);

    // Logo (top-left of header, small)
    if (fs.existsSync(logoPath)) {
      try {
        doc.image(logoPath, marginX, 32, { width: 46, height: 46 });
      } catch (e) {
        // SVG rendering can fail silently in some pdfkit setups — skip gracefully
      }
    }

    // Brand wordmark
    doc
      .font("Helvetica-Bold")
      .fontSize(30)
      .fillColor(THEME.gold)
      .text("QUICKTICKET", marginX + 60, 38, { characterSpacing: 1.5 });

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor(THEME.grayText)
      .text("YOUR NIGHT AT THE MOVIES", marginX + 60, 74, {
        characterSpacing: 2,
      });

    // Booking number, top-right
    const bookingNumber = `QT-${booking.id.slice(-8).toUpperCase()}`;
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(THEME.grayText)
      .text("BOOKING ID", 0, 40, {
        width: pageWidth - marginX,
        align: "right",
        characterSpacing: 1,
      });
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor(THEME.white)
      .text(bookingNumber, 0, 55, {
        width: pageWidth - marginX,
        align: "right",
      });

    // Payment status pill, top-right below booking id
    const pillLabel = "PAYMENT SUCCESSFUL";
    doc.font("Helvetica-Bold").fontSize(9);
    const pillTextWidth = doc.widthOfString(pillLabel, { characterSpacing: 1 });
    const pillWidth = pillTextWidth + 28;
    const pillHeight = 22;
    const pillX = pageWidth - marginX - pillWidth;
    const pillY = 90;
    doc
      .roundedRect(pillX, pillY, pillWidth, pillHeight, 11)
      .fill(THEME.success);
    doc
      .fillColor("#08130d")
      .text(pillLabel, pillX, pillY + 6.5, {
        width: pillWidth,
        align: "center",
        characterSpacing: 1,
      });

    // ============================================================
    // MOVIE TITLE BLOCK
    // ============================================================
    let cursorY = headerHeight + 34;

    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .fillColor(THEME.white)
      .text(booking.movie, marginX, cursorY, { width: contentWidth });

    cursorY = doc.y + 6;

    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor(THEME.goldSoft)
      .text("QuickTicket Cinema  •  Screen 2", marginX, cursorY);

    cursorY = doc.y + 24;

    // ============================================================
    // TICKET STUB PANEL
    // ============================================================
    const stubTop = cursorY;
    const stubHeight = 230;
    const stubBottom = stubTop + stubHeight;
    const perforationX = marginX + contentWidth * 0.68;

    // Panel background
    doc
      .roundedRect(marginX, stubTop, contentWidth, stubHeight, 10)
      .fill(THEME.panel);

    // Perforation notches (top & bottom circles cut into bg color)
    doc.fillColor(THEME.bgDark);
    doc.circle(perforationX, stubTop, 10).fill();
    doc.circle(perforationX, stubBottom, 10).fill();

    // Dashed vertical divider between details and QR
    doc
      .save()
      .dash(4, { space: 4 })
      .strokeColor(THEME.divider)
      .lineWidth(1)
      .moveTo(perforationX, stubTop + 16)
      .lineTo(perforationX, stubBottom - 16)
      .stroke()
      .undash()
      .restore();

    // ---- LEFT SIDE: Details grid (2 columns) ----
    const detailPadX = 28;
    const detailStartX = marginX + detailPadX;
    const detailColWidth = (perforationX - detailStartX - 20) / 2;
    const detailStartY = stubTop + 28;
    const rowGap = 52;

    const fields = [
      ["DATE", booking.date],
      ["TIME", booking.time],
      ["SEATS", booking.seats],
      ["AMOUNT", `$${booking.amount}`],
    ];

    fields.forEach(([label, value], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = detailStartX + col * (detailColWidth + 20);
      const y = detailStartY + row * rowGap;

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(THEME.grayText)
        .text(label, x, y, { characterSpacing: 1.2 });

      doc
        .font("Helvetica-Bold")
        .fontSize(15)
        .fillColor(THEME.white)
        .text(String(value), x, y + 13, { width: detailColWidth });
    });

    // Theatre line spanning full width at bottom of left side
    const theatreY = detailStartY + rowGap * 2 + 6;
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(THEME.grayText)
      .text("VENUE", detailStartX, theatreY, { characterSpacing: 1.2 });
    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .fillColor(THEME.white)
      .text("QuickTicket Cinema — Screen 2", detailStartX, theatreY + 13, {
        width: perforationX - detailStartX - 20,
      });

    // ---- RIGHT SIDE: QR code ----
    const qrAreaX = perforationX + 20;
    const qrAreaWidth = marginX + contentWidth - qrAreaX - 20;

    if (fs.existsSync(qrPath)) {
      const qrSize = Math.min(120, qrAreaWidth);
      const qrX = qrAreaX + (qrAreaWidth - qrSize) / 2;
      const qrY = stubTop + 24;

      // white backing card for scan contrast
      doc
        .roundedRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 6)
        .fill(THEME.white);

      doc.image(qrPath, qrX, qrY, { width: qrSize, height: qrSize });

      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(THEME.grayText)
        .text("SCAN AT ENTRANCE", qrAreaX, qrY + qrSize + 22, {
          width: qrAreaWidth,
          align: "center",
          characterSpacing: 1,
        });
    }

    // ============================================================
    // FOOTER
    // ============================================================
    doc
      .strokeColor(THEME.divider)
      .lineWidth(1)
      .moveTo(marginX, stubBottom + 40)
      .lineTo(pageWidth - marginX, stubBottom + 40)
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(THEME.grayText)
      .text(
        "This ticket is valid for a single entry. Please arrive 15 minutes before showtime.",
        marginX,
        stubBottom + 56,
        { width: contentWidth, align: "center" }
      );

    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .fillColor(THEME.gold)
      .text("Enjoy your movie!", marginX, stubBottom + 78, {
        width: contentWidth,
        align: "center",
      });

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(THEME.grayText)
      .text(
        "support@quickticket.com   •   www.quickticket.com",
        marginX,
        stubBottom + 100,
        { width: contentWidth, align: "center" }
      );

    doc.end();

    stream.on("finish", () => resolve(ticketPath));
    stream.on("error", reject);
  });
};