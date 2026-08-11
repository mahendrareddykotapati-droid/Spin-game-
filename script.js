function createGame() {

    const count = Number(
        document.getElementById("participantCount").value
    );

    const gameSetup = document.getElementById("gameSetup");

    gameSetup.innerHTML = "";

    if (count < 2 || count > 30) {
        gameSetup.innerHTML =
            "<p>Please choose between 2 and 30 participants.</p>";
        return;
    }

    const title = document.createElement("h2");
    title.textContent = "Your Numbers";

    gameSetup.appendChild(title);

    const info = document.createElement("p");
    info.textContent =
        "Each person takes one number. Keep your number in mind!";
    
    gameSetup.appendChild(info);

    const numberList = document.createElement("div");
    numberList.id = "numberList";

    for (let i = 1; i <= count; i++) {

        const numberBox = document.createElement("span");

        numberBox.textContent = i;

        numberBox.className = "number-box";

        numberList.appendChild(numberBox);
    }

    gameSetup.appendChild(numberList);

    const startButton = document.createElement("button");

    startButton.textContent = "🎡 START GAME";

    startButton.onclick = startGame;

    gameSetup.appendChild(startButton);
}


function startGame() {

    const gameSetup = document.getElementById("gameSetup");

    gameSetup.innerHTML = `
        <h2>🎡 Ready?</h2>

        <p>
            Everyone has chosen their number.
        </p>

        <p>
            Press SPIN when everyone is ready!
        </p>

        <button onclick="spinWheel()">
            🎡 SPIN
        </button>

        <div id="result"></div>
    `;
}


function spinWheel() {

    const count = Number(
        document.getElementById("participantCount").value
    );

    const selectedNumber =
        Math.floor(Math.random() * count) + 1;

    const result = document.getElementById("result");

    result.innerHTML = `
        <h2>🎯 Number ${selectedNumber}</h2>
        <p>It's your turn!</p>
    `;
}
