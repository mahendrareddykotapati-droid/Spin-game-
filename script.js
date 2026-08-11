function spinWheel() {

    if (spinning) {
        return;
    }

    spinning = true;

    const button =
        document.getElementById("spinButton");

    button.disabled = true;

    document.getElementById("result").innerHTML = "";


    /* =========================
       CHOOSE RANDOM NUMBER
    ========================= */

    const winner =
        Math.floor(
            Math.random() * numberOfParticipants
        ) + 1;


    /* ANGLE OF ONE SECTION */

    const sectionAngle =
        (2 * Math.PI) / numberOfParticipants;


    /*
       Find the angle needed to place
       the CENTER of the selected section
       exactly under the red pointer.
    */

    const winnerAngle =
        (winner - 1) * sectionAngle +
        sectionAngle / 2;


    /*
       Current wheel position.
       Convert it into a clean
       0 → 2π range.
    */

    const twoPi = 2 * Math.PI;

    let currentNormalized =
        currentRotation % twoPi;

    if (currentNormalized < 0) {
        currentNormalized += twoPi;
    }


    /*
       Rotation required to bring
       the selected number to the
       red pointer at the top.
    */

    let targetRotation =
        -winnerAngle;


    /*
       Make target rotation relative
       to the CURRENT wheel position.
    */

    let rotationDifference =
        targetRotation -
        currentNormalized;


    /*
       Always move forward.
    */

    rotationDifference =
        rotationDifference % twoPi;

    if (rotationDifference < 0) {
        rotationDifference += twoPi;
    }


    /*
       ALWAYS make at least 10
       COMPLETE rotations.

       This makes every spin
       visibly rotate, even when
       there are 50, 60 or 100
       participants.
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


    /* =========================
       10 SECOND ANIMATION
    ========================= */

    const duration = 10000;

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
           Smooth ease-out.

           Fast at first,
           gradually slows down,
           then stops.
        */

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

            /*
               Save the exact final
               position for the next spin.
            */

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
