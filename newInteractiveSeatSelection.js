// --- Core State Variables (excerpt) ---
let busData = {}; // Contains base fares, etc.
let activeBooking = {}; // Stores selectedSeats, passengers, etc.
const seatMap = { /* ... predefined mock seat availability ... */ }; 

// --- Core Functions: Seat Layout Generation and Interaction ---

function generateSeatLayoutInModal(type) {
    // Logic to create the visual grid/deck layout (createSeaterLayout, createDeckLayout functions)
    // It dynamically sets data-seat-id, data-price, data-status on each seat element
    // ... layout generation code omitted for brevity ...
    
    attachModalSeatListeners(); // Attach listeners after rendering
}

function attachModalSeatListeners() {
    document.querySelectorAll('.seat.available').forEach(seat => {
        seat.addEventListener('click', () => {
            const seatId = seat.dataset.seatId;
            const price = parseInt(seat.dataset.price, 10);
            const maxTravellers = 10;
            const index = activeBooking.selectedSeats.findIndex(s => s.id === seatId);

            if (index > -1) {
                // Deselect seat
                activeBooking.selectedSeats.splice(index, 1);
                delete activeBooking.passengers[seatId];
                seat.classList.remove('selected');
            } else if (activeBooking.selectedSeats.length < maxTravellers) {
                // Selection Validation: Prevent selection of booked seats is handled by '.seat.available' selector
                
                // Select seat
                activeBooking.selectedSeats.push({ id: seatId, price: price });
                activeBooking.passengers[seatId] = { name: '', age: '', gender: '' };
                seat.classList.add('selected');
            } else {
                showAlert(`You can only select up to ${maxTravellers} seat(s).`);
            } 
            
            // Update UI
            renderPassengerForms();
            updateModalSummary();
        });
    });
}

function renderPassengerForms() {
    // Generates input fields for each seat in activeBooking.selectedSeats
    // Also attaches 'input' listeners to continuously update activeBooking.passengers object
    // ... passenger form rendering code omitted for brevity ...
}

function arePassengerDetailsValid() {
    // Client-side validation: ensures name, age, and gender are filled for ALL selected seats
    if (activeBooking.selectedSeats.length === 0) return false;
    for (const seatId in activeBooking.passengers) {
        const passenger = activeBooking.passengers[seatId];
        if (!passenger.name.trim() || !passenger.age.trim() || !passenger.gender) {
            return false;
        }
    }
    return true;
}

// Event listener for the "Select Seats" button (on DOMContentLoaded)
busList.addEventListener('click', (e) => {
    const button = e.target.closest('.select-seats-btn');
    if (!button) return;
    // ... logic to check if user is logged in ...
    
    // Initialize activeBooking object
    const card = e.target.closest('.bus-card');
    activeBooking = { 
        busId: card.dataset.busId, 
        seatType: card.dataset.seatType, 
        baseFare: parseInt(card.dataset.baseFare, 10), 
        selectedSeats: [], 
        passengers: {}, 
        appliedVoucher: null 
    };
    populateBookingModal(activeBooking.busId);
    document.getElementById('seat-booking-modal').classList.remove('hidden');
});

// Event listener for "Proceed to Payment" button (in modal-summary section)
seatBookingModal.querySelector('#modal-proceed-button').addEventListener('click', () => {
    // Final validation before proceeding:
    if (!arePassengerDetailsValid()) { 
        showAlert("Please fill in all passenger details."); 
        return; 
    }
    // ... check boarding/dropping points ...
    
    // ... proceed to next modal (payment) ...
});