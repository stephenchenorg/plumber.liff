// Initialize LIFF
liff.init({ liffId: "1656789862-en7LEa1L" })
    .then(() => {
        console.log('LIFF initialized');
        // Check if user is logged in
        if (!liff.isLoggedIn()) {
            liff.login();
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