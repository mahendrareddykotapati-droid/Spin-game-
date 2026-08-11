/* =====================================================
   SPIN CHALLENGE
===================================================== */


/* =========================
   VARIABLES
========================= */

let participantCount = 0;

let participants = [];

let currentRotation = 0;

let spinning = false;


/* =========================
   RAINBOW COLOURS
========================= */

const rainbowColors = [
    "#ff0000", // Red
    "#ff7f00", // Orange
    "#ffff00", // Yellow
    "#00cc44", // Green
    "#00cfff", // Cyan
    "#0066ff", // Blue
    "#8a2be2", // Violet
    "#ff00aa"  // Pink
];


/* =========================
   GET ELEMENTS
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


/* =========================
   CREATE WHEEL
========================= */

createWheelBtn.addEventListener("click", createWheel);


/* =========================
   CREATE WHEEL FUNCTION
========================= */

function createWheel() {

    const count = Number(participantInput.value);


    /* -------------------------
       VALIDATION
    ------------------------- */

    if (!Number.isInteger(count)) {

        alert("Please enter the number of participants.");

        return;
    }


    if (count < 2) {

        alert("Minimum participants is 2.");

        return;
    }


    if (count > 100) {

        alert("Maximum participants is 100.");

        return;
    }


    /* -------------------------
       SAVE COUNT
    ------------------------- */

    participantCount = count;


    /* -------------------------
       CREATE NUMBERS
    ------------------------- */

    participants = [];

    for (let i = 1; i <= count; i++) {

        participants.push(i);

    }


    /* -------------------------
       RANDOMIZE NUMBERS
    ------------------------- */

    shuffleArray(participants);


    /* -------------------------
       RESET ROTATION
    ------------------------- */

    currentRotation = 0;

    wheel.style.transition = "none";

    wheel.style.transform =
        "rotate(0deg)";


    /* -------------------------
       CREATE WHEEL
    ------------------------- */

    drawWheel();


    /* -------------------------
       SHOW GAME
    ------------------------- */

    gameSection.style.display = "flex";


    result.textContent =
        "Wheel created! Tap SPIN 🎯";


    spinBtn.disabled = false;

}


/* =====================================================
   DRAW WHEEL
===================================================== */

function drawWheel() {

    numbersContainer.innerHTML = "";


    const segmentAngle =
        360 / participantCount;


    /* -------------------------
       CREATE COLOUR LIST
    ------------------------- */

    const colors =
        createColorPattern(participantCount);


    /* -------------------------
       CREATE SEGMENT BACKGROUND
    ------------------------- */

    let gradientParts = [];


    for (let i = 0; i < participantCount; i++) {

        const start =
            i * segmentAngle;

        const end =
            (i + 1) * segmentAngle;

        gradientParts.push(
            `${colors[i]} ${start}deg ${end}deg`
        );

    }


    wheel.style.background =
        `conic-gradient(from -90deg, ${gradientParts.join(",")})`;


    /* -------------------------
       CREATE NUMBERS
    ------------------------- */

    for (let i = 0; i < participantCount; i++) {

        const number =
            document.createElement("div");

        number.className = "number";

        number.textContent =
            participants[i];


        /* -------------------------
           NUMBER SIZE
        ------------------------- */

        let fontSize;

        if (participantCount <= 10) {

            fontSize = 25;

        } else if (participantCount <= 20) {

            fontSize = 20;

        } else if (participantCount <= 40) {

            fontSize = 14;

        } else if (participantCount <= 70) {

            fontSize = 11;

        } else {

            fontSize = 9;

        }


        number.style.fontSize =
            `${fontSize}px`;


        /* -------------------------
           NUMBER POSITION
        ------------------------- */

        const angle =
            i * segmentAngle +
            segmentAngle / 2;


        /*
           Keep numbers near the outer
           edge of the wheel.
        */

        const radiusPercent =
            participantCount <= 20
                ? 38
                : 42;


        number.style.width =
            `${Math.max(35, segmentAngle * 0.85)}px`;

        number.style.height =
            `${Math.max(25, segmentAngle * 0.35)}px`;


        number.style.transform =
            `
            translate(-50%, -50%)
            rotate(${angle}deg)
            translateY(-${radiusPercent * 1.9}px)
            rotate(${-angle}deg)
            `;


        numbersContainer.appendChild(number);

    }

}


/* =====================================================
   CREATE COLOUR PATTERN
===================================================== */

function createColorPattern(count) {

    const colors = [];


    for (let i = 0; i < count; i++) {

        let color;


        /*
           Try to choose a colour different
           from the previous segment.
        */

        const previousColor =
            colors[i - 1];


        const availableColors =
            rainbowColors.filter(
                c => c !== previousColor
            );


        color =
            availableColors[
                Math.floor(
                    Math.random() *
                    availableColors.length
                )
            ];


        colors.push(color);

    }


    /*
       Fix first/last segment if they have
       the same colour because they are
       also neighbours on a circle.
    */

    if (
        count > 2 &&
        colors[0] === colors[count - 1]
    ) {

        const availableColors =
            rainbowColors.filter(
                c =>
                    c !== colors[count - 2] &&
                    c !== colors[0]
            );


        if (availableColors.length > 0) {

            colors[count - 1] =
                availableColors[
                    Math.floor(
                        Math.random() *
                        availableColors.length
                    )
                ];

        }

    }


    return colors;

}


/* =====================================================
   SHUFFLE ARRAY
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

spinBtn.addEventListener("click", spinWheel);


/* =====================================================
   SPIN WHEEL
===================================================== */

function spinWheel() {

    if (spinning) {
        return;
    }


    if (participantCount < 2) {

        alert("Create the wheel first.");

        return;
    }


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


    /*
       Find the center of the winner's segment.
    */

    const winnerCenterAngle =
        winnerIndex * segmentAngle +
        segmentAngle / 2;


    /* =================================================
       EXACTLY 10 ROTATIONS
    ================================================= */

    const tenRotations =
        360 * 10;


    /*
       Current rotation modulo 360.
    */

    const currentMod =
        ((currentRotation % 360) + 360) % 360;


    /*
       Calculate the smallest positive rotation
       needed to place winner at the red needle.
    */

    let alignment =
        (360 - winnerCenterAngle - currentMod) % 360;


    if (alignment < 0) {
        alignment += 360;
    }


    /*
       Total rotation:

       10 complete rotations
       +
       alignment

       Every spin therefore has the
       same 10 full rotations.
    */

    const totalRotation =
        tenRotations + alignment;


    currentRotation +=
        totalRotation;


    /* =================================================
       10 SECOND SPIN
    ================================================= */

    wheel.style.transition =
        "transform 10s cubic-bezier(0.12, 0.72, 0.18, 1)";


    wheel.style.transform =
        `rotate(${currentRotation}deg)`;


    /* =================================================
       SHOW RESULT AFTER EXACTLY 10 SECONDS
    ================================================= */

    setTimeout(() => {

        result.innerHTML =
            `🏆 Lucky Number: <strong>${winner}</strong>`;


        spinning = false;

        spinBtn.disabled = false;

        createWheelBtn.disabled = false;

        participantInput.disabled = false;

    }, 10000);

           }
