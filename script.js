/* =========================
   VARIABLES
========================= */

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

const participantInput =
    document.getElementById("participantCount");

const createWheelBtn =
    document.getElementById("createWheelBtn");

const spinBtn =
    document.getElementById("spinBtn");

const resultText =
    document.getElementById("resultText");


let participants = [];
let numberOfParticipants = 16;

let currentRotation = 0;
let spinning = false;


/* =========================
   WHEEL COLOURS
========================= */

const RED = "#ff1600";
const ORANGE = "#ff8500";


/* =========================
   SHUFFLE NUMBERS
========================= */

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
            [array[j], array[i]];
    }

    return array;
}


/* =========================
   CREATE PARTICIPANTS
========================= */

function createParticipants(count) {

    let numbers = [];

    for (let i = 1; i <= count; i++) {
        numbers.push(i);
    }

    return shuffle(numbers);
}


/* =========================
   DRAW WHEEL
========================= */

function drawWheel() {

    const size = canvas.width;

    const center = size / 2;

    const radius = center - 8;

    ctx.clearRect(
        0,
        0,
        size,
        size
    );


    const count = participants.length;

    const anglePerSegment =
        (2 * Math.PI) / count;


    /* =========================
       DRAW SEGMENTS
    ========================= */

    for (let i = 0; i < count; i++) {

        const startAngle =
            i * anglePerSegment - Math.PI / 2;

        const endAngle =
            startAngle + anglePerSegment;


        /* ALTERNATE RED / ORANGE */

        if (i % 2 === 0) {
            ctx.fillStyle = RED;
        } else {
            ctx.fillStyle = ORANGE;
        }


        ctx.beginPath();

        ctx.moveTo(center, center);

        ctx.arc(
            center,
            center,
            radius,
            startAngle,
            endAngle
        );

        ctx.closePath();

        ctx.fill();


        /* =========================
           SEGMENT BORDER
        ========================= */

        ctx.strokeStyle = "#5b0500";

        ctx.lineWidth = 3;

        ctx.stroke();


        /* =========================
           NUMBER
        ========================= */

        const middleAngle =
            startAngle +
            anglePerSegment / 2;


        const textRadius =
            radius * 0.72;


        const x =
            center +
            Math.cos(middleAngle) *
            textRadius;

        const y =
            center +
            Math.sin(middleAngle) *
            textRadius;


        let fontSize;

        if (count <= 15) {
            fontSize = 32;
        }
        else if (count <= 30) {
            fontSize = 25;
        }
        else if (count <= 50) {
            fontSize = 20;
        }
        else if (count <= 75) {
            fontSize = 16;
        }
        else {
            fontSize = 13;
        }


        ctx.save();

        ctx.translate(x, y);

        ctx.rotate(
            middleAngle + Math.PI / 2
        );


        ctx.fillStyle = "white";

        ctx.font =
            `bold ${fontSize}px Arial`;

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.shadowColor = "rgba(0,0,0,0.7)";
        ctx.shadowBlur = 4;


        ctx.fillText(
            participants[i],
            0,
            0
        );

        ctx.restore();
    }


    /* =========================
       OUTER BORDER
    ========================= */

    ctx.beginPath();

    ctx.arc(
        center,
        center,
        radius,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle = "#ff2a00";

    ctx.lineWidth = 8;

    ctx.stroke();
}


/* =========================
   CREATE WHEEL
========================= */

function createWheel() {

    let count =
        Number(participantInput.value);


    /* VALIDATION */

    if (
        !Number.isInteger(count) ||
        count < 2 ||
        count > 100
    ) {

        alert(
            "Please enter a number between 2 and 100."
        );

        return;
    }


    numberOfParticipants = count;


    /* RANDOM NUMBER ORDER */

    participants =
        createParticipants(count);


    /* RESET ROTATION */

    currentRotation = 0;

    canvas.style.transition = "none";

    canvas.style.transform =
        "rotate(0deg)";


    /* DRAW */

    drawWheel();


    /* RESET RESULT */

    resultText.textContent =
        "Lucky Number: -";


    spinBtn.disabled = false;
}


/* =========================
   SPIN WHEEL
========================= */

function spinWheel() {

    if (spinning) {
        return;
    }


    if (participants.length === 0) {

        alert(
            "Please create the wheel first."
        );

        return;
    }


    spinning = true;

    spinBtn.disabled = true;

    createWheelBtn.disabled = true;


    resultText.textContent =
        "Spinning...";


    /* =========================
       SELECT RANDOM SEGMENT
    ========================= */

    const winnerIndex =
        Math.floor(
            Math.random() *
            participants.length
        );


    const count =
        participants.length;


    const segmentAngle =
        360 / count;


    /*
       We want the selected segment
       to stop exactly under the
       top pointer.
    */

    const targetAngle =
        winnerIndex * segmentAngle +
        segmentAngle / 2;


    /*
       10+ COMPLETE ROTATIONS

       10 rotations = 3600 degrees

       Add extra random rotations
       between 10 and 12.
    */

    const fullRotations =
        10 + Math.floor(Math.random() * 3);


    const totalRotation =
        fullRotations * 360 +
        (360 - targetAngle);


    currentRotation += totalRotation;


    /* =========================
       APPLY 10 SECOND ANIMATION
    ========================= */

    canvas.style.transition =
        "transform 10s cubic-bezier(0.12, 0.75, 0.15, 1)";


    canvas.style.transform =
        `rotate(${currentRotation}deg)`;


    /* =========================
       SHOW RESULT AFTER 10 SEC
    ========================= */

    setTimeout(() => {

        const luckyNumber =
            participants[winnerIndex];


        resultText.textContent =
            `Lucky Number: ${luckyNumber}`;


        spinning = false;

        spinBtn.disabled = false;

        createWheelBtn.disabled = false;

    }, 10000);
}


/* =========================
   BUTTON EVENTS
========================= */

createWheelBtn.addEventListener(
    "click",
    createWheel
);

spinBtn.addEventListener(
    "click",
    spinWheel
);


/* =========================
   CREATE INITIAL WHEEL
========================= */

participants =
    createParticipants(
        numberOfParticipants
    );

drawWheel();
