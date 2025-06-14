async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const message = inputField.value;
    if (!message.trim()) return;

    appendMessage("You", message);
    inputField.value = "";

    const response = await fetch("/get", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
    });

    const data = await response.json();
    appendMessage("Bot", data.reply);
}

function appendMessage(sender, message) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.textContent = `${sender}: ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
