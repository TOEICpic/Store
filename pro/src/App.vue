<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Swal from 'sweetalert2';

const token = localStorage.getItem('token');
const isLoggedIn = ref(localStorage.getItem('token') !== null);
const router = useRouter();
const route = useRoute();
const searchQuery = ref('');
const allNames = ref([]);

const isDropdownOpen = ref(false);
const showChat = ref(false);

const user = ref({
  profilePicture: '',
  joinDate: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
});

const isAdmin = computed(() => user.value.role === 'admin');

// Computed property to check if the current path is /login or /logout
const showHeaderFooter = computed(() => !['/login', '/register'].includes(route.path));
const showHeader = computed(() => !['/login', '/register'].includes(route.path) && !isAdmin.value);
const showFooter = computed(() => !['/login', '/register', '/cart', '/pay'].includes(route.path) && !isAdmin.value);

const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No token found");
    }

    await axios.post('http://localhost:8800/api/v1/logout', null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    localStorage.removeItem('token');
    isLoggedIn.value = false;

    Swal.fire({
      icon: 'success',
      title: 'คุณได้ทำการออกจากระบบแล้ว',
      text: 'Log Out successful!',
      confirmButtonText: 'OK'
    }).then(() => {
      router.push('/login');
    });
  } catch (error) {
    console.error("Error during logout:", error.message || error);
    error.response && console.error("Server response:", error.response.data);

    Swal.fire({
      icon: 'error',
      title: 'ระบบเกิดข้อผิดพลาด',
      text: 'กรุณาลองใหม่อีกครั้ง',
      confirmButtonText: 'OK'
    }).then(() => {
      location.reload();
    });

    localStorage.removeItem('token');
    isLoggedIn.value = false;
  }
};

const fetchUserProfile = async () => {
  try {
    if (!token) {
      throw new Error("Token not found.");
    }

    const decoded = jwt_decode(token);
    const userId = decoded.user_id;

    const response = await axios.get(`http://localhost:8800/api/v1/customers/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const users = response.data;
    user.value = {
      username: users.email || users.phone,
      firstName: users.first_name,
      lastName: users.last_name,
      role: users.role, // Ensure role is included in the user data
    };
    isLoggedIn.value = true;

    // Redirect if the role is admin
    if (user.value.role === 'admin') {
      router.push('/admin');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    alert('Failed to load profile data');
  }
};

const fetchNames = async () => {
  try {
    const response = await axios.get('http://localhost:8800/api/v1/products');
    // Assume each product has a "name" field; adjust if necessary
    allNames.value = response.data.map(product => ({ id: product.product_id, name: product.name }));
  } catch (error) {
    console.error("Error fetching names:", error);
  }
};

// Filter results based on search query
const filteredResults = computed(() => {
  if (!searchQuery.value) return [];
  return allNames.value.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleChat = () => {
  showChat.value = !showChat.value;
};

const appendMessage = (type, message) => {
  const chatBody = document.getElementById("chatBody");
  const messageElement = document.createElement("p");
  messageElement.classList.add(type);
  messageElement.innerText = message;
  chatBody.appendChild(messageElement);
  chatBody.scrollTop = chatBody.scrollHeight;
};

const getBotReply = (message) => {
  if (message.toLowerCase().includes("hello")) {
    return "Hi there! How can I help you?";
  } else if (message.toLowerCase().includes("price")) {
    return "Our prices vary depending on the product. Please specify the product you are interested in.";
  } else {
    return "I'm here to help! Could you clarify your question?";
  }
};

const sendMessage = () => {
  const userInput = document.getElementById("userInput");
  const message = userInput.value.trim();

  if (message) {
    appendMessage("user-message", message);
    userInput.value = "";

    setTimeout(() => {
      const botReply = getBotReply(message);
      appendMessage("bot-message", botReply);
    }, 500);
  }
};

const navigateToProduct = (id) => {
  router.push(`/products/${id}`);
  searchQuery.value = '';  // Clear the search query
};

const handleKeyPress = (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
};

onMounted(() => {
  fetchNames();
  if (isLoggedIn.value) {
    fetchUserProfile(); 
  }

});
</script>

<template>
  <div>
    <header v-if="showHeaderFooter" class="header">
      <div class="logo">
        <a href="/home">
          <img src="./assets/images/logo.png" alt="Logo" />
          <span>ดี ดี Der</span>
        </a>
      </div>
      <div v-if="showHeader" class="search-bar">
        <input type="text" placeholder="Search" v-model="searchQuery" />
        <i class="fa fa-search"></i>
      </div>
      <div v-if="filteredResults.length">
        <!-- Display matching results -->
        <ul class="search-results">
          <li 
            v-for="result in filteredResults" 
            :key="result.id" 
            @click="navigateToProduct(result.id)"
            class="clickable-result"
          >
            {{ result.name }}
          </li>
        </ul>
      </div>
      <div v-else-if="searchQuery" class="no-results">
        ไม่พบชื่อที่คุณค้นหา
      </div>
      <div class="flex">
        <div class="auth-links" v-if="!isLoggedIn">
          <a href="/register">สมัครสมาชิก</a>
          <a href="/login">เข้าสู่ระบบ</a>
        </div>


        <div class="user-info" v-else>
          <span class="user-name" @click="toggleDropdown">
            <i class="fa fa-user-circle"></i>
            {{ user.firstName }} {{ user.lastName }}
            <span v-if="showHeader" class="dropdown-icon">▼</span>
          </span>
          <button class="logout-button" @click="logout">ออกจากระบบ</button>

          <!-- Dropdown Menu -->
          <div v-if="isDropdownOpen && showHeader" class="dropdown-menu">
            <a href="/profile?activeItem=2" class="dropdown-item">
              <i class="fa fa-user"></i> บัญชีของฉัน
            </a>
            <a href="/profile?activeItem=0" class="dropdown-item">
              <i class="fa fa-file-alt"></i> รายการสั่งซื้อของฉัน
            </a>
          </div>
        </div>
        <div class="user-cart" v-if="isLoggedIn && showHeader">
          <div class="option">
            <a href="/product">
              <center><i class="fa-solid fa-apple-whole"></i><br> สินค้า</center>
            </a>
          </div>
          <div class="option">
            <a href="/cart">
              <center><i class="fa fa-shopping-cart"></i> <br> ตะกร้าสินค้า</center>
            </a>
          </div>
          <div class="option">
            <a href="/profile?activeItem=0">
              <center><i class="fa fa-receipt"></i> <br> รายการสั่งซื้อ</center>
            </a>
          </div>
        </div>
      </div>
    </header>

    <nav v-if="showHeader" class="navbar">
      <ul>
        <a href="/vegtetable">
          <li>ผัก </li>
        </a>
        <a href="/fruit">
          <li>ผลไม้ </li>
        </a>
      </ul>
    </nav>

    <RouterView />

    <footer v-if="showFooter" class="footer">
      <div class="footer-content">
        <!-- <div class="footer-section">
          <h3>ติดต่อ</h3>
          <ul>
            <li><a href="#">แนะนำตลาด</a></li>
          </ul>
        </div> -->
      </div>
    </footer>

    <!-- <div id="chatbot-icon" v-if="showHeaderFooter" @click="toggleChat">
      <img src="./assets/images/logo.png" alt="Chat Icon" />
    </div>

    <div v-show="showChat" id="chat-popup">
      <div class="chat-header">
        <h3>Customer Support</h3>
        <button @click="toggleChat">X</button>
      </div>
      <div class="chat-body" id="chatBody">
        <p class="bot-message">Hello! How can I help you today?</p>
      </div>
      <div class="chat-footer">
        <input type="text" id="userInput" placeholder="Type your message..." @keypress="handleKeyPress" />
        <button @click="sendMessage">Send</button>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #d9534f;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #d9534f;
}

.logo a {
  text-decoration: none;
  color: #d9534f;
  display: flex;
  align-items: center;
}

.logo img {
  height: 50px;
  margin-right: 10px;
}

.search-bar {
  display: flex;
  align-items: center;
  width: 300px;
  max-width: 30%;
  position: relative;
  margin: 0 auto;
}

.search-bar input {
  width: 100%;
  padding: 8px 12px;
  padding-left: 35px;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.search-bar input:focus {
  border-color: #007bff;
}

.search-bar i {
  position: absolute;
  left: 12px;
  color: #999;
  font-size: 16px;
}

.search-results {
  position: absolute;
  top: 5.2%;
  left: 33%;
  width: 19%;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 0 0 5px 5px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.search-results li {
  list-style: none;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  color: #333;
  transition: background-color 0.3s;
}

.search-results li:hover {
  background-color: #f0f0f0;
}

.no-results {
  position: absolute;
  top: 7%;
  left: 34%;
  width: 20%;
  background-color: #fff;
  color: red;
  font-weight: bold;
  border: 1px solid #ddd;
  border-radius: 0 0 5px 5px;
  padding: 10px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.auth-links a {
  margin-left: 20px;
  color: #333;
  text-decoration: none;
  font-weight: bold;
}

.auth-links a:hover {
  color: #d9534f;
}

/* User Info Section */
.user-info {
  display: flex;
  align-items: center;
  position: relative;
  justify-content: end;
  padding-bottom: 20px;
}

.user-name {
  font-weight: bold;
  color: #007bff;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.user-name i {
  font-size: 20px;
  margin-right: 5px;
}

.dropdown-icon {
  font-size: 12px;
  margin-left: 5px;
}

.logout-button {
  background: none;
  border: none;
  color: #333;
  font-weight: bold;
  cursor: pointer;
  margin-left: 15px;
}

.logout-button:hover {
  color: #d9534f;
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 50%;
  left: 40%;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-top: 5px;
  width: 180px;
  z-index: 10;
  padding: 10px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f1f1f1;
}

.dropdown-item i {
  margin-right: 8px;
  color: #007bff;
}

/* Navigation Bar */
.navbar {
  background-color: #45a049;
  padding: 10px 0;
}

.navbar a {
  text-decoration: none;
}

.navbar ul {
  display: flex;
  list-style: none;
  gap: 15px;
  justify-content: start;
  padding: 0;
  padding-left: 100px;
  margin: 0;
}

.navbar ul li {
  color: white;
  cursor: pointer;
  padding: 8px 10px;
  position: relative;
  font-weight: bold;
}

.navbar ul li:hover {
  background-color: #b52b27;
  border-radius: 5px;
}

.navbar ul li i {
  margin-left: 5px;
}

.user-cart {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-cart .option {
  width: 90px;
  align-items: center;
  color: #333;
  font-size: 14px;
  justify-content: center;
}

.user-cart .option i {
  font-size: 24px;
  margin-bottom: 5px;
}

.user-cart .option a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.user-cart .option a:hover {
  color: #d9534f;
}

.option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.footer {
  background-color: #45a049;
  color: white;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  max-width: 1200px;
  width: 100%;
  justify-content: space-between;
}

.footer-section {
  flex: 1;
  min-width: 200px;
  margin: 10px;
}

.footer-section h3 {
  font-size: 18px;
  margin-bottom: 15px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-section ul li a {
  color: white;
  text-decoration: none;
  font-size: 14px;
}

.footer-section ul li a:hover {
  color: #ffccbc;
}

.footer-section p {
  font-size: 14px;
  line-height: 1.6;
}

.footer-section i {
  margin-right: 5px;
}

#chatbot-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #ff4d4d;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

#chatbot-icon img {
  width: 30px;
  height: 30px;
}

#chat-popup {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 300px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background-color: #ff4d4d;
  color: #fff;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-body {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.chat-footer {
  padding: 10px;
  border-top: 1px solid #ddd;
}

.chat-footer input[type="text"] {
  width: 80%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.chat-footer button {
  background-color: #ff4d4d;
  color: #fff;
  border: none;
  padding: 6px;
  cursor: pointer;
}
</style>
