const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

let numberOfParticipants = 10;
let currentRotation = 0;
let spinning = false;


/* =========================
   CREATE WHEEL
========================= */

function createWheel() {

    const count = Number(
        document.getElementById("participantCount").value
    );

    if (count < 2 || count > 100) {
        alert("Please choose between 2 and 100 participants.");
        return;
    }

    numberOfParticipants = count;
    currentRotation = 0;

    document
        .getElementById("setupScreen")
        .classList.add("hidden");

    document
        .getElementById("gameScreen")
        .classList.remove("hidden");

    resizeWheel();
    drawWheel();
}


/* =========================
   RESIZE WHEEL
========================= */

function resizeWheel() {

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


    /* DRAW EACH SECTION */

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


        /* SECTION COLOR */

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


        /* SECTION BORDER */

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;

        ctx.stroke();


        /* NUMBER POSITION */

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


        /* NUMBER */

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


        /* BLACK NUMBER ON WHITE
           WHITE NUMBER ON BLUE/GREEN */

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


    /* =========================
       OUTER CIRCLE
    ========================= */

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


    /* =========================
       CENTER CIRCLE
    ========================= */

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

    if (spinning) {
        return;
    }

    spinning = true;


    const button =
        document.getElementById("spinButton");

    button.disabled = true;


    document.getElementById(
        "result"
    ).innerHTML = "";


    /* =========================
       SELECT RANDOM NUMBER
    ========================= */

    const winner =
        Math.floor(
            Math.random() *
            numberOfParticipants
        ) + 1;


    /* ANGLE OF ONE SECTION */

    const sectionAngle =
        (2 * Math.PI) /
        numberOfParticipants;


    /*
       The red pointer is at the top.

       We want the CENTER of the
       selected section to reach
       the top pointer.
    */

    const targetAngle =
        -(
            (winner - 1) *
            sectionAngle +
            sectionAngle / 2
        );


    /*
       IMPORTANT FIX:

       Always add 8 COMPLETE rotations.

       This guarantees that the wheel
       visibly spins even when there
       are 50, 60 or 100 numbers.
    */

    const fullSpins = 8;

    const extraSpins =
        fullSpins * 2 * Math.PI;


    const startRotation =
        currentRotation;


    /*
       Calculate final position.
    */

    let finalRotation =
        startRotation +
        extraSpins +
        targetAngle;


    /*
       Make sure final position is
       always ahead of the current
       position.
    */

    while (
        finalRotation <= startRotation
    ) {

        finalRotation +=
            2 * Math.PI;
    }


    /* =========================
       ANIMATION
    ========================= */

    const duration = 6000;

    const startTime =
        performance.now();


    function animate(currentTime) {

        const elapsed =
            currentTime - startTime;


        let progress =
            elapsed / duration;


        if (progress > 1) {
            progress = 1;
        }


        /*
           Smooth ease-out:

           Fast at beginning
           Slow at end
        */

        const eased =
            1 -
            Math.pow(
                1 - progress,
                4
            );


        currentRotation =
            startRotation +
            (
                finalRotation -
                startRotation
            ) * eased;


        drawWheel();


        if (progress < 1) {

            requestAnimationFrame(
                animate
            );

        } else {

            /* FINAL POSITION */

            currentRotation =
                finalRotation;

            drawWheel();


            /* SHOW WINNER */

            showResult(winner);


            spinning = false;

            button.disabled = false;
        }
    }


    requestAnimationFrame(
        animate
    );
}


/* =========================
   SHOW RESULT
========================= */

function showResult(number) {

    const result =
        document.getElementById(
            "result"
        );


    result.innerHTML = `
        🎯 NUMBER ${number}
        <br>
        <span>It's your turn!</span>
    `;
}


/* =========================
   RESET GAME
========================= */

function resetGame() {

    currentRotation = 0;

    spinning = false;


    document
        .getElementById("gameScreen")
        .classList.add("hidden");


    document
        .getElementById("setupScreen")
        .classList.remove("hidden");


    document.getElementById(
        "result"
    ).innerHTML = "";
}


/* =========================
   PHONE RESIZE
========================= */

window.addEventListener(
    "resize",
    function () {

        if (
            !document
                .getElementById("gameScreen")
                .classList
                .contains("hidden")
        ) {

            resizeWheel();
            drawWheel();
        }
    }
);
