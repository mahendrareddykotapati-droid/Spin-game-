/* =====================================================
   SPIN CHALLENGE
   Customized Wheel Image Version
===================================================== */


/* =========================
   VARIABLES
========================= */

let participantCount = 0;

let participants = [];

let currentRotation = 0;

let spinning = false;


/* =========================
   GET HTML ELEMENTS
========================= */

const participantInput =
    document.getElementById("participantCount");

const createWheelBtn =
    document.getElementById("createWheelBtn");

const spinBtn =
    document.getElementById("spinBtn");

const wheel =
    document.getElementById("wheel");

const numbersContainer =
    document.getElementById("numbersContainer");

const gameSection =
    document.getElementById("gameSection");

const result =
    document.getElementById("result");


/* =====================================================
   CREATE WHEEL BUTTON
===================================================== */

createWheelBtn.addEventListener(
    "click",
    createWheel
);


/* =====================================================
   CREATE WHEEL
===================================================== */

function createWheel() {

    const count =
        Number(participantInput.value);


    /* =========================
       VALIDATION
    ========================= */

    if (!Number.isInteger(count)) {

        alert(
            "Please enter the number of participants."
        );

        return;
    }


    if (count < 2) {

        alert(
            "Minimum participants is 2."
        );

        return;
    }


    if (count > 100) {

        alert(
            "Maximum participants is 100."
        );

        return;
    }


    /* =========================
       SAVE PARTICIPANT COUNT
    ========================= */

    participantCount = count;


    /* =========================
       CREATE PARTICIPANT NUMBERS
    ========================= */

    participants = [];

    for (
        let i = 1;
        i <= count;
        i++
    ) {

        participants.push(i);

    }


    /* =========================
       RANDOMIZE NUMBERS
    ========================= */

    shuffleArray(participants);


    /* =========================
       RESET WHEEL
    ========================= */

    currentRotation = 0;

    wheel.style.transition = "none";

    wheel.style.transform =
        "rotate(0deg)";


    /* =========================
       CREATE NUMBERS
    ========================= */

    drawNumbers();


    /* =========================
       SHOW GAME
    ========================= */

    gameSection.style.display =
        "flex";


    result.textContent =
        "Wheel created! Tap SPIN 🎯";


    spinBtn.disabled = false;

}


/* =====================================================
   DRAW PARTICIPANT NUMBERS
===================================================== */

function drawNumbers() {

    /* Remove old numbers */

    numbersContainer.innerHTML = "";


    /* Angle of each participant section */

    const segmentAngle =
        360 / participantCount;


    /* =========================
       NUMBER SIZE
    ========================= */

    let fontSize;


    if (participantCount <= 10) {

        fontSize = 25;

    }

    else if (participantCount <= 20) {

        fontSize = 20;

    }

    else if (participantCount <= 40) {

        fontSize = 14;

    }

    else if (participantCount <= 70) {

        fontSize = 11;

    }

    else {

        fontSize = 9;

    }


    /* =========================
       NUMBER DISTANCE FROM CENTER
    ========================= */

    let radius;


    if (participantCount <= 20) {

        radius = 39;

    }

    else if (participantCount <= 50) {

        radius = 42;

    }

    else {

        radius = 44;

    }


    /* =========================
       CREATE EACH NUMBER
    ========================= */

    for (
        let i = 0;
        i < participantCount;
        i++
    ) {

        const number =
            document.createElement("div");


        number.className =
            "number";


        number.textContent =
            participants[i];


        number.style.fontSize =
            `${fontSize}px`;


        /* =========================
           FIND NUMBER ANGLE
        ========================= */

        const angle =
            i * segmentAngle +
            segmentAngle / 2;


        /* =========================
           NUMBER POSITION
        ========================= */

        number.style.width =
            `${Math.max(
                30,
                segmentAngle * 0.85
            )}px`;


        number.style.height =
            `${Math.max(
                25,
                segmentAngle * 0.35
            )}px`;


        number.style.transform =
            `
            translate(-50%, -50%)
            rotate(${angle}deg)
            translateY(-${radius}%)
            rotate(${-angle}deg)
            `;


        /* =========================
           ADD NUMBER TO WHEEL
        ========================= */

        numbersContainer.appendChild(
            number
        );

    }

}


/* =====================================================
   SHUFFLE PARTICIPANTS
===================================================== */

function shuffleArray(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            array[i],
            array[j]
        ] =
        [
            array[j],
            array[i]
        ];

    }

}


/* =====================================================
   SPIN BUTTON
===================================================== */

spinBtn.addEventListener(
    "click",
    spinWheel
);


/* =====================================================
   SPIN WHEEL
===================================================== */

function spinWheel() {

    /* Prevent multiple clicks */

    if (spinning) {

        return;

    }


    /* Make sure wheel exists */

    if (participantCount < 2) {

        alert(
            "Create the wheel first."
        );

        return;

    }


    /* =========================
       START SPINNING
    ========================= */

    spinning = true;


    spinBtn.disabled = true;

    createWheelBtn.disabled = true;

    participantInput.disabled = true;


    result.textContent =
        "Spinning... 🎡";


    /* =================================================
       SELECT RANDOM WINNER
    ================================================= */

    const winnerIndex =
        Math.floor(
            Math.random() *
            participantCount
        );


    const winner =
        participants[winnerIndex];


    /* =================================================
       CALCULATE SEGMENT ANGLE
    ================================================= */

    const segmentAngle =
        360 / participantCount;


    /* =================================================
       WINNER CENTER ANGLE
    ================================================= */

    const winnerCenterAngle =
        winnerIndex *
        segmentAngle +
        segmentAngle / 2;


    /* =================================================
       CURRENT WHEEL ROTATION
    ================================================= */

    const currentMod =
        (
            currentRotation % 360 +
            360
        ) % 360;


    /* =================================================
       ALIGN WINNER WITH NEEDLE
    ================================================= */

    let alignment =
        (
            360 -
            winnerCenterAngle -
            currentMod
        ) % 360;


    if (alignment < 0) {

        alignment += 360;

    }


    /* =================================================
       EXACTLY 10 FULL ROTATIONS
    ================================================= */

    const tenRotations =
        360 * 10;


    /* =================================================
       TOTAL ROTATION
    ================================================= */

    const totalRotation =
        tenRotations +
        alignment;


    currentRotation +=
        totalRotation;


    /* =================================================
       10 SECOND SPIN
       
       FAST → GRADUALLY SLOW
    ================================================= */

    wheel.style.transition =
        "transform 10s cubic-bezier(0.12, 0.72, 0.18, 1)";


    wheel.style.transform =
        `rotate(${currentRotation}deg)`;


    /* =================================================
       WAIT EXACTLY 10 SECONDS
    ================================================= */

    setTimeout(
        function () {

            /* =========================
               DISPLAY WINNER
            ========================= */

            result.innerHTML =
                `🏆 Lucky Number: <strong>${winner}</strong>`;


            /* =========================
               ENABLE BUTTONS AGAIN
            ========================= */

            spinning = false;

            spinBtn.disabled = false;

            createWheelBtn.disabled = false;

            participantInput.disabled = false;

        },
        10000
    );

}
