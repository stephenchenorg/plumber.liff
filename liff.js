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
        
        // Initialize FAQ accordion functionality
        initializeFAQAccordion();
    })
    .catch((err) => {
        console.error('LIFF initialization failed', err);
    });

// Initialize FAQ accordion
function initializeFAQAccordion() {
    const faqItems = document.querySelectorAll('.order-item');
    
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Get user profile
async function getUserProfile() {
    try {
        const profile = await liff.getProfile();
        document.getElementById('profileImage').src = profile.pictureUrl;
        document.getElementById('profileName').textContent = profile.displayName;
        // document.getElementById('profileStatus').textContent = 'Logged in successfully';
    } catch (err) {
        console.error('Error getting profile:', err);
        document.getElementById('profileStatus').textContent = '取得 LINE 個人資料失敗';
    }
}

// Validate phone number
function validatePhoneNumber(phone) {
    // Basic phone number validation (you can modify this regex based on your needs)
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

// Switch sections
function switchSections(fromSection, toSection) {
    document.getElementById(fromSection).classList.remove('active');
    document.getElementById(toSection).classList.add('active');
}

// Fetch order history
async function fetchOrderHistory(userId) {
    try {
        const response = await fetch(`https://adminpanel.yijia.services/api/sync/line/user/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        data = data.data;
        displayDispatchesHistory(data.dispatch);
    } catch (err) {
        console.error('Error fetching order history:', err);
        document.getElementById('orderList').innerHTML = '<li class="order-item">無法載入訂單歷史</li>';
    }
}

// Display order history
function displayDispatchesHistory(dispatches) {
    console.log('dispatches');
    console.log(dispatches);
    const orderList = document.getElementById('orderList');
    if (!dispatches || dispatches.length === 0) {
        orderList.innerHTML = '<li class="order-item">尚無派工記錄</li>';
        return;
    }

    orderList.innerHTML = dispatches.map(dispatch => `
        <li class="order-item">
            <h3>派工編號: ${dispatch.inquiry_key}</h3>
            <div class="order-details">
                <p>派工日期: ${new Date(dispatch.created_at).toLocaleDateString()}</p>
                <p>派工狀態: ${dispatch.status}</p>
                <p>派工地址: ${dispatch.address}</p>
            </div>
        </li>
    `).join('');
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

        let data = await response.json();
        data = data.data;
        let levelText = data.level_label;
        console.log('Data sent successfully:', data);

        // Update success section with profile info
        document.getElementById('profileImageSuccess').src = profile.pictureUrl;
        document.getElementById('profileNameSuccess').textContent = profile.displayName;
        document.getElementById('profileStatusSuccess').textContent = '等級：' + levelText;

        // Switch to user profile section
        switchSections('phoneBindingSection', 'userProfileSection');

        // Fetch and display order history
        await fetchOrderHistory(profile.userId);
    } catch (err) {
        console.error('Error submitting data:', err);
        document.getElementById('profileStatus').textContent = '綁定失敗，請稍後再試';
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