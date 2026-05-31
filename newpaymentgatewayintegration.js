// --- Global State Variables (Required Context) ---
let walletBalance = 500.00; // Simulated wallet balance
const SERVICE_CHARGE = 150;
let activeBooking = { /* ... holds totalFare, passengerEmail, etc. ... */ }; 
let selectedPaymentMethod = 'card'; // Updated via listener on payment methods

// --- Functions and Listeners ---

const handleBookingConfirmation = () => {
    // 5. Response Handling (Success) and update booking status
    const payButton = document.getElementById('pay-now-button');
    // ... logic to create newBooking object and add to userBookings array ...
    // ... logic to update confirmation modal UI ...
    
    paymentModal.classList.add('hidden');
    confirmationModal.classList.remove('hidden');
    
    payButton.disabled = false; 
    payButton.innerHTML = 'Pay Now';
    document.getElementById('passenger-form').reset();
};

document.getElementById('pay-now-button').addEventListener('click', () => {
    const form = document.getElementById('passenger-form');
    // 2. Payment Form Creation: Input Validation
    if (!form.checkValidity()) { 
        showAlert('Please fill in your contact details.'); 
        return; 
    }
    
    // Store contact info (mock secure data collection)
    activeBooking.passengerEmail = document.getElementById('passenger-email').value;
    activeBooking.passengerPhone = document.getElementById('passenger-phone').value;
    activeBooking.pnr = `BB${Date.now().toString().slice(-6)}`;
    
    const payButton = document.getElementById('pay-now-button');
    payButton.disabled = true;
    // 4. Transaction Processing (Simulated Request to Gateway API)
    payButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';

    if (selectedPaymentMethod === 'wallet') {
        if (walletBalance >= activeBooking.totalFare) {
            setTimeout(() => {
                walletBalance -= activeBooking.totalFare;
                const cashback = activeBooking.totalFare * 0.02; // Mock wallet cashback
                walletBalance += cashback;
                updateWalletDisplay();
                showAlert(`Payment successful! You've received ₹${cashback.toFixed(2)} cashback.`, 'success');
                handleBookingConfirmation();
            }, 1500); // Mock API latency
        } else {
            // 5. Response Handling (Failure)
            showAlert('Insufficient wallet balance. Please add funds or choose another payment method.', 'danger');
            payButton.disabled = false; payButton.innerHTML = 'Pay Now';
        }
    } else {
        // Mock non-wallet payment process (Card/UPI/Netbanking)
        // 3. Tokenization & 4. Transaction Processing (Simulated)
        setTimeout(handleBookingConfirmation, 1500); 
    }
});

// Listener for payment method selection
paymentModal.querySelectorAll('.payment-method').forEach(el => { 
    el.addEventListener('click', () => { 
        paymentModal.querySelectorAll('.payment-method').forEach(p => p.classList.remove('selected')); 
        el.classList.add('selected');
        selectedPaymentMethod = el.dataset.method;
    }); 
});

// Helper function to update fare details in the payment modal
seatBookingModal.querySelector('#modal-proceed-button').addEventListener('click', () => {
    // ... other validation checks ...
    
    paymentModal.querySelector('#payment-summary').innerHTML = 
        `<div class="flex justify-between"><span>Bus Fare:</span><span>₹${(activeBooking.totalFare - SERVICE_CHARGE).toLocaleString()}</span></div>
         <div class="flex justify-between"><span>Taxes & Fees:</span><span>₹${SERVICE_CHARGE}</span></div>
         <div class="border-t mt-2 pt-2 flex justify-between font-bold text-lg"><span>Total Amount:</span><span class="text-primary-accent">₹${activeBooking.totalFare.toLocaleString()}</span></div>`;
    
    // ... open payment modal ...
});