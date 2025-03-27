// Initialize LIFF
liff.init({liffId: "2007125335-DGNa7lNX"})
    .then(async () => {
        // Check if user is logged in
        fetchOrderHistory('U3e2c3c067be07cd9cf83e3509b267564')

        // if (!liff.isLoggedIn()) {
            // liff.login();
        // } else {
            // User is already logged in, get profile
            // await getUserProfile();
        // }
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
        // https://adminpanel.yijia.services/api/sync/line/user/U3e2c3c067be07cd9cf83e3509b267564
        // const response = await fetch(`https://adminpanel.yijia.services/api/sync/line/user/${userId}`);
        const response = await fetch('data.json');
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
    const data = document.getElementById('dispatches');
    if (!dispatches || dispatches.length === 0) {
        data.innerHTML = '<div class="text-center py-4">尚無派工記錄</div>';
        return;
    }

    data.innerHTML = dispatches.map(dispatch => `
        <div class="my-2" x-data="{ open: false }">
            <!-- 切換按鈕 -->
            <button
                @click="open = !open"
                class="w-full flex justify-between items-center bg-gradient-to-r from-[#0072C6] to-[#005A9C] text-white py-2 px-4 rounded-t-lg"
            >
                <span class="text-sm">${dispatch.created_at.slice(0, 10)} | ${dispatch.inquiry_key}</span>
                
                <!-- Chevron Icon -->
                <svg
                    :class="{ 'rotate-180': open }"
                    class="w-5 h-5 transform transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
            
            <!-- 收合區塊 -->
            <div
                x-show="open"
                x-transition:enter="transition-all duration-500 ease-in-out"
                x-transition:enter-start="max-h-0 opacity-0"
                x-transition:enter-end="max-h-[1000px] opacity-100"
                x-transition:leave="transition-all duration-500 ease-in-out"
                x-transition:leave-start="max-h-[1000px] opacity-100"
                x-transition:leave-end="max-h-0 opacity-0"
                class="overflow-hidden border-2 border-[#007BC2] rounded-b-lg mb-2"
            >
                <ul class="p-4">
                    <li class="w-full flex mb-2">
                        <div class="w-[120px] mr-2">派工單號</div>
                        <p>${dispatch.inquiry_key}</p>
                    </li>
                    <li class="w-full flex mb-2">
                        <div class="w-[120px] mr-2">狀態</div>
                        <p>${dispatch.status_label}</p>
                    </li>
                    <li class="w-full flex mb-2">
                        <div class="w-[120px] mr-2">地址</div>
                        <p>${dispatch.address || 'N/A'}</p>
                    </li>
                    <li class="w-full flex mb-2">
                        <div class="w-[120px] mr-2">總價</div>
                        <p>${dispatch.amount_total || 'N/A'}</p>
                    </li>
                    <li class="w-full flex mb-2">
                        <div class="w-[120px] mr-2">維修內容</div>
                        <p class="flex-1">${dispatch.dispatch_details.map(detail => detail.item).join(', ') || 'N/A'}</p>
                    </li>
                </ul>
            </div>
        </div>
    `).join('');
}

// Submit user data
async function submitUserData() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    const phoneError = document.getElementById('phoneError');
    const phoneBindingSection = document.getElementById('phone-binding-section');
    const userProfileSection = document.getElementById('user-profile-section');

    // Validate phone number format
    if (!validatePhoneNumber(phoneNumber)) {
        phoneError.classList.remove('hidden');
        return;
    }

    const profile = await liff.getProfile();
    try {
        const response = await fetch('https://adminpanel.yijia.services/api/sync/line/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
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

        if (response.ok) {
            // Hide phone binding section and show user profile section
            phoneBindingSection.classList.add('hidden');
            userProfileSection.classList.remove('hidden');

            let data = await response.json();
            data = data.data;


            let timestamp = new Date(data.created_at).getTime();
            const padded = String(timestamp).padStart(16, '0');
            document.getElementById('holder').textContent = padded.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
            document.getElementById('name').textContent = profile.displayName;
            document.getElementById('level').textContent = data.level_label;

            // Get and display user data
            await fetchOrderHistory(profile.userId);
        } else {
            console.error('Failed to update phone number');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}