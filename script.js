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
        (2 * Math.PI) /
        numberOfParticipants;


    ctx.clearRect(
        0,
        0,
        size,
        size
    );


    /* =========================
       WHEEL COLORS

       BLUE → WHITE → GREEN
    ========================= */

    const colors = [
        "#2563eb",
        "#ffffff",
        "#16a34a"
    ];


    /* =========================
       DRAW SECTIONS
    ========================= */

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


        /* DRAW SECTION */

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


        /* =========================
           NUMBER POSITION
        ========================= */

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


        /* =========================
           NUMBER STYLE
        ========================= */

        ctx.save();

        ctx.translate(
            x,
            y
        );


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


        /*
           WHITE AREA → BLACK NUMBER

           BLUE/GREEN → WHITE NUMBER
        */

        if (i % 3 === 1) {

            ctx.fillStyle = "#000000";

        } else {

            ctx.fillStyle = "#ffffff";
        }


        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";


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

    ctx.strokeStyle =
        "#000000";

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

    ctx.fillStyle =
        "#111827";

    ctx.fill();


    ctx.strokeStyle =
        "#ffffff";

    ctx.lineWidth = 3;

    ctx.stroke();
}


/* =========================
   SPIN WHEEL
========================= */

function spinWheel() {

    /*
       Don't allow another spin
       while the wheel is spinning.
    */

    if (spinning) {
        return;
    }


    spinning = true;


    const button =
        document.getElementById(
            "spinButton"
        );


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


    /* =========================
       SECTION ANGLE
    ========================= */

    const sectionAngle =
        (2 * Math.PI) /
        numberOfParticipants;


    /* =========================
       WINNER ANGLE
    =========================

       Find the center of the
       selected number's section.
    */

    const winnerAngle =
        (winner - 1) *
        sectionAngle +
        sectionAngle / 2;


    const twoPi =
        2 * Math.PI;


    /* =========================
       CURRENT POSITION
    ========================= */

    let currentNormalized =
        currentRotation % twoPi;


    if (currentNormalized < 0) {

        currentNormalized += twoPi;
    }


    /* =========================
       TARGET POSITION
    ========================= */

    const targetRotation =
        -winnerAngle;


    /*
       Calculate how far we need
       to rotate from the current
       position to the winner.
    */

    let rotationDifference =
        targetRotation -
        currentNormalized;


    rotationDifference =
        rotationDifference % twoPi;


    if (rotationDifference < 0) {

        rotationDifference += twoPi;
    }


    /* =========================
       MINIMUM 10 FULL SPINS
    ========================= */

    const fullSpins = 10;


    const fullRotation =
        fullSpins * twoPi;


    /*
       Total movement:

       10 complete rotations
       +
       required movement to winner
    */

    const totalRotation =
        fullRotation +
        rotationDifference;


    const startRotation =
        currentRotation;


    const finalRotation =
        startRotation +
        totalRotation;


    /* =========================
       10 SECOND ANIMATION
    ========================= */

    const duration =
        10000;


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


        /* =========================
           EASE OUT

           Fast → Slow → Stop
        ========================= */

        const eased =
            1 -
            Math.pow(
                1 - progress,
                4
            );


        currentRotation =
            startRotation +
            totalRotation *
            eased;


        drawWheel();


        /* CONTINUE ANIMATION */

        if (progress < 1) {

            requestAnimationFrame(
                animate
            );

        } else {

            /* =========================
               FINAL POSITION
            ========================= */

            currentRotation =
                finalRotation;


            drawWheel();


            /* SHOW RESULT */

            showResult(
                winner
            );


            /* ENABLE SPIN */

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
        .getElementById(
            "gameScreen"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "setupScreen"
        )
        .classList
        .remove("hidden");


    document.getElementById(
        "result"
    ).innerHTML = "";
}


/* =========================
   HANDLE SCREEN RESIZE
========================= */

window.addEventListener(
    "resize",
    function () {

        if (
            !document
                .getElementById(
                    "gameScreen"
                )
                .classList
                .contains("hidden")
        ) {

            resizeWheel();

            drawWheel();
        }
    }
);
