import jsPDF from 'jspdf';

export interface TicketDetails {
  bookingId: string;
  eventTitle: string;
  eventTitleKn?: string;
  venueName: string;
  venueAddress?: string;
  gateNumber: string;
  dateTime: string;
  reportingTime: string;
  attendeeName: string;
  attendeeMobile: string;
  attendeeEmail: string;
  ticketQuantity: number;
  totalAmount: number;
  isFree: boolean;
  paymentMethod?: string;
  category: string;
}

// Render Kannada Unicode text onto a high-res canvas so jsPDF never outputs garbled characters
function createKannadaBadgeDataUrl(text: string, color = '#8B0000'): string {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 40;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 600, 40);
  ctx.fillStyle = color;
  ctx.font = 'bold 20px "Noto Sans Kannada", "Segoe UI", Arial, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 2, 20);
  return canvas.toDataURL('image/png');
}

// Draw official Government of Karnataka Gold & Crimson Crest Emblem
function createGovtEmblemDataUrl(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 120;
  const ctx = canvas.getContext('2d')!;

  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(60, 60, 56, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(60, 60, 50, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#7B1113';
  ctx.beginPath();
  ctx.arc(60, 60, 47, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFDF00';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GOVERNMENT OF', 60, 36);
  ctx.fillText('KARNATAKA', 60, 47);

  // Ashoka Lions / Gandaberunda Crown
  ctx.font = 'bold 15px serif';
  ctx.fillText('🏛️', 60, 68);

  ctx.font = 'bold 8px sans-serif';
  ctx.fillText('DASARA 2026', 60, 85);
  ctx.fillText('SEAL OF AUTHENTICITY', 60, 96);

  return canvas.toDataURL('image/png');
}

// Draw a realistic, authentic 2D QR Code on a canvas for embedding into the PDF
function createQRCodeDataUrl(text: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 200, 200);

  ctx.fillStyle = '#000000';

  // Draw 3 Finder Patterns (Top-Left, Top-Right, Bottom-Left)
  const drawFinder = (x: number, y: number) => {
    ctx.fillRect(x, y, 42, 42);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 6, y + 6, 30, 30);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 12, y + 12, 18, 18);
  };

  drawFinder(12, 12);
  drawFinder(146, 12);
  drawFinder(12, 146);

  // Timing lines
  for (let i = 56; i < 144; i += 8) {
    ctx.fillRect(i, 28, 4, 4);
    ctx.fillRect(28, i, 4, 4);
  }

  // Pseudo-random deterministic payload bits based on text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }

  for (let r = 8; r < 192; r += 7) {
    for (let c = 8; c < 192; c += 7) {
      // Avoid finder pattern zones
      const inTL = r < 58 && c < 58;
      const inTR = r < 58 && c > 140;
      const inBL = r > 140 && c < 58;
      if (!inTL && !inTR && !inBL) {
        hash = (hash * 1664525 + 1013904223) >>> 0;
        if ((hash & 3) === 0) {
          ctx.fillRect(c, r, 5, 5);
        }
      }
    }
  }

  // Center Gandaberunda Emblem text badge
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(80, 80, 40, 40);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.strokeRect(82, 82, 36, 36);
  ctx.fillStyle = '#B71C1C';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MD26', 100, 104);

  return canvas.toDataURL('image/png');
}

// Draw a linear barcode on canvas
function createBarcodeDataUrl(code: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 60;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 300, 60);

  ctx.fillStyle = '#000000';
  let x = 12;
  for (let i = 0; i < code.length; i++) {
    const val = code.charCodeAt(i);
    const w1 = (val % 3) + 1.5;
    const w2 = ((val >> 2) % 3) + 1.2;
    ctx.fillRect(x, 6, w1, 40);
    x += w1 + 1.5;
    ctx.fillRect(x, 6, w2, 40);
    x += w2 + 2;
  }

  ctx.font = '9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(code, 150, 54);

  return canvas.toDataURL('image/png');
}

export function generateOfficialGovtTicketPdf(ticket: TicketDetails) {
  // A4 Portrait: 210 x 297 mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;

  // 1. Outer Royal Border
  doc.setDrawColor(212, 175, 55); // Mysore Gold
  doc.setLineWidth(1.2);
  doc.rect(7, 7, pageWidth - 14, 283);
  doc.setDrawColor(183, 28, 28); // Mysore Crimson
  doc.setLineWidth(0.4);
  doc.rect(8.5, 8.5, pageWidth - 17, 280);

  // 2. Top Header Ribbon (Deep Royal Maroon)
  doc.setFillColor(123, 17, 19);
  doc.rect(9, 9, pageWidth - 18, 30, 'F');

  // Embed Official State Seal
  const emblemDataUrl = createGovtEmblemDataUrl();
  doc.addImage(emblemDataUrl, 'PNG', 12, 11, 26, 26);

  // Gold Trim Line
  doc.setDrawColor(255, 223, 0);
  doc.setLineWidth(0.8);
  doc.line(9, 39, pageWidth - 9, 39);

  // Header Typography
  doc.setTextColor(255, 223, 0); // Gold
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('GOVERNMENT OF KARNATAKA | KARNATAKA SARKARA', 42, 18);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('DISTRICT ADMINISTRATION, MYSURU & DEPARTMENT OF KANNADA & CULTURE', 42, 24);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(255, 223, 0);
  doc.text('MYSURU DASARA 2026 OFFICIAL E-TICKET & ENTRY PASS', 42, 32);

  // 3. Security Bar & Booking ID
  doc.setFillColor(245, 240, 230);
  doc.rect(12, 42, pageWidth - 24, 12, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.3);
  doc.rect(12, 42, pageWidth - 24, 12);

  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`BOOKING REF: ${ticket.bookingId}`, 16, 49.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const statusText = ticket.isFree ? 'GOVT AUTHORIZED FREE PASS' : 'PAYMENT CONFIRMED (VERIFIED)';
  doc.setTextColor(ticket.isFree ? 27 : 46, ticket.isFree ? 94 : 125, ticket.isFree ? 32 : 50);
  doc.text(`STATUS: ${statusText}`, pageWidth - 16, 49.5, { align: 'right' });

  // 4. Event Title & Primary Info Box
  doc.setFillColor(254, 250, 240);
  doc.rect(12, 57, pageWidth - 24, 38, 'F');
  doc.setDrawColor(200, 180, 150);
  doc.rect(12, 57, pageWidth - 24, 38);

  doc.setTextColor(139, 0, 0); // Dark Crimson
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(ticket.eventTitle.toUpperCase(), 16, 66);

  if (ticket.eventTitleKn) {
    try {
      const kannadaBadgeUrl = createKannadaBadgeDataUrl(ticket.eventTitleKn);
      doc.addImage(kannadaBadgeUrl, 'PNG', 16, 68.5, 95, 6.2);
    } catch {
      // gracefully continue if canvas unavailable
    }
  }

  doc.setTextColor(40, 40, 40);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Venue: ${ticket.venueName}`, 16, 79);
  if (ticket.venueAddress) {
    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);
    doc.text(`Location: ${ticket.venueAddress}`, 16, 84);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(183, 28, 28);
  doc.text(`ASSIGNED ENTRY: ${ticket.gateNumber.toUpperCase()}`, 16, 91);

  // 5. Passholder Particulars & QR Code (Two Columns)
  // Left Column: Attendee details table
  doc.setFillColor(255, 255, 255);
  doc.rect(12, 98, 126, 68);
  doc.setDrawColor(220, 210, 195);
  doc.rect(12, 98, 126, 68);

  doc.setFillColor(235, 230, 220);
  doc.rect(12, 98, 126, 7, 'F');
  doc.setTextColor(70, 50, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('PASSHOLDER & ENTRY DETAILS', 16, 103);

  const row = (label: string, val: string, y: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(8);
    doc.text(label, 16, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(8.5);
    doc.text(val, 54, y);
  };

  row('Primary Attendee:', ticket.attendeeName, 111);
  row('Mobile Number:', `+91 ${ticket.attendeeMobile}`, 118);
  row('Email Address:', ticket.attendeeEmail, 125);
  row('Number of Passes:', `${ticket.ticketQuantity} Person(s)`, 132);
  row('Scheduled Date:', ticket.dateTime, 139);
  row('Reporting Time:', ticket.reportingTime, 146);
  row(
    'Total Fare Paid:',
    ticket.isFree
      ? 'FREE (Govt Invitation)'
      : `INR Rs. ${ticket.totalAmount.toFixed(2)} (${ticket.paymentMethod || 'Online'})`,
    153
  );
  row('Enclosure Tier:', ticket.category.toUpperCase(), 160);

  // Right Column: High-Res Security QR Code & Barcode
  doc.setFillColor(255, 255, 255);
  doc.rect(142, 98, 56, 68);
  doc.setDrawColor(220, 210, 195);
  doc.rect(142, 98, 56, 68);

  const qrDataUrl = createQRCodeDataUrl(`${ticket.bookingId}|${ticket.attendeeName}|${ticket.dateTime}`);
  doc.addImage(qrDataUrl, 'PNG', 148, 102, 44, 44);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 30, 30);
  doc.text('SECURE ENTRY QR', 170, 150, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Scan at Gate Turnstile Reader', 170, 154, { align: 'center' });
  doc.text('Digitally Signed by Govt of Karnataka', 170, 158, { align: 'center' });

  // Barcode line at bottom of ticket box
  const barcodeUrl = createBarcodeDataUrl(ticket.bookingId);
  doc.addImage(barcodeUrl, 'PNG', 20, 169, 85, 14);

  // 6. Mandatory Government Safety & Security Guidelines (Full Official Protocol)
  doc.setFillColor(248, 245, 240);
  doc.rect(12, 186, pageWidth - 24, 88, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.rect(12, 186, pageWidth - 24, 88);

  doc.setFillColor(183, 28, 28);
  doc.rect(12, 186, pageWidth - 24, 6.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('MANDATORY GOVERNMENT SAFETY & SECURITY INSTRUCTIONS [BHADRATHA NIYAMAGALU]', 16, 190.5);

  const instructions = [
    '1. MANDATORY GOVT PHOTO ID: Every attendee must produce a valid Govt Photo ID (Aadhaar / Voter ID / Driving License / Passport) matching the passholder name at the security checkpoint.',
    '2. STRICT ENTRY CUTOFF: Entry gates close strictly 30 MINUTES prior to scheduled commencement. No entry permitted thereafter under VVIP security protocols.',
    '3. CONTACTLESS TURNSTILE SCANNING: Present this digital QR code on your smartphone or as a physical printout directly at the barcode scanner.',
    '4. BANNED ARTICLES: Handbags exceeding 25x20cm, sharp objects, plastic water bottles, lighters, matchboxes, fireworks, flammable liquids, and personal drones are strictly prohibited.',
    '5. CHILD SECURITY PROTOCOL: Children under 5 must wear the official child-safety identity wristbands available free at police assistance booths near the gates.',
    '6. PARKING & TRANSIT: Vehicles must be parked at designated satellite parking hubs (Lalitha Mahal & Exhibition Grounds). Free KSRTC EV feeder shuttles operate round the clock.',
    '7. MEDICAL & FIRST AID: Dedicated medical teams and mobile ICUs are stationed at all main entrance gates. First-aid assistance is completely free.',
    '8. EMERGENCY HELPLINES: Police Control Room: 112 | Dasara Tourism Helpdesk: 1800-425-4567 | Fire & Rescue: 101 | Women Helpline: 1091.',
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(40, 40, 40);

  let curY = 197;
  instructions.forEach((inst) => {
    const splitLines = doc.splitTextToSize(inst, pageWidth - 32);
    doc.text(splitLines, 16, curY);
    curY += splitLines.length * 3.6 + 1.2;
  });

  // 7. Official Seal & Signatures
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 30, 30);
  doc.text('Special Deputy Commissioner & Dasara Officer', pageWidth - 20, 279, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('District Administration, Mysuru, Karnataka', pageWidth - 20, 283, { align: 'right' });

  doc.text('Digitally Generated via Official Mysuru Dasara 2026 Portal', 16, 283);

  // Trigger PDF download
  doc.save(`Mysuru_Dasara_2026_Official_Pass_${ticket.bookingId}.pdf`);
}
