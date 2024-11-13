<template>
  <div class="profile-page">
    <div class="profile-sidebar">
      <ul>
        <li>
          <h1>{{ user.firstName }} {{ user.lastName }}</h1>
        </li>
        <li v-for="(item, index) in menuItems" :key="index" :class="{ active: index === activeItem }"
          @click="setActiveItem(index)">
          {{ item }}
        </li>
      </ul>
    </div>

    <!-- Active Item 0: My Orders -->
    <div v-if="activeItem === 0" class="profile-content">
      <h2>รายการสั่งซื้อของฉัน</h2>
      <table class="orders-table">
        <thead>
          <tr>
            <th>วันที่จบการสั่งซื้อ</th>
            <th>เลขที่ใบสั่งซื้อ</th>
            <th>สถานะ</th>
            <th>รูปแบบการจัดส่ง</th>
            <th>ราคารวม</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredOrders.length === 0">
            <td colspan="4">ไม่มีข้อมูล</td>
          </tr>
          <tr v-for="(order, index) in filteredOrders" :key="index" @click="navigateToOrderDetails(order.order_id)"
            class="clickable-row">
            <td>{{ formatDate(order.orders.updated_at) }}</td>
            <td>{{ order.order_id }}</td>
            <td>
              {{
                order.orders.order_status === 'Pending' ? 'รอการชำระเงิน' :
                order.orders.order_status === 'Processing' ? 'กำลังดำเนินการ' : 
                order.orders.order_status === 'Completed' ? 'ชำระสำเร็จ' : 
                  'ยกเลิก'
              }}
            </td>
            <td>
              {{
                order.payment_method === 'QR_Code' ? 'QR Code' :
                order.payment_method === 'E-Banking' ? 'ธนาคาร' :
                order.payment_method === 'Credit_Card' ? 'บัตรเครดิต' :
                  'เก็บเงินปลายทาง'
              }}
            </td>
            <td>{{ order.amount }} บาท</td>
          </tr>
        </tbody>
      </table>

    </div>

    <!-- Active Item 1: Pending Payments -->
    <div v-if="activeItem === 1" class="profile-content">
      <h2>รายการสั่งซื้อรอชำระ</h2>
      <table class="orders-table">
        <thead>
          <tr>
            <th>รหัสสินค้า</th>
            <th>สถานะ</th>
            <th>ราคารวม</th>
            <th>วันที่จบการสั่งซื้อ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pendingOrders.length === 0">
            <td colspan="4">ไม่มีรายการรอชำระ</td>
          </tr>
          <tr v-for="order in pendingOrders" :key="order.id" @click="navigateToPayment(order.order_id)"
            class="clickable-row">
            <td>{{ order.order_id }}</td>
            <td>
              {{
                order.payment_status === 'Pending' ? 'รอการชำระเงิน' : 'รอการชำระเงิน',
                order.payment_status === 'Processing' ? 'กำลังดำเนินการ' : 'กำลังดำเนินการ',
                order.payment_status === 'Completed' ? 'เสร็จสิ้น' : 'เสร็จสิ้น',
                order.payment_status === 'Cancelled' ? 'ยกเลิก' : 'ยกเลิก'
              }}
            </td>
            <td>{{ order.total_amount }} บาท</td>
            <td>{{ formatDate(order.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>



    <!-- Active Item 4: Manage Personal Information -->
    <div v-if="activeItem === 2" class="profile-content">
      <h2>จัดการข้อมูลส่วนตัว</h2>
      <div class="profile-header">
        <div class="profile-picture">
          <img :src="user.profilePicture || 'https://via.placeholder.com/100'" alt="Profile Picture" />
          <button class="upload-button">📷</button>
        </div>
        <div class="join-date">วันที่เข้าร่วม <span>{{ user.joinDate }}</span></div>
      </div>
      <div class="profile-info">
        <label>Username ที่ใช้ในการ Login</label>
        <input type="text" v-model="user.username" readonly />
        <label>ชื่อ *</label>
        <input type="text" v-model="user.firstName" />
        <label>นามสกุล *</label>
        <input type="text" v-model="user.lastName" />
      </div>
      <button class="update-button" @click="updateProfile">อัพเดท</button>
    </div>

    <!-- Active Item 5: Manage Shipping Addresses -->
    <div v-if="activeItem === 3" class="profile-content">
      <h2>จัดการที่อยู่จัดส่ง</h2>
      <button @click="openAddAddressModal" class="add-address-button">เพิ่มที่อยู่จัดส่ง</button>

      <div class="address-list">
        <div v-for="address in addresses" :key="address.id" class="address-card">
          <h3>{{ address.label }}</h3>
          <p>{{ address.address_line1 }}, {{ address.address_line2 }}</p>
          <p>{{ address.city }}, {{ address.postal_code }}</p>
          <p>เบอร์โทรศัพท์: {{ address.phone }}</p>
          <button @click="editAddress(address)" class="edit-button">แก้ไข</button>
          <button @click="deleteAddress(address.address_id)" class="delete-button">ลบ</button>
        </div>
      </div>

      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h3>เพิ่มที่อยู่จัดส่งใหม่</h3>
          <label>ที่อยู่</label>
          <input type="text" v-model="newAddress.label" placeholder="เช่น บ้านเลขที่, หมู่บ้าน" />
          <label>ตำบล</label>
          <select v-model="newAddress.address_line1">
            <option value="ห้วยหมอนทอง">ห้วยหมอนทอง</option>
          </select>
          <label>อำเภอ</label>
          <select v-model="newAddress.address_line2">
            <option value="กำแพงแสน">กำแพงแสน</option>
          </select>
          <label>จังหวัด</label>
          <select v-model="newAddress.city">
            <option value="นครปฐม">นครปฐม</option>
          </select>
          <label>รหัสไปรษณีย์</label>
          <select v-model="newAddress.postal_code">
            <option value="73140">73140</option>
          </select>
          <label>เบอร์โทรศัพท์</label>
          <input type="tel" pattern="[0-9]*" v-model="newAddress.phone" maxlength="10" placeholder="เบอร์โทรศัพท์" />
          <div class="modal-actions">
            <button @click="addAddress" v-if="!newAddress.address_id" class="save-button">บันทึก</button>
            <button @click="updateAddress" v-else class="save-button">อัปเดต</button>
            <button @click="closeModal" class="cancel-button">ยกเลิก</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      activeItem: 0, // Default to 0
      menuItems: [
        "รายการสั่งซื้อของฉัน",
        "รายการสั่งซื้อรอชำระ",
        "จัดการข้อมูลส่วนตัว",
        "จัดการที่อยู่จัดส่ง",
      ],
      user: {
        firstName: '',
        joinDate: '2024-10-27T00:00:00.000Z',
        lastName: '',
        username: '',
        profilePicture: '',
      },
      orders: [],
      filteredOrders: [],
      pendingOrders: [],
      favoriteProducts: [],
      favoriteStores: [],
      addresses: [],
      userReviews: [],
      searchQuery: "",
      showModal: false,
      newAddress: { label: '', address_line1: 'ห้วยหมอนทอง', address_line2: 'กำแพงแสน', city: 'นครปฐม', postal_code: '73140', phone: '' },
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    },
    setActiveItem(index) {
      this.activeItem = index;
      this.fetchContent();
    },
    async fetchContent() {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token not found.");

        const decoded = jwt_decode(token);
        this.userId = decoded.user_id;
        const response = await axios.get(`http://localhost:8800/api/v1/customers/${this.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('User profile:', this.userId);

        const users = response.data;
        this.user = {
          username: users.email || users.phone,
          firstName: users.first_name,
          lastName: users.last_name,
          joinDate: users.created_at,
        };
        switch (this.activeItem) {
          case 0:
            const allOrdersResponse = await axios.get(`http://localhost:8800/api/v1/payments/customer/${this.userId}`);
            this.orders = allOrdersResponse.data;
            this.filteredOrders = this.orders;
            break;
          case 1:
            const pendingOrdersResponse = await axios.get(`http://localhost:8800/api/v1/orders/customer/${this.userId}`)
            this.pendingOrders = pendingOrdersResponse.data.filter(order => order.order_status === 'Pending');
            break;
          case 2:
            await this.fetchUserProfile();
            break;
          case 3:
            const addressesResponse = await axios.get(`http://localhost:8800/api/v1/address/customer/${this.userId}`);
            this.addresses = addressesResponse.data;
            break;
        }
      } catch (error) {
        console.error('Failed to load content:', error);
      }
    },
    async fetchUserProfile() {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token not found.");

        const decoded = jwt_decode(token);
        this.userId = decoded.user_id;

        const response = await axios.get(`http://localhost:8800/api/v1/customers/${this.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const users = response.data;
        this.user = {
          username: users.email || users.phone,
          firstName: users.first_name,
          lastName: users.last_name,
        };
      } catch (error) {
        console.error('Error fetching user profile:', error);
        alert('Failed to load profile data');
      }
    },
    async editAddress(address) {
      // Populate `newAddress` with existing data to pre-fill modal for editing
      this.newAddress = { ...address };
      this.showModal = true;
    },

    openAddAddressModal() {
      this.newAddress = { label: '', address_line1: 'ห้วยหมอนทอง', address_line2: 'กำแพงแสน', city: 'นครปฐม', postal_code: '73140', phone: '' };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async addAddress() {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token not found.");

        const decoded = jwt_decode(token);
        this.userId = decoded.user_id;
        await axios.post(`http://localhost:8800/api/v1/address/customer/${this.userId}`, this.newAddress);
        Swal.fire({
          icon: 'success',
          title: 'คุณได้ทำการเพิ่มที่อยู่เรียบร้อยแล้ว',
          text: 'Address added successfully!',
          confirmButtonText: 'OK',
        })
        this.fetchContent();
        this.closeModal();
      } catch (error) {
        console.error('Failed to add address:', error);
      }
    },
    async updateProfile() {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token not found.");

        const decoded = jwt_decode(token);
        const userId = decoded.user_id;

        const response = await axios.put(`http://localhost:8800/api/v1/customers/${userId}`, {
          first_name: this.user.firstName,
          last_name: this.user.lastName,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'อัปเดตข้อมูลสำเร็จ',
            text: 'Your profile information has been updated successfully!',
            confirmButtonText: 'OK',
          });
        } else {
          throw new Error("Failed to update profile");
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'Could not update profile. Please try again later.',
          confirmButtonText: 'OK',
        });
      }
    },
    async updateAddress() {
      try {
        await axios.put(`http://localhost:8800/api/v1/address/${this.newAddress.address_id}`, this.newAddress);
        this.fetchContent(); // Refresh the address list
        Swal.fire({
          icon: 'success',
          title: 'คุณได้ทำการอัปเดตที่อยู่เรียบร้อยแล้ว',
          text: 'Address updated successfully!',
          confirmButtonText: 'OK',
        })
        this.showModal = false;
      } catch (error) {
        console.error('Failed to update address:', error);
        alert('Failed to update address. Please try again.');
      }
    },
    async deleteAddress(addressId) {

      if (Swal.fire({
        icon: 'info',
        title: 'คุณแน่ใจหรือไม่ว่าต้องการลบที่อยู่นี้',
        text: 'Are you sure you want to delete this address?',
        confirmButtonText: 'OK',
      })) {
        try {
          await axios.delete(`http://localhost:8800/api/v1/address/${addressId}`);
          this.fetchContent(); // Refresh the address list
        } catch (error) {
          console.error('Failed to delete address:', error);
          alert('Failed to delete address. Please try again.');
        }
      }
    },
    navigateToPayment(orderId) {
      this.$router.push({ path: '/pay', query: { orderId } });
    },
    navigateToOrderDetails(orderId) {
      this.$router.push({ path: '/order-details', query: { orderId } });
    }
  },
  mounted() {
    // Set activeItem from query parameter if available
    const queryItem = parseInt(this.$route.query.activeItem, 10);
    if (!isNaN(queryItem)) {
      this.activeItem = queryItem;
    }

    this.fetchContent();
  },
};

</script>


<style scoped>
.profile-page {
  display: flex;
  font-family: Arial, sans-serif;
}

.profile-sidebar {
  width: 200px;
  height: 100vh;
  background-color: #f8f8f8;
  padding: 20px;
  border-right: 1px solid #ddd;
}

.profile-sidebar ul {
  list-style: none;
  padding: 0;
}

.profile-sidebar li {
  padding: 10px;
  cursor: pointer;
}

.profile-sidebar li.active {
  font-weight: bold;
  color: #007bff;
}

.profile-content {
  flex: 1;
  padding: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-picture {
  position: relative;
  width: 80px;
  height: 80px;
  margin-right: 20px;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.upload-button {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #ddd;
  border: none;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
}

.join-date {
  color: #555;
}

.profile-info {
  margin-bottom: 20px;
}

.profile-info label {
  display: block;
  font-weight: bold;
  margin-top: 10px;
}

.profile-info input {
  width: 20%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.username-container {
  display: flex;
  align-items: center;
}

.change-username-button {
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.change-username-button:hover {
  background-color: #0056b3;
}

.change-password {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.update-button {
  background-color: #d9534f;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.update-button:hover {
  background-color: #c9302c;
}

.orders-content {
  flex: 1;
  padding: 20px;
}

.main-order-button {
  background-color: #d9534f;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

.main-order-button:hover {
  background-color: #c9302c;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.orders-table th,
.orders-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

.orders-table th {
  background-color: #f2f2f2;
}

.pagination {
  text-align: center;
}

.pagination button {
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
}

.add-address-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
}

.add-address-button:hover {
  background-color: #45a049;
}

/* Address List */
.address-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

/* Address Card */
.address-card {
  background-color: #f9f9f9;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
}

.address-card h3 {
  font-size: 18px;
  margin-bottom: 5px;
  color: #333;
}

.address-card p {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

/* Edit and Delete Buttons */
.edit-button,
.delete-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
}

.edit-button {
  background-color: #007bff;
  color: white;
  margin-right: 10px;
}

.edit-button:hover {
  background-color: #0069d9;
}

.delete-button {
  background-color: #d9534f;
  color: white;
}

.delete-button:hover {
  background-color: #c9302c;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
}

.modal-content label {
  font-weight: bold;
  margin-top: 10px;
  display: block;
  color: #555;
}

.modal-content input,
.modal-content select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.save-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #45a049;
}

.cancel-button {
  background-color: #d9534f;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #c9302c;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background-color: #f9f9f9;
}
</style>