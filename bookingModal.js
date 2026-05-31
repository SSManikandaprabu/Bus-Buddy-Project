// MODULE: BOOKING MODAL
// Manages the seat selection modal's lifecycle and interactions.

import { state } from './state.js';
import { ui, showAlert } from './ui.js';
import { payment } from './payment.js';

function open(busDataset) {
    const { busId, seatType, baseFare } = busDataset;
    state.activeBooking = { busId, seatType, baseFare: parseInt(baseFare), selectedSeats: [] };
    const bus = state.busData[busId];

    const modalHTML = `
    <div class="bg-white w-full max-w-4xl rounded-lg shadow-2xl flex flex-col h-[90vh]">
        <div class="flex justify-between items-center p-4 border-b">
            <h2 class="text-2xl font-bold">${bus.name}</h2>
            <button id="close-booking-modal" class="text-gray-500 text-2xl">&times;</button>
        </div>
        <div class="flex-grow flex p-6 overflow-hidden">
            <div class="w-1/2 pr-4 border-r overflow-y-auto">
                <h3 class="font-semibold mb-2">Seat Layout</h3>
                <div id="modal-seat-layout" class="grid grid-cols-5 gap-2">${renderLayout(seatType)}</div>
            </div>
            <div class="w-1/2 pl-4 flex flex-col">
                <div id="passenger-details-section"></div>
                <div class="mt-auto pt-4 border-t">
                    <h5 class="font-bold mb-2">Booking Summary</h5>
                    <div id="modal-summary"></div>
                    <button id="modal-proceed-button" class="w-full p-3 mt-4 bg-blue-500 text-white rounded-lg disabled:bg-gray-400" disabled>Proceed</button>
                </div>
            </div>
        </div>
    </div>`;
    ui.seatBookingModal.innerHTML = modalHTML;
    ui.seatBookingModal.classList.remove('hidden');
    bindModalEvents();
    updateSummary();
}

function close() {
    ui.seatBookingModal.classList.add('hidden');
}

function bindModalEvents() {
    document.getElementById('close-booking-modal').addEventListener('click', close);
    document.getElementById('modal-seat-layout').addEventListener('click', e => {
        const seat = e.target.closest('.seat.available');
        if (seat) handleSeatClick(seat);
    });
    document.getElementById('modal-proceed-button').addEventListener('click', proceedToPayment);
}

function renderLayout(type) {
    let html = '';
    const rows = type === 'seater' ? 10 : 5;
    const icon = type === 'seater' ? 'fa-couch' : 'fa-bed';
    for (let i = 1; i <= rows * 4; i++) {
        const seatId = `${type.charAt(0).toUpperCase()}${i}`;
        const isBooked = Math.random() > 0.8;
        html += `<div class="seat ${isBooked ? 'booked' : 'available'}" data-seat-id="${seatId}">
            <i class="fas ${icon}"></i> <span class="text-xs">${seatId}</span>
        </div>`;
    }
    return html;
}

function handleSeatClick(seat) {
    const seatId = seat.dataset.seatId;
    const index = state.activeBooking.selectedSeats.indexOf(seatId);

    if (index > -1) {
        state.activeBooking.selectedSeats.splice(index, 1);
        seat.classList.remove('selected');
    } else {
        state.activeBooking.selectedSeats.push(seatId);
        seat.classList.add('selected');
    }
    updateSummary();
}

function updateSummary() {
    const summaryDiv = document.getElementById('modal-summary');
    const count = state.activeBooking.selectedSeats.length;
    const seatFare = count * state.activeBooking.baseFare;
    summaryDiv.innerHTML = `<p>Seats (${count}): ${count > 0 ? state.activeBooking.selectedSeats.join(', ') : 'None'}</p>
                            <p class="font-bold mt-2">Total Fare: ₹${seatFare}</p>`;
    document.getElementById('modal-proceed-button').disabled = count === 0;
}

function proceedToPayment() {
    close();
    payment.open();
}

export const bookingModal = { open };