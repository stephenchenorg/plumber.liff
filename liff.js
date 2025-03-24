// Initialize LIFF
liff.init({ liffId: "1656789862-en7LEa1L" })
    .then(async () => {
        console.log('LIFF initialized');
        // Check if user is logged in
        if (!liff.isLoggedIn()) {
            liff.login();
        } else {
            // User is already logged in, send webhook
            await sendLoginWebhook();
        }
    })
    .catch((err) => {
        console.error('LIFF initialization failed', err);
    });

// Send login webhook to server
async function sendLoginWebhook() {
    try {
        const profile = await liff.getProfile();
        const response = await fetch('https://adminpanel.yijia.services/api/sync/line/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: profile.userId,
                displayName: profile.displayName,
                pictureUrl: profile.pictureUrl,
                statusMessage: profile.statusMessage,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Webhook sent successfully:', data);
        document.getElementById('profileStatus').textContent = 'Logged in and webhook sent';
    } catch (err) {
        console.error('Error sending webhook:', err);
        document.getElementById('profileStatus').textContent = 'Error sending webhook';
    }
}

// Get user profile
async function getUserProfile() {
    try {
        const profile = await liff.getProfile();
        document.getElementById('profileImage').src = profile.pictureUrl;
        document.getElementById('profileName').textContent = profile.displayName;
        document.getElementById('profileStatus').textContent = 'Logged in successfully';
        
        // Send webhook when profile is retrieved
        await sendLoginWebhook();
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