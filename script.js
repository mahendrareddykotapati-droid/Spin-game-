/* =========================================
   SPIN CHALLENGE - COMPLETE SCRIPT
========================================= */


/* =========================================
   VARIABLES
========================================= */

let canvas = null;
let ctx = null;

let numberOfParticipants = 10;

let currentRotation = 0;

let spinning = false;


/* =========================================
   INITIALIZE
========================================= */

function initializeGame() {

    canvas =
        document.getElementById("wheel");

    if (canvas) {

        ctx =
            canvas.getContext("2d");
    }
}


/* =========================================
   CREATE WHEEL
========================================= */

function createWheel() {

    initializeGame();

    const input =
        document.getElementById(
            "participantCount"
        );

    if (!input) {

        alert(
            "Participant input not found."
        );

        return;
    }


    const count =
        Number(input.value);


    /* PARTICIPANT LIMIT */

    if (
        count < 2 ||
        count > 100
    ) {

        alert(
            "Please choose between 2 and 100 participants."
        );

        return;
    }


    numberOfParticipants =
        count;


    /* RESET ROTATION */

    currentRotation = 0;


    const setupScreen =
        document.getElementById(
            "setupScreen"
        );

    const gameScreen =
        document.getElementById(
            "gameScreen"
        );


    if (
        !setupScreen ||
        !gameScreen
    ) {

        alert(
            "Game screen is missing from index.html."
        );

        return;
    }


    /* HIDE SETUP */

    setupScreen
        .classList
        .add("hidden");


    /* SHOW GAME */

    gameScreen
        .classList
        .remove("hidden");


    /* DRAW WHEEL */

    resizeWheel();

    drawWheel();
}


/* =========================================
   RESIZE WHEEL
========================================= */

function resizeWheel() {

    initializeGame();


    if (!canvas) {
        return;
    }


    const size =
        Math.min(
            window.innerWidth * 0.9,
            500
        );


    canvas.width =
        size;

    canvas.height =
        size;
}


/* =========================================
   DRAW WHEEL
========================================= */

function drawWheel() {

    initializeGame();


    if (
        !canvas ||
        !ctx
    ) {

        return;
    }


    const size =
        canvas.width;


    const center =
        size / 2;


    const radius =
        size / 2 - 5;


    const twoPi =
        2 * Math.PI;


    const sectionAngle =
        twoPi /
        numberOfParticipants;


    /* CLEAR CANVAS */

    ctx.clearRect(
        0,
        0,
        size,
        size
    );


    /* =====================================
       COLORS

       BLUE → WHITE → GREEN
    ===================================== */

    const colors = [

        "#2563eb",

        "#ffffff",

        "#16a34a"

    ];


    /* =====================================
       DRAW EACH SECTION
    ===================================== */

    for (
        let i = 0;
        i < numberOfParticipants;
        i++
    ) {


        /*
           Start at top of wheel.
        */

        const startAngle =
            -Math.PI / 2 +
            currentRotation +
            i * sectionAngle;


        const endAngle =
            startAngle +
            sectionAngle;


        /* =================================
           SECTION COLOR
        ================================= */

        ctx.fillStyle =
            colors[i % 3];


        /* =================================
           DRAW SECTION
        ================================= */

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


        /* =================================
           SECTION BORDER
        ================================= */

        ctx.strokeStyle =
            "#000000";


        ctx.lineWidth =
            1.5;


        ctx.stroke();


        /* =================================
           NUMBER POSITION
        ================================= */

        const middleAngle =
            startAngle +
            sectionAngle / 2;


        const textRadius =
            radius * 0.72;


        const x =
            center +
            Math.cos(
                middleAngle
            ) *
            textRadius;


        const y =
            center +
            Math.sin(
                middleAngle
            ) *
            textRadius;


        /* =================================
           NUMBER FONT
        ================================= */

        let fontSize;


        if (
            numberOfParticipants <= 20
        ) {

            fontSize = 24;

        }

        else if (
            numberOfParticipants <= 40
        ) {

            fontSize = 17;

        }

        else if (
            numberOfParticipants <= 70
        ) {

            fontSize = 12;

        }

        else {

            fontSize = 9;
        }


        /* =================================
           DRAW NUMBER
        ================================= */

        ctx.save();


        ctx.translate(
            x,
            y
        );


        ctx.font =
            `bold ${fontSize}px Arial`;


        /*
           WHITE SECTION:
           BLACK NUMBER

           BLUE/GREEN:
           WHITE NUMBER
        */

        if (
            i % 3 === 1
        ) {

            ctx.fillStyle =
                "#000000";

        }

        else {

            ctx.fillStyle =
                "#ffffff";
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


    /* =====================================
       OUTER CIRCLE
    ===================================== */

    ctx.beginPath();


    ctx.arc(
        center,
        center,
        radius,
        0,
        twoPi
    );


    ctx.strokeStyle =
        "#000000";


    ctx.lineWidth =
        5;


    ctx.stroke();


    /* =====================================
       CENTER CIRCLE
    ===================================== */

    ctx.beginPath();


    ctx.arc(
        center,
        center,
        25,
        0,
        twoPi
    );


    ctx.fillStyle =
        "#111827";


    ctx.fill();


    ctx.strokeStyle =
        "#ffffff";


    ctx.lineWidth =
        3;


    ctx.stroke();
}


/* =========================================
   SPIN WHEEL
========================================= */

function spinWheel() {

    initializeGame();


    /* DON'T SPIN TWICE */

    if (spinning) {

        return;
    }


    if (
        !canvas ||
        !ctx
    ) {

        alert(
            "Wheel could not be found."
        );

        return;
    }


    spinning = true;


    /* =====================================
       DISABLE SPIN BUTTON
    ===================================== */

    const button =
        document.getElementById(
            "spinButton"
        );


    if (button) {

        button.disabled =
            true;
    }


    /* CLEAR OLD RESULT */

    const result =
        document.getElementById(
            "result"
        );


    if (result) {

        result.innerHTML =
            "";
    }


    /* =====================================
       CHOOSE RANDOM WINNER
    ===================================== */

    const winner =
        Math.floor(
            Math.random() *
            numberOfParticipants
        ) + 1;


    /* =====================================
       SECTION ANGLE
    ===================================== */

    const twoPi =
        2 * Math.PI;


    const sectionAngle =
        twoPi /
        numberOfParticipants;


    /* =====================================
       WINNER CENTER ANGLE

       This finds the center of
       the selected number's section.
    ===================================== */

    const winnerAngle =
        (winner - 1) *
        sectionAngle +
        sectionAngle / 2;


    /* =====================================
       CURRENT ROTATION
    ===================================== */

    let currentNormalized =
        currentRotation %
        twoPi;


    if (
        currentNormalized < 0
    ) {

        currentNormalized +=
            twoPi;
    }


    /* =====================================
       TARGET ROTATION

       The pointer is at the TOP.

       Therefore the selected number
       must finish at the top.
    ===================================== */

    const targetRotation =
        -winnerAngle;


    /* =====================================
       FIND ROTATION DIFFERENCE
    ===================================== */

    let rotationDifference =
        targetRotation -
        currentNormalized;


    rotationDifference =
        rotationDifference %
        twoPi;


    if (
        rotationDifference < 0
    ) {

        rotationDifference +=
            twoPi;
    }


    /* =====================================
       MINIMUM 10 COMPLETE ROTATIONS
    ===================================== */

    const fullSpins =
        10;


    const fullRotation =
        fullSpins *
        twoPi;


    /*
       Total movement:

       10 complete rotations
       +
       exact movement needed
       to reach winner
    */

    const totalRotation =
        fullRotation +
        rotationDifference;


    /* =====================================
       START AND END
    ===================================== */

    const startRotation =
        currentRotation;


    const finalRotation =
        startRotation +
        totalRotation;


    /* =====================================
       SPIN DURATION

       10 SECONDS
    ===================================== */

    const duration =
        10000;


    const startTime =
        performance.now();


    /* =====================================
       ANIMATION
    ===================================== */

    function animate(
        currentTime
    ) {


        const elapsed =
            currentTime -
            startTime;


        let progress =
            elapsed /
            duration;


        if (
            progress > 1
        ) {

            progress = 1;
        }


        /* =================================
           SMOOTH EASE OUT

           Fast
             ↓
           Medium
             ↓
           Slow
             ↓
           Stop
        ================================= */

        const eased =
            1 -
            Math.pow(
                1 - progress,
                4
            );


        /* =================================
           CURRENT FRAME ROTATION
        ================================= */

        currentRotation =
            startRotation +
            totalRotation *
            eased;


        /* DRAW */

        drawWheel();


        /* =================================
           CONTINUE
        ================================= */

        if (
            progress < 1
        ) {

            requestAnimationFrame(
                animate
            );

        }


        /* =================================
           FINISHED
        ================================= */

        else {

            /*
               Set exact final position.
            */

            currentRotation =
                finalRotation;


            drawWheel();


            /* SHOW WINNER */

            showResult(
                winner
            );


            /* ENABLE BUTTON */

            spinning =
                false;


            if (button) {

                button.disabled =
                    false;
            }
        }
    }


    /* START ANIMATION */

    requestAnimationFrame(
        animate
    );
}


/* =========================================
   SHOW RESULT
========================================= */

function showResult(
    number
) {


    const result =
        document.getElementById(
            "result"
        );


    if (!result) {

        return;
    }


    result.innerHTML = `
        🎯 NUMBER ${number}
        <br>
        <span>It's your turn!</span>
    `;
}


/* =========================================
   RESET GAME
========================================= */

function resetGame() {


    /* RESET VALUES */

    currentRotation =
        0;


    spinning =
        false;


    /* GET SCREENS */

    const gameScreen =
        document.getElementById(
            "gameScreen"
        );


    const setupScreen =
        document.getElementById(
            "setupScreen"
        );


    /* HIDE GAME */

    if (gameScreen) {

        gameScreen
            .classList
            .add("hidden");
    }


    /* SHOW SETUP */

    if (setupScreen) {

        setupScreen
            .classList
            .remove("hidden");
    }


    /* CLEAR RESULT */

    const result =
        document.getElementById(
            "result"
        );


    if (result) {

        result.innerHTML =
            "";
    }


    /* ENABLE SPIN BUTTON */

    const button =
        document.getElementById(
            "spinButton"
        );


    if (button) {

        button.disabled =
            false;
    }
}


/* =========================================
   SCREEN RESIZE
========================================= */

window.addEventListener(
    "resize",
    function () {


        const gameScreen =
            document.getElementById(
                "gameScreen"
            );


        if (
            gameScreen &&
            !gameScreen
                .classList
                .contains("hidden")
        ) {


            resizeWheel();


            drawWheel();
        }
    }
);


/* =========================================
   PAGE LOADED
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeGame();
    }
);
