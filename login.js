document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Collect login form data
    const loginUsername = document.getElementById('loginUsername').value;
    const loginPassword = document.getElementById('loginPassword').value;
    const encryptionKeyBase = "baseKeyForDerivation";  // Should be securely derived from user input

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: loginUsername, plainPassword: loginPassword, encryptionKeyBase })
        });

        const result = await response.json();
        const messageElement = document.getElementById('loginMessage');
        if (response.ok) {
            messageElement.textContent = "Login Successful";
            messageElement.style.color = "green";
        } else {
            messageElement.textContent = result.error;
            messageElement.style.color = "red";
        }
    } catch (error) {
        console.error("Error during login:", error);
        document.getElementById('loginMessage').textContent = "An error occurred. Please try again.";
        document.getElementById('loginMessage').style.color = "red";
    }
});
