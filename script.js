document.getElementById('registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    // Collect form inputs
    const userDetails = document.getElementById('userDetails').value;
    const username = document.getElementById('username').value;
    const plainPassword = document.getElementById('password').value;
    const encryptionKeyBase = document.getElementById('encryptionKeyBase').value;

    // Send data to the backend
    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userDetails, username, plainPassword, encryptionKeyBase })
        });

        const result = await response.json();
        const messageElement = document.getElementById('message');
        if (response.ok) {
            messageElement.textContent = "Registration Successful. IPFS Hash: " + result.ipfsHash;
            messageElement.style.color = "green";
        } else {
            messageElement.textContent = "Registration Failed: " + result.error;
            messageElement.style.color = "red";
        }
    } catch (error) {
        console.error("Error during registration:", error);
        document.getElementById('message').textContent = "An error occurred. Please try again.";
        document.getElementById('message').style.color = "red";
    }
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    // Collect form inputs
    const username = document.getElementById('loginUsername').value;
    const plainPassword = document.getElementById('loginPassword').value;
    const encryptionKeyBase = document.getElementById('loginEncryptionKeyBase').value;

    // Send data to the backend
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, plainPassword, encryptionKeyBase })
        });

        const result = await response.json();
        const messageElement = document.getElementById('loginMessage');
        if (response.ok) {
            messageElement.textContent = "Login Successful";
            messageElement.style.color = "green";
        } else {
            messageElement.textContent = "Login Failed: " + result.error;
            messageElement.style.color = "red";
        }
    } catch (error) {
        console.error("Error during login:", error);
        document.getElementById('loginMessage').textContent = "An error occurred. Please try again.";
        document.getElementById('loginMessage').style.color = "red";
    }
});
