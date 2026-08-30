// ============================================
// DE TRAVELS - Booking JavaScript
// ============================================

// ---------- BOOKING STATE ----------
const BookingState = {
    step: 1,
    search: {
        from: '',
        to: '',
        date: ''
    },
    trip: null,
    seat: null,
    passenger: {
        name: '',
        phone: '',
        email: '',
        id: '',
        gender: ''
    },
    payment: {
        method: '',
        status: 'pending'
    },
    bookingId: null
};

// ---------- SEAT LAYOUT CONFIG ----------
const SEAT_CONFIG = {
    rows: 10,
    cols: 4, // A, B, C, D
    leftCols: ['A', 'B'],
    rightCols: ['C', 'D'],
    driverPos: 'front-left',
    toiletPos: 'front-right'
};

// ---------- SEAT DATA (Mock) ----------
function getSeatData() {
    // Simulate booked seats (for demo purposes)
    const bookedSeats = ['A3', 'B5', 'C7', 'D2', 'A8', 'C4', 'B9', 'D10'];
    const seats = [];
    
    for (let row = 1; row <= SEAT_CONFIG.rows; row++) {
        for (const col of ['A', 'B', 'C', 'D']) {
            const seatId = `${col}${row}`;
            const isBooked = bookedSeats.includes(seatId);
            seats.push({
                id: seatId,
                row: row,
                col: col,
                side: ['A', 'B'].includes(col) ? 'left' : 'right',
                status: isBooked ? 'booked' : 'available',
                label: seatId
            });
        }
    }
    return seats;
}

// ---------- RENDER SEAT MAP ----------
function renderSeatMap(containerId, selectedSeat = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const seats = getSeatData();
    const leftSeats = seats.filter(s => s.side === 'left');
    const rightSeats = seats.filter(s => s.side === 'right');
    
    let html = `
        <div class="seat-map">
            <div class="seat-map-header">
                <div class="seat-legend">
                    <span><span class="seat-dot available"></span> Available</span>
                    <span><span class="seat-dot selected"></span> Selected</span>
                    <span><span class="seat-dot booked"></span> Booked</span>
                </div>
                <div class="bus-info">
                    <span><i class="fas fa-bus"></i> Yutong Bus</span>
                    <span><i class="fas fa-user"></i> 40 Seats</span>
                </div>
            </div>
            <div class="bus-layout">
                <!-- Driver & Toilet -->
                <div class="bus-front">
                    <div class="driver-area">
                        <i class="fas fa-user-cog"></i>
                        <span>DRIVER</span>
                    </div>
                    <div class="toilet-area">
                        <i class="fas fa-restroom"></i>
                        <span>WC</span>
                    </div>
                </div>
                
                <!-- Seats -->
                <div class="seat-grid">
                    <div class="seat-column left-seats">
                        ${leftSeats.map(seat => `
                            <div class="seat-item ${seat.status} ${selectedSeat === seat.id ? 'selected' : ''}" 
                                 data-seat="${seat.id}"
                                 onclick="selectSeat('${seat.id}')">
                                <i class="fas fa-chair"></i>
                                <span>${seat.id}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="corridor">
                        <div class="corridor-line"></div>
                        <span class="corridor-label"><i class="fas fa-arrows-left-right"></i></span>
                    </div>
                    <div class="seat-column right-seats">
                        ${rightSeats.map(seat => `
                            <div class="seat-item ${seat.status} ${selectedSeat === seat.id ? 'selected' : ''}" 
                                 data-seat="${seat.id}"
                                 onclick="selectSeat('${seat.id}')">
                                <i class="fas fa-chair"></i>
                                <span>${seat.id}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Door -->
                <div class="bus-door">
                    <i class="fas fa-door-open"></i>
                    <span>DOOR</span>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// ---------- SELECT SEAT ----------
function selectSeat(seatId) {
    const seats = getSeatData();
    const seat = seats.find(s => s.id === seatId);
    
    if (!seat || seat.status === 'booked') {
        DETravels.showToast('This seat is already booked!', 'error');
        return;
    }
    
    // Update state
    BookingState.seat = seatId;
    
    // Re-render with selected seat
    renderSeatMap('seatMapContainer', seatId);
    
    // Update step
    updateStepDisplay(4);
    
    // Enable continue button
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        continueBtn.disabled = false;
        continueBtn.style.opacity = '1';
    }
    
    DETravels.showToast(`Seat ${seatId} selected successfully!`, 'success');
}

// ---------- BOOKING FLOW STEPS ----------
function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show target step
    const target = document.getElementById(`step${step}`);
    if (target) {
        target.style.display = 'block';
    }
    
    // Update progress
    updateProgress(step);
    
    // Update state
    BookingState.step = step;
}

function updateProgress(step) {
    document.querySelectorAll('.step-indicator').forEach((el, index) => {
        const num = index + 1;
        el.classList.remove('active', 'completed');
        if (num < step) {
            el.classList.add('completed');
        } else if (num === step) {
            el.classList.add('active');
        }
    });
}

function updateStepDisplay(step) {
    // Update progress indicator
    updateProgress(step);
    
    // Scroll to top of booking section
    const bookingSection = document.querySelector('.booking-flow');
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ---------- SEARCH TRIPS ----------
function searchTrips(event) {
    event.preventDefault();
    
    const from = document.getElementById('searchFrom').value;
    const to = document.getElementById('searchTo').value;
    const date = document.getElementById('searchDate').value;
    
    if (!from || !to || !date) {
        DETravels.showToast('Please fill all search fields', 'error');
        return;
    }
    
    // Update state
    BookingState.search = { from, to, date };
    
    // Show trips (Step 2)
    showStep(2);
    showAvailableTrips(from, to, date);
}

// ---------- SHOW AVAILABLE TRIPS ----------
function showAvailableTrips(from, to, date) {
    const container = document.getElementById('tripList');
    if (!container) return;
    
    // Mock trips
    const trips = [
        { id: 1, bus: 'T23 ABC', class: 'Executive', departure: '06:00', arrival: '16:00', duration: '10h', fare: 45000 },
        { id: 2, bus: 'T45 DEF', class: 'Business', departure: '08:30', arrival: '18:30', duration: '10h', fare: 35000 },
        { id: 3, bus: 'T67 GHI', class: 'Economy', departure: '14:00', arrival: '00:00', duration: '10h', fare: 25000 },
        { id: 4, bus: 'T89 JKL', class: 'Executive', departure: '20:00', arrival: '06:00', duration: '10h', fare: 45000 }
    ];
    
    let html = `
        <div class="trip-results-header">
            <h3><i class="fas fa-route"></i> ${from} → ${to}</h3>
            <p><i class="fas fa-calendar"></i> ${date}</p>
        </div>
        <div class="trip-list">
    `;
    
    trips.forEach(trip => {
        html += `
            <div class="trip-card" onclick="selectTrip(${trip.id})">
                <div class="trip-info">
                    <div class="trip-bus">
                        <i class="fas fa-bus"></i>
                        <div>
                            <strong>${trip.bus}</strong>
                            <span class="trip-class">${trip.class}</span>
                        </div>
                    </div>
                    <div class="trip-times">
                        <div>
                            <span class="time">${trip.departure}</span>
                            <span class="label">Departure</span>
                        </div>
                        <div class="duration">
                            <i class="fas fa-arrow-right"></i>
                            <span>${trip.duration}</span>
                        </div>
                        <div>
                            <span class="time">${trip.arrival}</span>
                            <span class="label">Arrival</span>
                        </div>
                    </div>
                    <div class="trip-fare">
                        <span class="amount">TSh ${trip.fare.toLocaleString()}</span>
                        <span class="label">per seat</span>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm">Select Trip</button>
            </div>
        `;
    });
    
    html += `</div>`;
    container.innerHTML = html;
}

// ---------- SELECT TRIP ----------
function selectTrip(tripId) {
    const trips = [
        { id: 1, bus: 'T23 ABC', class: 'Executive', departure: '06:00', arrival: '16:00', duration: '10h', fare: 45000 },
        { id: 2, bus: 'T45 DEF', class: 'Business', departure: '08:30', arrival: '18:30', duration: '10h', fare: 35000 },
        { id: 3, bus: 'T67 GHI', class: 'Economy', departure: '14:00', arrival: '00:00', duration: '10h', fare: 25000 },
        { id: 4, bus: 'T89 JKL', class: 'Executive', departure: '20:00', arrival: '06:00', duration: '10h', fare: 45000 }
    ];
    
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    
    BookingState.trip = trip;
    
    // Show Step 3 - Seat Selection
    showStep(3);
    renderSeatMap('seatMapContainer');
    
    DETravels.showToast(`Trip ${trip.bus} selected!`, 'success');
}

// ---------- PASSENGER DETAILS ----------
function submitPassengerDetails(event) {
    event.preventDefault();
    
    const name = document.getElementById('passengerName').value.trim();
    const phone = document.getElementById('passengerPhone').value.trim();
    const email = document.getElementById('passengerEmail').value.trim();
    const id = document.getElementById('passengerId').value.trim();
    const gender = document.getElementById('passengerGender').value;
    
    // Validation
    if (!name || name.length < 2) {
        DETravels.showToast('Please enter full name', 'error');
        return;
    }
    
    if (!DETravels.validatePhone(phone)) {
        DETravels.showToast('Please enter valid phone number (+255XXXXXXXXX)', 'error');
        return;
    }
    
    if (!DETravels.validateEmail(email)) {
        DETravels.showToast('Please enter valid email address', 'error');
        return;
    }
    
    if (!gender) {
        DETravels.showToast('Please select gender', 'error');
        return;
    }
    
    // Update state
    BookingState.passenger = { name, phone, email, id, gender };
    
    // Update payment summary
    updatePaymentSummary();
    
    // Show Step 5 - Payment
    showStep(5);
}

// ---------- UPDATE PAYMENT SUMMARY ----------
function updatePaymentSummary() {
    const summaryContainer = document.getElementById('paymentSummary');
    if (!summaryContainer) return;
    
    const { trip, passenger, seat } = BookingState;
    const seatId = seat || 'Not selected';
    
    let html = `
        <div class="payment-summary">
            <h4>Booking Summary</h4>
            <div class="summary-item">
                <span>Route</span>
                <span><strong>${BookingState.search.from} → ${BookingState.search.to}</strong></span>
            </div>
            <div class="summary-item">
                <span>Date</span>
                <span><strong>${BookingState.search.date}</strong></span>
            </div>
            <div class="summary-item">
                <span>Bus</span>
                <span><strong>${trip ? trip.bus : '-'}</strong></span>
            </div>
            <div class="summary-item">
                <span>Seat</span>
                <span><strong>${seatId}</strong></span>
            </div>
            <div class="summary-item">
                <span>Passenger</span>
                <span><strong>${passenger.name}</strong></span>
            </div>
            <div class="summary-item total">
                <span>Total Amount</span>
                <span><strong>TSh ${trip ? trip.fare.toLocaleString() : '0'}</strong></span>
            </div>
        </div>
    `;
    
    summaryContainer.innerHTML = html;
}

// ---------- PAYMENT ----------
function processPayment(method) {
    if (!method) {
        DETravels.showToast('Please select payment method', 'error');
        return;
    }
    
    // Update state
    BookingState.payment.method = method;
    BookingState.payment.status = 'completed';
    
    // Generate booking ID
    BookingState.bookingId = DETravels.generateBookingId();
    
    // Save booking
    const booking = {
        id: BookingState.bookingId,
        ...BookingState.search,
        trip: BookingState.trip,
        seat: BookingState.seat,
        passenger: BookingState.passenger,
        payment: BookingState.payment,
        status: 'confirmed',
        bookedAt: new Date().toISOString()
    };
    
    DETravels.saveBooking(booking);
    
    // Show Step 6 - Confirmation
    showStep(6);
    showConfirmation(booking);
    
    DETravels.showToast('Booking confirmed successfully! 🎉', 'success');
}

// ---------- SHOW CONFIRMATION ----------
function showConfirmation(booking) {
    const container = document.getElementById('confirmationDetails');
    if (!container) return;
    
    const qrData = `DE${booking.id}|${booking.passenger.name}|${booking.seat}|${booking.trip.bus}`;
    
    let html = `
        <div class="confirmation-card">
            <div class="confirmation-header">
                <i class="fas fa-check-circle"></i>
                <h2>Booking Confirmed!</h2>
                <p>Your ticket has been booked successfully</p>
            </div>
            
            <div class="ticket-details">
                <div class="ticket-row">
                    <span>Booking ID</span>
                    <strong>${booking.id}</strong>
                </div>
                <div class="ticket-row">
                    <span>Route</span>
                    <strong>${booking.from} → ${booking.to}</strong>
                </div>
                <div class="ticket-row">
                    <span>Date</span>
                    <strong>${booking.date}</strong>
                </div>
                <div class="ticket-row">
                    <span>Bus</span>
                    <strong>${booking.trip.bus} (${booking.trip.class})</strong>
                </div>
                <div class="ticket-row">
                    <span>Seat</span>
                    <strong>${booking.seat}</strong>
                </div>
                <div class="ticket-row">
                    <span>Passenger</span>
                    <strong>${booking.passenger.name}</strong>
                </div>
                <div class="ticket-row">
                    <span>Amount Paid</span>
                    <strong>TSh ${booking.trip.fare.toLocaleString()}</strong>
                </div>
                <div class="ticket-row">
                    <span>Payment Method</span>
                    <strong>${booking.payment.method}</strong>
                </div>
            </div>
            
            <div class="qr-section">
                <h4>Scan to Verify</h4>
                <div class="qr-placeholder">
                    <i class="fas fa-qrcode"></i>
                    <span>${qrData}</span>
                </div>
                <p class="qr-hint">Show this QR code to the conductor</p>
            </div>
            
            <div class="confirmation-actions">
                <button class="btn btn-primary" onclick="window.print()">
                    <i class="fas fa-download"></i> Download Ticket
                </button>
                <a href="bookings.html" class="btn btn-secondary">
                    <i class="fas fa-list"></i> My Bookings
                </a>
                <a href="index.html" class="btn btn-secondary">
                    <i class="fas fa-home"></i> Home
                </a>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// ---------- INIT BOOKING PAGE ----------
document.addEventListener('DOMContentLoaded', function() {
    // Show Step 1 initially
    showStep(1);
    
    // Set minimum date
    const dateInput = document.getElementById('searchDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        dateInput.value = today;
    }
    
    // Search form
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', searchTrips);
    }
    
    // Passenger form
    const passengerForm = document.getElementById('passengerForm');
    if (passengerForm) {
        passengerForm.addEventListener('submit', submitPassengerDetails);
    }
    
    // Payment method buttons
    document.querySelectorAll('.payment-method-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const method = this.dataset.method;
            document.querySelectorAll('.payment-method-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // Enable pay button
            const payBtn = document.getElementById('payBtn');
            if (payBtn) {
                payBtn.disabled = false;
                payBtn.style.opacity = '1';
                payBtn.dataset.method = method;
            }
        });
    });
    
    // Pay button
    const payBtn = document.getElementById('payBtn');
    if (payBtn) {
        payBtn.addEventListener('click', function() {
            const method = this.dataset.method;
            processPayment(method);
        });
    }
});

// ---------- EXPOSE FUNCTIONS ----------
window.selectSeat = selectSeat;
window.selectTrip = selectTrip;
window.showStep = showStep;
window.updateStepDisplay = updateStepDisplay;
window.processPayment = processPayment;
window.BookingState = BookingState;