// Initialize LIFF app
async function initializeLiff() {
    try {
        await liff.init({ liffId: "1656789862-en7LEa1L" });
        if (!liff.isLoggedIn()) {
            liff.login();
        } else {
            displayProfile();
        }
    } catch (err) {
        console.error('Error initializing LIFF:', err);
    }
}

// Display user profile
async function displayProfile() {
    try {
        const profile = await liff.getProfile();
        document.getElementById('profileImage').src = profile.pictureUrl;
        document.getElementById('profileName').textContent = profile.displayName;
        document.getElementById('profileStatus').textContent = '已登入';
    } catch (err) {
        console.error('Error getting profile:', err);
    }
}

// Handle category item clicks
document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', function() {
        const action = this.querySelector('.category-text').textContent;
        handleTransactionAction(action);
    });
});

// Handle different transaction actions
function handleTransactionAction(action) {
    switch(action) {
        case '臺幣轉帳':
            // Handle transfer action
            liff.openWindow({
                url: 'YOUR_TRANSFER_URL',
                external: true
            });
            break;
        case '臺幣帳戶明細':
            // Handle account details action
            showAccountDetails();
            break;
        case '預約轉帳查詢':
            // Handle scheduled transfers action
            showScheduledTransfers();
            break;
        case 'App 轉帳紀錄':
            // Handle transfer history action
            showTransferHistory();
            break;
    }
}

// Handle logout
function handleLogout() {
    if (liff.isLoggedIn()) {
        liff.logout();
        window.location.reload();
    }
}

// Initialize the app when the page loads
window.onload = initializeLiff;

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
        const orders = await response.json();
        displayOrderHistory(orders);
    } catch (err) {
        console.error('Error fetching order history:', err);
        document.getElementById('orderList').innerHTML = '<li class="order-item">無法載入訂單歷史</li>';
    }
}

// Display order history
function displayOrderHistory(orders) {
    const orderList = document.getElementById('orderList');
    if (!orders || orders.length === 0) {
        orderList.innerHTML = '<li class="order-item">尚無訂單記錄</li>';
        return;
    }

    orderList.innerHTML = orders.map(order => `
        <li class="order-item" onclick="toggleOrder(this)">
            <div class="order-header">
                <h3>訂單編號: ${order.order_number}</h3>
                <svg class="order-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 9l6 6 6-6"/>
                </svg>
            </div>
            <div class="order-details">
                <p>日期: ${new Date(order.created_at).toLocaleDateString()}</p>
                <p>狀態: <span class="order-status status-${order.status.toLowerCase()}">${order.status}</span></p>
                <p>總金額: <span class="order-amount">${order.total_amount}</span></p>
                ${order.description ? `<p>描述: ${order.description}</p>` : ''}
                ${order.address ? `<p>地址: ${order.address}</p>` : ''}
                ${order.notes ? `<p>備註: ${order.notes}</p>` : ''}
            </div>
        </li>
    `).join('');
}

// Toggle order details
function toggleOrder(element) {
    // Close all other orders
    const allOrders = document.querySelectorAll('.order-item');
    allOrders.forEach(order => {
        if (order !== element) {
            order.classList.remove('active');
        }
    });
    
    // Toggle current order
    element.classList.toggle('active');
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