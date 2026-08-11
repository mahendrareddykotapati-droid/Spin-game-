// ===============================
// PARTICIPANT WHEEL
// ===============================

const createWheelBtn = document.getElementById("createWheel");
const spinBtn = document.getElementById("spinBtn");
const participantInput = document.getElementById("participants");
const wheel = document.getElementById("wheel");
const result = document.getElementById("result");

let participants = [];
let currentRotation = 0;
let isSpinning = false;


// ===============================
// SHUFFLE NUMBERS RANDOMLY
// ===============================

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {

        const randomIndex = Math.floor(Math.random() * (i + 1));

        [array[i], array[randomIndex]] =
        [array[randomIndex], array[i]];
    }

    return array;
}


// ===============================
// CREATE WHEEL
// ===============================

createWheelBtn.addEventListener("click", function () {

    const count = parseInt(participantInput.value);

    // Check participant number
    if (isNaN(count) || count < 2) {
        alert("Please enter at least 2 participants.");
        return;
    }

    if (count > 100) {
        alert("Maximum 100 participants allowed.");
        return;
    }


    // Create participant numbers
    participants = [];

    for (let i = 1; i <= count; i++) {
        participants.push(i);
    }


    // RANDOMIZE PARTICIPANT NUMBERS
    participants = shuffleArray(participants);


    // Reset wheel
    currentRotation = 0;

    wheel.style.transition = "none";
    wheel.style.transform = "rotate(0deg)";


    // Clear old wheel
    wheel.innerHTML = "";


    // Create wheel segments
    const segmentAngle = 360 / participants.length;


    participants.forEach((number, index) => {

        const segment = document.createElement("div");

        segment.className = "segment";

        segment.innerText = number;


        // Position number around wheel
        const angle = index * segmentAngle;

        segment.style.transform =
            `rotate(${angle}deg) translateY(-50%)`;


        wheel.appendChild(segment);

    });


    // Show spin button
    spinBtn.style.display = "block";

    // Clear previous result
    result.innerText = "";


    console.log("Random participant order:", participants);

});


// ===============================
// SPIN WHEEL
// ===============================

spinBtn.addEventListener("click", function () {

    if (isSpinning) {
        return;
    }

    if (participants.length === 0) {
        alert("Create the wheel first.");
        return;
    }


    isSpinning = true;

    spinBtn.disabled = true;


    // Select random participant
    const randomIndex =
        Math.floor(Math.random() * participants.length);

    const winner =
        participants[randomIndex];


    // Angle of each segment
    const segmentAngle =
        360 / participants.length;


    // Calculate position of selected segment
    const targetAngle =
        360 - (randomIndex * segmentAngle);


    // Minimum 10 seconds spinning
    const extraSpins = 12;

    const rotation =
        currentRotation +
        (extraSpins * 360) +
        targetAngle;


    currentRotation = rotation;


    // Apply spinning animation
    wheel.style.transition =
        "transform 10s cubic-bezier(0.15, 0.75, 0.25, 1)";

    wheel.style.transform =
        `rotate(${rotation}deg)`;


    // Show winner after 10 seconds
    setTimeout(function () {

        result.innerText =
            `🎉 Selected Participant: ${winner}`;

        isSpinning = false;

        spinBtn.disabled = false;

    }, 10000);

});
