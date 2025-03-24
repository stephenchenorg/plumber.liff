// Initialize LIFF
liff.init({liffId: "1656789862-en7LEa1L"})
    .then(async () => {
        console.log('LIFF initialized');
        // Check if user is logged in
        if (!liff.isLoggedIn()) {
            liff.login();
        } else {
            // User is already logged in, get profile
            await getUserProfile();
        }
    })
    .catch((err) => {
        console.error('LIFF initialization failed', err);
    });

// Get user profile
async function getUserProfile() {
    try {
        const profile = await liff.getProfile();
        document.getElementById('profileImage').src = profile.pictureUrl;
        document.getElementById('profileName').textContent = profile.displayName;
        document.getElementById('profileStatus').textContent = 'Logged in successfully';
    } catch (err) {
        console.error('Error getting profile:', err);
        document.getElementById('profileStatus').textContent = 'Error getting profile';
    }
}

// Validate phone number
function validatePhoneNumber(phone) {
    // Basic phone number validation (you can modify this regex based on your needs)
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

// Submit user data
async function submitUserData() {
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const phoneError = document.getElementById('phoneError');

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
        phoneError.style.display = 'block';
        return;
    }

    phoneError.style.display = 'none';

    try {
        const profile = await liff.getProfile();
        const response = await fetch('https://adminpanel.yijia.services/api/sync/line/user', {
            method: 'POST',
            // mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: profile.userId,
                displayName: profile.displayName,
                pictureUrl: profile.pictureUrl,
                statusMessage: profile.statusMessage,
                phoneNumber: phoneNumber,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data sent successfully:', data);
        document.getElementById('profileStatus').textContent = 'Information submitted successfully';

        // Clear the phone input
        document.getElementById('phoneNumber').value = '';
    } catch (err) {
        console.error('Error submitting data:', err);
        document.getElementById('profileStatus').textContent = 'Error submitting information';
    }
}

// Send message
async function sendMessage() {
    try {
        if (!liff.isInClient()) {
            alert('This feature is only available in LINE app');
            return;
        }

        await liff.sendMessages([
            {
                type: 'text',
                text: 'Hello from LIFF app!'
            }
        ]);
        document.getElementById('profileStatus').textContent = 'Message sent successfully';
    } catch (err) {
        console.error('Error sending message:', err);
        document.getElementById('profileStatus').textContent = 'Error sending message';
    }
} 