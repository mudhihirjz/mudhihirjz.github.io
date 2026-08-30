// ============================================
// DE TRAVELS - My Bookings JavaScript
// ============================================

// ---------- RENDER BOOKINGS ----------
function renderBookings() {
    const container = document.getElementById('bookingsList');
    if (!container) return;
    
    const bookings = DETravels.getBookings();
    const filter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    
    let filteredBookings = bookings;
    if (filter === 'upcoming') {
        filteredBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
    } else if (filter === 'completed') {
        filteredBookings = bookings.filter(b => b.status === 'completed');
    } else if (filter === 'cancelled') {
        filteredBookings = bookings.filter(b => b.status === 'cancelled');
    }
    
    if (filteredBookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-ticket-alt"></i>
                <h3>No Bookings Found</h3>
                <p>You haven't made any bookings yet. Start your journey with DE TRAVELS!</p>
                <a href="book-ticket.html" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Book Now
                </a>
            </div>
        `;
        return;
    }
    
    let html = '';
    filteredBookings.forEach(booking => {
        const statusColor = booking.status === 'confirmed' ? '#2ECC71' : 
                           booking.status === 'completed' ? '#3498DB' : 
                           booking.status === 'cancelled' ? '#E74C3C' : '#F1C40F';
        const statusIcon = booking.status === 'confirmed' ? 'fa-check-circle' :
                          booking.status === 'completed' ? 'fa-check-double' :
                          booking.status === 'cancelled' ? 'fa-times-circle' : 'fa-clock';
        
        html += `
            <div class="booking-card">
                <div class="booking-header">
                    <div class="booking-id">
                        <i class="fas fa-ticket-alt"></i>
                        <strong>#${booking.id}</strong>
                    </div>
                    <div class="booking-status" style="color: ${statusColor};">
                        <i class="fas ${statusIcon}"></i>
                        ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                </div>
                
                <div class="booking-body">
                    <div class="booking-route">
                        <span class="from">${booking.from}</span>
                        <i class="fas fa-arrow-right"></i>
                        <span class="to">${booking.to}</span>
                    </div>
                    <div class="booking-meta">
                        <span><i class="fas fa-calendar"></i> ${booking.date}</span>
                        <span><i class="fas fa-bus"></i> ${booking.trip.bus}</span>
                        <span><i class="fas fa-chair"></i> Seat ${booking.seat}</span>
                        <span><i class="fas fa-user"></i> ${booking.passenger.name}</span>
                    </div>
                    <div class="booking-amount">
                        TSh ${booking.trip.fare.toLocaleString()}
                    </div>
                </div>
                
                <div class="booking-actions">
                    <button class="btn btn-sm btn-secondary" onclick="viewBooking('${booking.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="downloadTicket('${booking.id}')">
                        <i class="fas fa-download"></i> Download Ticket
                    </button>
                    ${booking.status === 'confirmed' ? `
                        <button class="btn btn-sm btn-danger" onclick="cancelBooking('${booking.id}')">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ---------- VIEW BOOKING DETAILS ----------
function viewBooking(bookingId) {
    const bookings = DETravels.getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) {
        DETravels.showToast('Booking not found', 'error');
        return;
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            <h2><i class="fas fa-ticket-alt"></i> Booking Details</h2>
            
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
                    <span>Departure</span>
                    <strong>${booking.trip.departure}</strong>
                </div>
                <div class="ticket-row">
                    <span>Arrival</span>
                    <strong>${booking.trip.arrival}</strong>
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
                    <span>Phone</span>
                    <strong>${booking.passenger.phone}</strong>
                </div>
                <div class="ticket-row">
                    <span>Email</span>
                    <strong>${booking.passenger.email}</strong>
                </div>
                <div class="ticket-row">
                    <span>Amount Paid</span>
                    <strong>TSh ${booking.trip.fare.toLocaleString()}</strong>
                </div>
                <div class="ticket-row">
                    <span>Payment Method</span>
                    <strong>${booking.payment.method}</strong>
                </div>
                <div class="ticket-row">
                    <span>Status</span>
                    <strong style="color: ${booking.status === 'confirmed' ? '#2ECC71' : '#E74C3C'}">
                        ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </strong>
                </div>
                <div class="ticket-row">
                    <span>Booked At</span>
                    <strong>${new Date(booking.bookedAt).toLocaleString()}</strong>
                </div>
            </div>
            
            <div class="qr-section">
                <h4>QR Code for Verification</h4>
                <div class="qr-placeholder">
                    <i class="fas fa-qrcode"></i>
                    <span>DE${booking.id}|${booking.passenger.name}|${booking.seat}|${booking.trip.bus}</span>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="downloadTicket('${booking.id}')">
                    <i class="fas fa-download"></i> Download Ticket
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles if not exists
    if (!document.querySelector('#modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .booking-modal {
                position: fixed;
                inset: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .modal-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0,0,0,0.5);
                backdrop-filter: blur(4px);
            }
            .modal-content {
                position: relative;
                background: var(--bg-card);
                border-radius: var(--radius-lg);
                padding: 40px;
                max-width: 600px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: var(--shadow-xl);
                z-index: 1;
                animation: fadeInUp 0.3s ease;
            }
            .modal-close {
                position: absolute;
                top: 16px;
                right: 20px;
                background: none;
                border: none;
                font-size: 28px;
                cursor: pointer;
                color: var(--text-secondary);
                transition: var(--transition);
            }
            .modal-close:hover {
                color: var(--text-primary);
                transform: rotate(90deg);
            }
            .modal-content h2 {
                margin-bottom: 20px;
                font-size: 24px;
            }
            .modal-content h2 i {
                color: var(--primary);
            }
            .modal-actions {
                display: flex;
                gap: 12px;
                margin-top: 20px;
                flex-wrap: wrap;
            }
            @media (max-width: 576px) {
                .modal-content {
                    padding: 24px;
                }
                .modal-actions .btn {
                    flex: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ---------- CLOSE MODAL ----------
function closeModal() {
    const modal = document.querySelector('.booking-modal');
    if (modal) {
        modal.remove();
    }
}

// ---------- DOWNLOAD TICKET ----------
function downloadTicket(bookingId) {
    const bookings = DETravels.getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) {
        DETravels.showToast('Booking not found', 'error');
        return;
    }
    
    // Create printable ticket HTML
    const ticketHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Ticket - ${booking.id}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: Arial, sans-serif; background: #f0f4f8; display: flex; justify-content: center; padding: 40px; }
                .ticket { max-width: 500px; width: 100%; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
                .ticket-header { text-align: center; border-bottom: 2px dashed #e2e8f0; padding-bottom: 16px; }
                .ticket-header h1 { color: #0F4C81; font-size: 28px; }
                .ticket-header p { color: #64748B; font-size: 14px; }
                .ticket-body { padding: 20px 0; }
                .ticket-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
                .ticket-row:last-child { border-bottom: none; }
                .ticket-row .label { color: #64748B; }
                .ticket-row .value { font-weight: 600; color: #0F172A; }
                .ticket-footer { text-align: center; border-top: 2px dashed #e2e8f0; padding-top: 16px; margin-top: 16px; }
                .qr-code { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 12px; background: #f8fafc; border-radius: 8px; margin: 12px 0; }
                .qr-code i { font-size: 48px; color: #0F4C81; }
                .qr-code span { font-size: 12px; color: #94A3B8; word-break: break-all; max-width: 200px; }
                .status { display: inline-block; padding: 4px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; }
                .status-confirmed { background: #d1fae5; color: #065f46; }
                @media print { body { padding: 0; background: white; } .ticket { box-shadow: none; border: 1px solid #e2e8f0; } }
            </style>
        </head>
        <body>
            <div class="ticket">
                <div class="ticket-header">
                    <h1>DE TRAVELS</h1>
                    <p>E-Ticket</p>
                </div>
                <div class="ticket-body">
                    <div class="ticket-row"><span class="label">Booking ID</span><span class="value">${booking.id}</span></div>
                    <div class="ticket-row"><span class="label">Route</span><span class="value">${booking.from} → ${booking.to}</span></div>
                    <div class="ticket-row"><span class="label">Date</span><span class="value">${booking.date}</span></div>
                    <div class="ticket-row"><span class="label">Bus</span><span class="value">${booking.trip.bus}</span></div>
                    <div class="ticket-row"><span class="label">Seat</span><span class="value">${booking.seat}</span></div>
                    <div class="ticket-row"><span class="label">Passenger</span><span class="value">${booking.passenger.name}</span></div>
                    <div class="ticket-row"><span class="label">Amount</span><span class="value">TSh ${booking.trip.fare.toLocaleString()}</span></div>
                    <div class="ticket-row"><span class="label">Status</span><span class="value"><span class="status status-confirmed">${booking.status}</span></span></div>
                </div>
                <div class="ticket-footer">
                    <div class="qr-code">
                        <i class="fas fa-qrcode"></i>
                        <span>DE${booking.id}|${booking.passenger.name}|${booking.seat}|${booking.trip.bus}</span>
                    </div>
                    <p style="font-size: 12px; color: #94A3B8;">Scan to verify ticket</p>
                    <p style="font-size: 12px; color: #94A3B8; margin-top: 8px;">Issued: ${new Date(booking.bookedAt).toLocaleString()}</p>
                </div>
            </div>
            <script>
                // Auto print when loaded
                setTimeout(() => window.print(), 500);
            <\/script>
        </body>
        </html>
    `;
    
    // Open in new window for printing
    const win = window.open('', '_blank');
    if (win) {
        win.document.write(ticketHtml);
        win.document.close();
    } else {
        DETravels.showToast('Please allow popups to download tickets', 'error');
    }
}

// ---------- CANCEL BOOKING ----------
function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    const bookings = DETravels.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    
    if (index === -1) {
        DETravels.showToast('Booking not found', 'error');
        return;
    }
    
    bookings[index].status = 'cancelled';
    localStorage.setItem('de_travels_bookings', JSON.stringify(bookings));
    
    DETravels.showToast('Booking cancelled successfully', 'success');
    renderBookings();
}

// ---------- FILTER BOOKINGS ----------
function filterBookings(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.filter-btn[data-filter="${filter}"]`)?.classList.add('active');
    renderBookings();
}

// ---------- INIT BOOKINGS PAGE ----------
document.addEventListener('DOMContentLoaded', function() {
    // Render bookings
    renderBookings();
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            filterBookings(this.dataset.filter);
        });
    });
});

// ---------- EXPOSE FUNCTIONS ----------
window.viewBooking = viewBooking;
window.closeModal = closeModal;
window.downloadTicket = downloadTicket;
window.cancelBooking = cancelBooking;
window.filterBookings = filterBookings;
window.renderBookings = renderBookings;