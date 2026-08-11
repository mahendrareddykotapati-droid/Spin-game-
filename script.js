function createParticipants() {

    const count = document.getElementById("participantCount").value;

    const participantsDiv = document.getElementById("participants");

    participantsDiv.innerHTML = "";

    for (let i = 1; i <= count; i++) {

        const input = document.createElement("input");

        input.type = "text";
        input.placeholder = "Participant " + i;

        participantsDiv.appendChild(input);
    }
}
