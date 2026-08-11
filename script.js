const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

let numberOfParticipants = 10;
let currentRotation = 0;
let spinning = false;


/* CREATE WHEEL */

function createWheel() {

    const count = Number(
        document.getElementById("participantCount").value
    );

    if (count < 2 || count > 100) {

        alert("Please choose between 2 and 100 participants.");

        return;
    }

    numberOfParticipants = count;

    document
        .getElementById("setupScreen")
        .classList.add("hidden");

    document
        .getElementById("gameScreen")
        .classList.remove("hidden");

    resizeWheel();

    drawWheel();
}


/* RESIZE WHEEL */

function resizeWheel() {

    const size = Math.min(
        window.innerWidth * 0.9,
        500
    );

    canvas.width = size;
    canvas.height = size;
}


/* DRAW WHEEL */

function drawWheel() {

    const size = canvas.width;

    const center = size / 2;

    const radius = size / 2 - 5;

    const anglePerSection =
        (2 * Math.PI) /
        numberOfParticipants;


    ctx.clearRect(
        0,
        0,
        size,
        size
    );


    for (
        let i = 0;
        i < numberOfParticipants;
        i++
    ) {

        const startAngle =
            -Math.PI / 2 +
            i * anglePerSection +
            currentRotation;

        const endAngle =
            startAngle +
            anglePerSection;


        /* BLUE → WHITE → GREEN */

        const colors = [
            "#2563eb",  // Blue
            "#ffffff",  // White
            "#16a34a"   // Green
        ];

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

        ctx.strokeStyle = "black";

        ctx.lineWidth = 2;

        ctx.stroke();


        /* NUMBER POSITION */

        const middleAngle =
            startAngle +
            anglePerSection / 2;

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

        ctx.rotate(
            middleAngle +
            Math.PI / 2
        );


        let fontSize;

        if (numberOfParticipants <= 20) {

            fontSize = 24;

        } else if (numberOfParticipants <= 50) {

            fontSize = 16;

        } else {

            fontSize = 11;
        }


        ctx.font =
            `bold ${fontSize}px Arial`;


        /* BLACK ON WHITE,
           WHITE ON BLUE/GREEN */

        if (i % 3 === 1) {

            ctx.fillStyle = "black";

        } else {

            ctx.fillStyle = "white";
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

    ctx.strokeStyle = "black";

    ctx.lineWidth = 5;

    ctx.stroke();


    /* CENTER CIRCLE */

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

    ctx.strokeStyle = "white";

    ctx.lineWidth = 3;

    ctx.stroke();
}


/* SPIN WHEEL */

function spinWheel() {

    if (spinning) return;

    spinning = true;


    const button =
        document.getElementById("spinButton");

    button.disabled = true;


    document.getElementById(
        "result"
    ).innerHTML = "";


    /* RANDOM WINNER */

    const winner =
        Math.floor(
            Math.random() *
            numberOfParticipants
        ) + 1;


    const sectionAngle =
        (2 * Math.PI) /
        numberOfParticipants;


    /*
       Calculate the rotation
       required to put the
       selected number under
       the red pointer.
    */

    const targetAngle =
        -(
            (winner - 1) *
            sectionAngle +
            sectionAngle / 2
        );


    /* NUMBER OF FULL SPINS */

    const extraSpins =
        6 * 2 * Math.PI;


    const startRotation =
        currentRotation;


    const finalRotation =
        targetAngle +
        extraSpins;


    const duration = 5000;

    const startTime =
        performance.now();


    function animate(time) {

        const elapsed =
            time - startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        /* SMOOTH SLOW-DOWN */

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

            currentRotation =
                finalRotation;

            drawWheel();

            showResult(winner);

            spinning = false;

            button.disabled = false;
        }
    }


    requestAnimationFrame(
        animate
    );
}


/* SHOW RESULT */

function showResult(number) {

    const result =
        document.getElementById(
            "result"
        );

    result.innerHTML =
        `🎯 NUMBER ${number}<br>
        <span>It's your turn!</span>`;
}


/* RESET GAME */

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


/* HANDLE PHONE RESIZING */

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
