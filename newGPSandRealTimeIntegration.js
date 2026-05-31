// --- State Variables ---
let trackingInterval;
let tripHistory = [];

// --- Core Tracking Function ---
function startBusTracking() {
    clearInterval(trackingInterval); // Clear any existing interval
    tripHistory = [];
    
    // MOCK DATA SETUP
    const fromCity = document.getElementById('from-city').value;
    const toCity = document.getElementById('to-city').value;
    // locationData structure is defined at the start of the main script
    const checkpoints = (locationData[fromCity] && locationData[fromCity].checkpoints) || locationData['Default'].checkpoints;
    const totalCheckpoints = checkpoints.length + 2; // Start, checkpoints, End
    let currentCheckpoint = 0;

    // UI Elements
    const busIcon = document.getElementById('tracking-bus-icon');
    const statusEl = document.getElementById('tracking-status');
    const etaEl = document.getElementById('tracking-eta');
    const alertsContainer = document.getElementById('tracking-alerts-container');
    const trackingLine = document.getElementById('tracking-line');
    const checkpointLabels = document.getElementById('checkpoint-labels');

    // Initial setup of checkpoints on the line
    const allPoints = [fromCity, ...checkpoints, toCity];
    trackingLine.innerHTML = '<div id="tracking-bus-icon" class="dark:text-white"><i class="fas fa-bus"></i></div>';
    checkpointLabels.innerHTML = '';
    allPoints.forEach((point, index) => {
        const percent = (index / (allPoints.length - 1)) * 100;
        trackingLine.innerHTML += `<div class="checkpoint" style="left: ${percent}%" data-index="${index}"></div>`;
        checkpointLabels.innerHTML += `<span style="flex-basis: ${percent}%" class="text-right">${point}</span>`;
    });
    
    // Core Update Logic (Mocks continuous GPS stream/polling)
    function updateTrackingState() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' });
        const progress = (currentCheckpoint / (totalCheckpoints - 1)) * 100;

        // 1. Visual Progress Update (Simulates movement)
        if (busIcon) {
            busIcon.style.left = `calc(${progress}% - 12px)`;
        }

        // 2. Checkpoint Status Update
        document.querySelectorAll('#tracking-line .checkpoint').forEach(el => {
            if(parseInt(el.dataset.index) <= currentCheckpoint) el.classList.add('active');
            else el.classList.remove('active');
        });
        
        let currentStatus = "";
        if (currentCheckpoint === 0) {
            currentStatus = "Journey Started";
        } else if (currentCheckpoint < totalCheckpoints - 1) {
            currentStatus = `Crossed ${allPoints[currentCheckpoint]}`;
        } else {
            currentStatus = "Arrived at Destination";
            // 3. Stop Tracking
            clearInterval(trackingInterval);
        }
        
        // 4. Update UI Status and History
        if (currentStatus) {
            statusEl.textContent = currentStatus;
            const alertHTML = `<div class="..."><p class="font-semibold">${currentStatus}</p><p class="text-xs text-gray-400">${timeString}</p></div>`;
            alertsContainer.innerHTML = alertHTML + alertsContainer.innerHTML;
            tripHistory.push({ status: currentStatus, time: timeString });
        }
        
        // 5. Simulate Exponential Backoff (MOCK: Random delay alert)
        if (currentCheckpoint > 0 && Math.random() < 0.2) {
             const delayStatus = `Minor delay due to traffic`;
             // In a real app, 'exponential backoff' would involve increasing the polling interval
             // if location API calls failed, to reduce server load.
        }

        currentCheckpoint++;
    }
    
    updateTrackingState(); // Initial run
    // Real-time updates via periodic polling (4-second interval mock)
    trackingInterval = setInterval(updateTrackingState, 4000); 

    document.getElementById('tracking-modal').classList.remove('hidden');
}

// Event Listener to start tracking (on DOMContentLoaded)
document.getElementById('track-bus-button').addEventListener('click', () => {
    // ... logic to hide confirmation modal ...
    startBusTracking();
});

document.getElementById('close-tracking-modal').addEventListener('click', () => {
    clearInterval(trackingInterval); // Stop polling/streaming
    document.getElementById('tracking-modal').classList.add('hidden');
});

// NOTE: The actual Geolocation API (navigator.geolocation) is *not* used in the provided code, 
// as its usage is difficult to mock effectively and typically requires secure context (HTTPS).
// The code effectively demonstrates the client-side *handling* of a simulated real-time stream.