const lengthSlider = document.getElementById("length");
const lenValue = document.getElementById("lenValue");

lenValue.textContent = lengthSlider.value;

lengthSlider.addEventListener("input", () => {
    lenValue.textContent = lengthSlider.value;
});

function generatePassword() {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const passwordLength = lengthSlider.value;
    let password = "";

    // Using a typed array for better cryptographic randomness
    const randomValues = new Uint32Array(passwordLength);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < passwordLength; i++) {
        password += characters[randomValues[i] % characters.length];
    }

    document.getElementById("password").value = password;
    updateSecurityMetrics(password, characters.length);
    showMessage("Password generated successfully!");
}

function updateSecurityMetrics(password, poolSize) {
    const strengthBar = document.getElementById("strengthBar");
    const strengthText = document.getElementById("strengthText");
    const crackTimeText = document.getElementById("crackTimeText");

    // Entropy calculation: E = L * log2(R)
    const entropy = password.length * Math.log2(poolSize);
    
    let strength = "Weak";
    let color = "#ef4444";
    let width = "25%";

    if (entropy > 80) {
        strength = "Very Strong";
        color = "#10b981";
        width = "100%";
    } else if (entropy > 60) {
        strength = "Strong";
        color = "#22c55e";
        width = "75%";
    } else if (entropy > 40) {
        strength = "Medium";
        color = "#f59e0b";
        width = "50%";
    }

    strengthBar.style.width = width;
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = `Strength: ${strength}`;
    strengthText.style.color = color;

    // Estimate crack time (assuming 100 Billion guesses/sec for a powerful rig)
    const combinations = Math.pow(poolSize, password.length);
    const secondsToCrack = combinations / 100_000_000_000;
    crackTimeText.textContent = `Estimated crack time: ${formatTime(secondsToCrack)}`;
}

function formatTime(seconds) {
    if (seconds < 1) return "Instantly";
    if (seconds < 60) return "A few seconds";
    if (seconds < 3600) return Math.floor(seconds / 60) + " minutes";
    if (seconds < 86400) return Math.floor(seconds / 3600) + " hours";
    if (seconds < 31536000) return Math.floor(seconds / 86400) + " days";
    if (seconds < 3153600000) return Math.floor(seconds / 31536000) + " years";
    return "Centuries";
}

function copyPassword() {
    const passwordField = document.getElementById("password");
    if (passwordField.value === "") {
        showMessage("Generate a password first!");
        return;
    }

    navigator.clipboard.writeText(passwordField.value);
    showMessage("Password Copied");
}

function showMessage(msg) {
    const message = document.getElementById("message");
    message.textContent = msg;
    message.classList.add("show");
    setTimeout(() => {
        message.classList.remove("show");
    }, 2000);
}
