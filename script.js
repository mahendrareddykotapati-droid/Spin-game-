let numberOfParticipants = 10;
let currentRotation = 0;
let spinning = false;


/* =========================
   CREATE WHEEL
========================= */

function createWheel() {

    const input = document.getElementById("participantCount");

    if (!input) {
        alert("Participant input not found.");
        return;
    }

    const count = Number(input.value);

    if (count < 2 || count > 100) {
        alert("Please enter a number between 2 and 100.");
        return;
    }

    numberOfParticipants = count;
    currentRotation = 0;

    const setupScreen =
        document.getElementById("setupScreen");

    const gameScreen =
        document.getElementById("gameScreen");

    if (!setupScreen || !gameScreen) {
        alert("Game screen elements are missing from index.html.");
        return;
    }

    setupScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    resizeWheel();
    drawWheel();
}


/* =========================
   GET CANVAS
========================= */

function getCanvas() {
    return document.getElementById("wheel");
}


/* =========================
   RESIZE WHEEL
========================= */

function resizeWheel() {

    const canvas = getCanvas();

    if (!canvas) return;

    const size = Math.min(
        window.innerWidth * 0.9,
        500
    );

    canvas.width = size;
    canvas.height = size;
}


/* =========================
   DRAW WHEEL
========================= */

function drawWheel() {

    const canvas = getCanvas();

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const size = canvas.width;
    const center = size / 2;
    const radius = size / 2 - 5;

    const sectionAngle =
        (2 * Math.PI) / numberOfParticipants;

    ctx.clearRect(
        0,
        0,
        size,
        size
    );


    /* BLUE → WHITE → GREEN */

    const colors = [
        "#2563eb",
        "#ffffff",
        "#16a34a"
    ];


    /* DRAW SECTIONS */

    for (
        let i = 0;
        i < numberOfParticipants;
        i++
    ) {

        const startAngle =
            -Math.PI / 2 +
            currentRotation +
            i * sectionAngle;

        const endAngle =
            startAngle +
            sectionAngle;


        /* COLOR */

        ctx.fillStyle =
            colors[i % 3];


        /* SECTION */

        ctx.beginPath();

        ctx.moveTo(
            center,
            center
        );

        ctx.arc(
            center,
            center,
            radius,
            startAngle,
            endAngle
        );

        ctx.closePath();

        ctx.fill();


        /* BORDER */

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;

        ctx.stroke();


        /* NUMBER */

        const middleAngle =
            startAngle +
            sectionAngle / 2;

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


        ctx.save();

        ctx.translate(x, y);


        let fontSize;

        if (numberOfParticipants <= 20) {

            fontSize = 24;

        } else if (numberOfParticipants <= 50) {

            fontSize = 15;

        } else {

            fontSize = 10;
        }


        ctx.font =
            `bold ${fontSize}px Arial`;

        /* NUMBER COLOR */

        if (i % 3 === 1) {

            ctx.fillStyle = "#000000";

        } else {

            ctx.fillStyle = "#ffffff";
        }


        ctx.textAlign = "center";
        ctx.textBaseline = "middle";


        ctx.fillText(
            i + 1,
            0,
            0
        );


        ctx.restore();
    }


    /* OUTER CIRCLE */

    ctx.beginPath();

    ctx.arc(
        center,
        center,
        radius,
        0,
        2 * Math.PI
    );

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 5;

    ctx.stroke();


    /* CENTER */

    ctx.beginPath();

    ctx.arc(
        center,
        center,
        25,
        0,
        2 * Math.PI
    );

    ctx.fillStyle = "#111827";

    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;

    ctx.stroke();
}


/* =========================
   SPIN WHEEL
========================= */

function spinWheel() {

    if (spinning) return;

    spinning = true;

    const button =
        document.getElementById("spinButton");

    if (button) {
        button.disabled = true;
    }

    const result =
        document.getElementById("result");

    if (result) {
        result.innerHTML = "";
    }


    /* RANDOM WINNER */

    const winner =
        Math.floor(
            Math.random() *
            numberOfParticipants
        ) + 1;


    const twoPi =
        2 * Math.PI;

    const sectionAngle =
        twoPi / numberOfParticipants;


    /* WINNER CENTER */

    const winnerAngle =
        (winner - 1) *
        sectionAngle +
        sectionAngle / 2;


    /* CURRENT POSITION */

    let currentNormalized =
        currentRotation % twoPi;

    if (currentNormalized < 0) {
        currentNormalized += twoPi;
    }


    /* TARGET */

    const targetRotation =
        -winnerAngle;


    let rotationDifference =
        targetRotation -
        currentNormalized;


    rotationDifference =
        rotationDifference % twoPi;


    if (rotationDifference < 0) {
        rotationDifference += twoPi;
    }


    /*
       AT LEAST 10 COMPLETE ROTATIONS
    */

    const fullSpins = 10;

    const totalRotation =
        fullSpins * twoPi +
        rotationDifference;


    const startRotation =
        currentRotation;


    const finalRotation =
        startRotation +
        totalRotation;


    /*
       EXACTLY 10 SECONDS
    */

    const duration = 10000;

    const startTime =
        performance.now();


    function animate(currentTime) {

        const elapsed =
            currentTime -
            startTime;

        let progress =
            elapsed / duration;


        if (progress > 1) {
            progress = 1;
        }


        /* SMOOTH SLOW DOWN */

        const eased =
            1 -
            Math.pow(
                1 - progress,
                4
            );


        currentRotation =
            startRotation +
            totalRotation * eased;


        drawWheel();


        if (progress < 1) {

            requestAnimationFrame(
                animate
            );

        } else {

            currentRotation =
                finalRotation;

            drawWheel();

            showResult(winner);

            spinning = false;

            if (button) {
                button.disabled = false;
            }
        }
    }


    requestAnimationFrame(
        animate
    );
}


/* =========================
   RESULT
========================= */

function showResult(number) {

    const result =
        document.getElementById("result");

    if (!result) return;

    result.innerHTML = `
        🎯 NUMBER ${number}
        <br>
        <span>It's your turn!</span>
    `;
}


/* =========================
   RESET
========================= */

function resetGame() {

    currentRotation = 0;
    spinning = false;

    const gameScreen =
        document.getElementById("gameScreen");

    const setupScreen =
        document.getElementById("setupScreen");

    if (gameScreen) {
        gameScreen.classList.add("hidden");
    }

    if (setupScreen) {
        setupScreen.classList.remove("hidden");
    }

    const result =
        document.getElementById("result");

    if (result) {
        result.innerHTML = "";
    }
}


/* =========================
   SCREEN RESIZE
========================= */

window.addEventListener(
    "resize",
    function () {

        const gameScreen =
            document.getElementById("gameScreen");

        if (
            gameScreen &&
            !gameScreen.classList.contains("hidden")
        ) {

            resizeWheel();
            drawWheel();
        }
    }
);
