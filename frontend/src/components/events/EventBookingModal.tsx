import React, { useState, useRef, useEffect, useMemo } from 'react';
import { audioManager } from '@/audio/audioManager';
import { generateOfficialGovtTicketPdf, TicketDetails } from '@/utils/ticketPdfGenerator';

interface EventBookingModalProps {
  event: any;
  onClose: () => void;
}

// -------------------------------------------------------------
// iPhone Slide-to-Confirm Component (Smooth Mouse & Touch Drag)
// -------------------------------------------------------------
function IPhoneSlideToConfirm({
  onConfirm,
  label = 'Slide to Get Free Pass',
  labelKn = 'ಉಚಿತ ಪಾಸ್ ಪಡೆಯಲು ಸ್ಲೈಡ್ ಮಾಡಿ',
}: {
  onConfirm: () => void;
  label?: string;
  labelKn?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const [isDragging, setIsDragging] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleStart = () => {
    if (isConfirmed) return;
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || isConfirmed || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const knobWidth = 52;
    const maxDrag = rect.width - knobWidth;
    const currentX = clientX - rect.left - knobWidth / 2;
    const progress = Math.max(0, Math.min(1, currentX / maxDrag));
    setDragProgress(progress);

    if (progress >= 0.88) {
      setIsConfirmed(true);
      setIsDragging(false);
      setDragProgress(1);
      audioManager.playRoyalFanfare();
      onConfirm();
    }
  };

  const handleEnd = () => {
    if (!isDragging || isConfirmed) return;
    setIsDragging(false);
    if (dragProgress < 0.88) {
      setDragProgress(0); // Spring back smoothly
    }
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const onTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, dragProgress, isConfirmed]);

  const knobLeftPx = trackRef.current
    ? dragProgress * (trackRef.current.clientWidth - 52)
    : 0;

  return (
    <div className="w-full flex flex-col items-center gap-1.5 select-none">
      <div
        ref={trackRef}
        className={`w-full h-14 rounded-full border-2 relative overflow-hidden transition-colors flex items-center shadow-inner cursor-pointer ${
          isConfirmed
            ? 'bg-emerald-600/40 border-emerald-400'
            : 'bg-black/60 border-amber-400/50 hover:border-amber-400'
        }`}
      >
        {/* Progress fill following the knob */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-500/40 via-emerald-500/50 to-emerald-400/80 transition-all pointer-events-none rounded-full"
          style={{ width: `${Math.max(52, knobLeftPx + 52)}px` }}
        />

        {/* Shimmering Center Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-center px-12">
          {isConfirmed ? (
            <span className="text-emerald-300 font-extrabold text-xs tracking-wider flex items-center gap-1.5 animate-pulse">
              <span>✓</span>
              <span>FREE PASS CONFIRMED!</span>
            </span>
          ) : (
            <div className="flex flex-col items-center leading-none">
              <span className="text-[11px] md:text-xs font-black tracking-wider text-amber-200/90 uppercase flex items-center gap-1">
                <span>{label}</span>
                <span className="text-amber-400 animate-pulse">&gt;&gt;&gt;</span>
              </span>
              {labelKn && (
                <span className="text-[10px] text-amber-300/70 font-kannada mt-0.5">
                  {labelKn}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Draggable iPhone Knob */}
        <div
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          className={`w-[48px] h-[48px] m-0.5 rounded-full shadow-royal flex items-center justify-center cursor-grab active:cursor-grabbing z-10 transition-transform ${
            isConfirmed
              ? 'bg-emerald-400 text-black shadow-gold-glow scale-105'
              : 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-black hover:scale-105'
          }`}
          style={{
            transform: `translateX(${knobLeftPx}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          }}
        >
          {isConfirmed ? (
            <span className="text-lg font-black">✓</span>
          ) : (
            <span className="text-base font-black animate-pulse">➔</span>
          )}
        </div>
      </div>
      <p className="text-[10px] text-cream/50 text-center">
        {isConfirmed
          ? '🎉 Pass issued successfully! Click download below.'
          : 'Drag the golden slider to the right to verify and issue your pass.'}
      </p>
    </div>
  );
}

export default function EventBookingModal({ event, onClose }: EventBookingModalProps) {
  // Attendee Form State
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeMobile, setAttendeeMobile] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState(1);

  // Payment Options for Paid Events
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('qr');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('sbi');

  // Booking Flow Steps: 'details' -> 'processing' -> 'confirmed'
  const [bookingStep, setBookingStep] = useState<'details' | 'processing' | 'confirmed'>('details');
  const [confirmedTicket, setConfirmedTicket] = useState<TicketDetails | null>(null);

  const isFree = event.is_free || !event.ticket_price || parseFloat(event.ticket_price) === 0;
  const unitPrice = isFree ? 0 : parseFloat(event.ticket_price);
  const totalAmount = unitPrice * ticketQuantity;

  // Determine Gate assignment based on venue
  const assignedGate = useMemo(() => {
    const v = (event.venue_name || '').toLowerCase();
    if (v.includes('palace')) return 'Gate 3 (Balarama Gate Main Entry)';
    if (v.includes('chamundi')) return 'Gate 1 (Temple Gopuram Queue)';
    if (v.includes('bannimantap')) return 'Gate 5 (Torchlight Public Enclosure)';
    if (v.includes('exhibition')) return 'Gate 2 (South Exhibition Plaza)';
    if (v.includes('kuppanna')) return 'Gate 1 (Glass House East Entry)';
    return 'Main Public Entry Gate';
  }, [event.venue_name]);

  // Execute Confirmation & Generate Ticket Details
  const executeBooking = (methodDesc: string) => {
    if (!attendeeName.trim()) {
      alert('Please enter Primary Attendee Name');
      return;
    }
    if (!attendeeMobile.trim() || attendeeMobile.length < 10) {
      alert('Please enter a valid 10-digit Mobile Number for SMS verification');
      return;
    }

    setBookingStep('processing');
    audioManager.playBellSound();

    setTimeout(() => {
      const bookingId = `KSRTC-MD26-${Math.floor(100000 + Math.random() * 900000)}`;
      const startDate = new Date(event.start_datetime);
      const repDate = new Date(startDate.getTime() - 30 * 60 * 1000); // 30 mins prior

      const details: TicketDetails = {
        bookingId,
        eventTitle: event.title,
        eventTitleKn: event.title_kn,
        venueName: event.venue_name || 'Mysuru Venue',
        venueAddress: event.address || 'Mysuru, Karnataka',
        gateNumber: assignedGate,
        dateTime: `${startDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })} at ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        reportingTime: `${repDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })} IST (Gates close strictly 30 mins prior)`,
        attendeeName: attendeeName.trim(),
        attendeeMobile: attendeeMobile.trim(),
        attendeeEmail: attendeeEmail.trim() || `${attendeeMobile.trim()}@dasaratourist.in`,
        ticketQuantity,
        totalAmount,
        isFree,
        paymentMethod: isFree ? 'Govt Free Invitation Pass' : methodDesc,
        category: isFree ? 'Official Free Public Entry' : 'Reserved Seat Enclosure',
      };

      setConfirmedTicket(details);
      setBookingStep('confirmed');
      audioManager.playRoyalFanfare();
    }, 1200);
  };

  const handleDownloadPdf = () => {
    if (confirmedTicket) {
      audioManager.playBellSound();
      generateOfficialGovtTicketPdf(confirmedTicket);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-4 overflow-y-auto animate-fade-in">
      <div className="glass-dark border-2 border-amber-400/60 rounded-3xl max-w-xl w-full shadow-royal overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* 1. Modal Official Header */}
        <div className="bg-gradient-to-r from-red-950 via-amber-950 to-red-950 p-4 border-b border-amber-400/40 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <div>
              <span className="text-[10px] text-amber-300 uppercase tracking-widest font-black block">
                GOVERNMENT OF KARNATAKA • ಅಧಿಕೃತ ಇ-ಟಿಕೆಟ್
              </span>
              <h4 className="text-sm md:text-base font-extrabold text-cream leading-tight">
                Official Entry Pass & Ticket Portal
              </h4>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* ======================================================== */}
          {/* STEP 1: FILL DETAILS & SELECT PAYMENT / SLIDE           */}
          {/* ======================================================== */}
          {bookingStep === 'details' && (
            <>
              {/* Event Badge & Summary Box */}
              <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {event.category}
                  </span>
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-md ${
                      isFree
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : 'bg-amber-400 text-black font-extrabold'
                    }`}
                  >
                    {isFree ? 'FREE PUBLIC PASS' : `₹${unitPrice.toFixed(2)} / Person`}
                  </span>
                </div>

                <h3 className="text-base font-bold text-cream">{event.title}</h3>
                {event.title_kn && (
                  <p className="text-xs text-amber-300/90 font-kannada">{event.title_kn}</p>
                )}

                <div className="grid grid-cols-2 gap-2 text-[11px] text-cream/70 pt-1 border-t border-white/10">
                  <div>📍 {event.venue_name}</div>
                  <div>🚪 {assignedGate}</div>
                  <div>
                    🗓️{' '}
                    {new Date(event.start_datetime).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      weekday: 'short',
                    })}
                  </div>
                  <div>
                    ⏰{' '}
                    {new Date(event.start_datetime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    IST
                  </div>
                </div>
              </div>

              {/* Attendee Info Form */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>👤</span>
                    <span>Primary Passholder Details</span>
                  </h5>
                  <span className="text-[10px] text-cream/50">*Govt Photo ID required at gate</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-cream/80 mb-1 font-semibold">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Suresh Kumar"
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-cream text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-cream/80 mb-1 font-semibold">
                      Mobile Number (for SMS Pass) *
                    </label>
                    <div className="flex">
                      <span className="px-2.5 py-2 rounded-l-xl bg-white/10 border border-r-0 border-white/20 text-xs text-cream/60">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={attendeeMobile}
                        onChange={(e) => setAttendeeMobile(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 rounded-r-xl bg-black/50 border border-white/20 text-cream text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-cream/80 mb-1 font-semibold">
                      Email Address (for PDF Delivery)
                    </label>
                    <input
                      type="email"
                      placeholder="suresh@gmail.com"
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-cream text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-cream/80 mb-1 font-semibold">
                      Number of Passes
                    </label>
                    <div className="flex items-center rounded-xl bg-black/50 border border-white/20 p-0.5">
                      <button
                        onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                        className="w-8 py-1.5 text-xs text-cream/80 hover:text-white font-bold"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center text-xs font-black text-amber-300">
                        {ticketQuantity}
                      </span>
                      <button
                        onClick={() => setTicketQuantity(Math.min(6, ticketQuantity + 1))}
                        className="w-8 py-1.5 text-xs text-cream/80 hover:text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* CASE A: FREE EVENT -> iPHONE SLIDE TO CONFIRM            */}
              {/* ======================================================== */}
              {isFree ? (
                <div className="pt-2 border-t border-white/10 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-cream/70">Total Payable:</span>
                    <span className="text-emerald-400 font-extrabold text-sm">
                      ₹0.00 (Official Free Invitation)
                    </span>
                  </div>

                  {/* iPhone Style Slide to Confirm */}
                  <IPhoneSlideToConfirm
                    onConfirm={() => executeBooking('Govt Authorized Free Pass')}
                    label="Slide to Get Free Pass"
                    labelKn="ಉಚಿತ ಪಾಸ್ ಪಡೆಯಲು ಸ್ಲೈಡ್ ಮಾಡಿ"
                  />
                </div>
              ) : (
                /* ======================================================== */
                /* CASE B: PAID EVENT -> PAYMENT METHODS                    */
                /* ======================================================== */
                <div className="pt-2 border-t border-white/10 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                      <span>💳</span>
                      <span>Select Payment Gateway</span>
                    </h5>
                    <div className="text-right">
                      <span className="text-xs font-black text-amber-300">
                        Total: ₹{totalAmount.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-cream/50 block">
                        ({ticketQuantity} x ₹{unitPrice.toFixed(2)})
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Selector Tabs */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'upi', label: 'UPI / QR', icon: '📱' },
                      { id: 'card', label: 'Card', icon: '💳' },
                      { id: 'netbanking', label: 'NetBanking', icon: '🏛️' },
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                          paymentMethod === pm.id
                            ? 'bg-amber-400 text-black border-amber-300 shadow-gold-glow'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <span>{pm.icon}</span>
                        <span>{pm.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tab 1: UPI Options */}
                  {paymentMethod === 'upi' && (
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/15 space-y-3">
                      <div className="flex gap-2">
                        {[
                          { id: 'qr', label: 'Scan QR' },
                          { id: 'gpay', label: 'GPay' },
                          { id: 'phonepe', label: 'PhonePe' },
                          { id: 'paytm', label: 'Paytm' },
                        ].map((app) => (
                          <button
                            key={app.id}
                            onClick={() => setUpiApp(app.id as any)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                              upiApp === app.id
                                ? 'bg-amber-400/20 text-amber-300 border-amber-400'
                                : 'bg-white/5 border-white/10 text-white/60'
                            }`}
                          >
                            {app.label}
                          </button>
                        ))}
                      </div>

                      {upiApp === 'qr' ? (
                        <div className="flex flex-col items-center gap-2 p-2 bg-white rounded-xl">
                          {/* Live Authentic UPI QR Simulation */}
                          <div className="w-36 h-36 bg-white p-2 rounded-lg flex items-center justify-center border-2 border-black/80">
                            <div className="w-full h-full bg-black/90 p-1 flex items-center justify-center text-white text-[10px] text-center font-mono rounded">
                              [UPI QR CODE]
                              <br />
                              mysoredasara2026@sbi
                              <br />₹{totalAmount.toFixed(2)}
                            </div>
                          </div>
                          <span className="text-[10px] text-black/80 font-bold">
                            Scan with GPay / PhonePe / Paytm / BHIM
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="block text-[11px] text-cream/70">
                            Enter your {upiApp.toUpperCase()} VPA ID
                          </label>
                          <input
                            type="text"
                            placeholder="yourname@okhdfcbank"
                            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-cream text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 2: Credit/Debit Card */}
                  {paymentMethod === 'card' && (
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/15 space-y-2.5">
                      <div>
                        <label className="block text-[10px] text-cream/70 mb-1">
                          Card Number (Visa / MasterCard / RuPay)
                        </label>
                        <input
                          type="text"
                          maxLength={19}
                          placeholder="4532 •••• •••• 8842"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-cream text-xs focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-cream/70 mb-1">MM/YY</label>
                          <input
                            type="text"
                            maxLength={5}
                            placeholder="12/28"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-cream text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-cream/70 mb-1">CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="•••"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-cream text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: NetBanking */}
                  {paymentMethod === 'netbanking' && (
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/15 space-y-2">
                      <label className="block text-[10px] text-cream/70">Select Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-cream text-xs focus:outline-none focus:border-amber-400"
                      >
                        <option value="sbi">State Bank of India (Official Dasara Banker)</option>
                        <option value="canara">Canara Bank</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="karnataka">Karnataka Bank Ltd</option>
                      </select>
                    </div>
                  )}

                  {/* Pay Button */}
                  <button
                    onClick={() =>
                      executeBooking(
                        paymentMethod === 'upi'
                          ? `UPI Instant Pay (${upiApp.toUpperCase()})`
                          : paymentMethod === 'card'
                          ? 'Debit/Credit Card'
                          : `NetBanking (${selectedBank.toUpperCase()})`
                      )
                    }
                    className="w-full py-3 rounded-2xl bg-amber-400 text-black font-extrabold text-xs hover:bg-amber-300 transition-all shadow-gold-glow flex items-center justify-center gap-2"
                  >
                    <span>🔒</span>
                    <span>Pay ₹{totalAmount.toFixed(2)} & Generate Official Govt Pass</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* ======================================================== */}
          {/* STEP 2: PROCESSING ANIMATION                             */}
          {/* ======================================================== */}
          {bookingStep === 'processing' && (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <h4 className="text-lg font-bold text-cream">Contacting Government Payment Gateway...</h4>
              <p className="text-xs text-cream/60 max-w-sm mx-auto">
                Verifying attendee credentials with Mysuru District Administration and issuing digital QR code.
              </p>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: TICKET CONFIRMED & OFFICIAL PDF DOWNLOAD         */}
          {/* ======================================================== */}
          {bookingStep === 'confirmed' && confirmedTicket && (
            <div className="space-y-4 animate-fade-in">
              {/* Success Badge */}
              <div className="p-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-center space-y-1 shadow-gold-glow">
                <span className="text-3xl block">🎉</span>
                <span className="text-[10px] text-emerald-300 font-black uppercase tracking-widest block">
                  GOVERNMENT OF KARNATAKA CONFIRMATION
                </span>
                <h3 className="text-lg font-black text-cream">Official E-Ticket Issued Successfully!</h3>
                <p className="text-xs text-emerald-200">
                  Booking Reference: <span className="font-mono font-bold">{confirmedTicket.bookingId}</span>
                </p>
              </div>

              {/* Digital E-Pass Preview Card */}
              <div className="p-4 rounded-2xl bg-black/60 border border-amber-400/40 space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase block">
                      OFFICIAL DASARA PASS
                    </span>
                    <h4 className="font-bold text-sm text-cream">{confirmedTicket.eventTitle}</h4>
                    <p className="text-xs text-cream/70 font-semibold mt-0.5">
                      Gate: <span className="text-amber-300">{confirmedTicket.gateNumber}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-amber-300">
                      {confirmedTicket.isFree ? 'FREE' : `₹${confirmedTicket.totalAmount}`}
                    </span>
                    <span className="text-[10px] text-cream/60 block">
                      {confirmedTicket.ticketQuantity} Person(s)
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-cream/80 space-y-1">
                  <div className="flex justify-between">
                    <span>Attendee:</span>
                    <span className="font-bold text-cream">{confirmedTicket.attendeeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile:</span>
                    <span>+91 {confirmedTicket.attendeeMobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reporting Time:</span>
                    <span className="text-amber-200 font-semibold">{confirmedTicket.reportingTime}</span>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-[10px] text-amber-200/90 leading-relaxed">
                  ⚠️ <strong>Mandatory Checklist:</strong> Carry valid Govt Photo ID (Aadhaar / Voter ID). Entry gates close 30 minutes prior to event start. Free KSRTC EV feeder shuttles available at parking hubs.
                </div>
              </div>

              {/* Primary Action: Download Government PDF Ticket */}
              <button
                onClick={handleDownloadPdf}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 text-black font-black text-xs md:text-sm hover:brightness-110 transition-all shadow-royal flex items-center justify-center gap-2"
              >
                <span>📥</span>
                <span>Download Official Govt of Karnataka PDF Ticket</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-cream text-xs font-semibold transition-all"
              >
                Done / Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
