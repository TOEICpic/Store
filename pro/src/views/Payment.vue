<template>
  <div class="payment-page">
    <a href="/home">หน้าแรก</a> > รถเข็นของคุณ > ขั้นตอนการสั่งซื้อ
    <h2 class="page-title">ขั้นตอนการสั่งซื้อ</h2>

    <!-- Display Order and Address Information -->
    <div v-if="order">
      <!-- Step 1: Delivery Method -->

      <!-- Step 2: Address Selection -->
      <div class="section">
        <div class="section-header">
          <span class="step-number">1</span> ที่อยู่จัดส่ง
        </div>
        <div class="address-details">
          <p><strong>{{ selectedAddress?.label }}</strong> {{ selectedAddress?.address_line1 }} {{
            selectedAddress?.address_line2 }} {{ selectedAddress?.city }} {{ selectedAddress?.postal_code }}</p>
          <p>เบอร์โทรศัพท์ {{ selectedAddress?.phone }}</p>
          <button class="change-address-btn" @click="showAddressOptions = !showAddressOptions">
            เปลี่ยนที่อยู่
          </button>
          <button class="add-address-btn" @click="showAddAddressModal = true">
            เพิ่มที่อยู่
          </button>
          <!-- Dropdown for address selection -->
          <div v-if="showAddressOptions" class="address-dropdown">
            <ul>
              <li v-for="address in addresses" :key="address.id" @click="selectAddress(address)">
                {{ address.label }} - {{ address.address_line1 }} {{ address.address_line2 }} {{ address.city }} {{
                  address.postal_code }}
              </li>
            </ul>
          </div>
        </div>

        <div v-if="showAddAddressModal" class="modal">
          <div class="modal-content">
            <h3>เพิ่มที่อยู่ใหม่</h3>
            <form @submit.prevent="addNewAddress">
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

              <button type="submit" class="save-address-btn">บันทึกที่อยู่</button>
              <button type="button" @click="showAddAddressModal = false" class="cancel-btn">ยกเลิก</button>
            </form>
          </div>
        </div>
      </div>

      <!-- Step 3: Order Summary -->
      <div class="section">
        <div class="section-header">
          <span class="step-number">2</span> รายการสินค้าที่สั่งซื้อ
        </div>
        <table class="order-summary">
          <thead>
            <tr>
              <th></th>
              <th>สินค้า</th>
              <th>จำนวน</th>
              <th>ราคาต่อหน่วย</th>
              <th>รวม</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.order_items" :key="item.order_item_id">
              <td>
                <img :src="item.products.product_images[0].image_url" alt="Product Image" class="product-image" />
              </td>
              <td>{{ item.products.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.unit_price }} บาท</td>
              <td>{{ item.quantity * item.unit_price }} บาท</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Step 4: Payment Method Selection -->
      <div class="section">
        <div class="section-header">
          <span class="step-number">3</span> เลือกวิธีการชำระเงิน
        </div>
        <div class="payment-options">
          <button class="payment-option" :class="{ active: selectedPayment === 'QR_Code' }"
            @click="handleQRCodePaymentSelection">
            QR Code
          </button>
          <button class="payment-option" :class="{ active: selectedPayment === 'Cash_on_Delivery' }"
            @click="selectPaymentOption('Cash_on_Delivery')">
            เก็บเงินปลายทาง
          </button>
        </div>
      </div>

      <div v-if="showQRCodeModal" class="modal">
        <div class="modal-content">
          <h3>QR Code สำหรับการชำระเงิน</h3>
          <img ref="qrCanvas" alt="QR Code Image" />
          <p>จำนวนเงิน: {{ grandTotal }} บาท</p>
          <button @click="closeQRCodeModal">ปิด</button>
        </div>
      </div>
      <div v-if="selectedPayment === 'QR_Code'" class="payment-status">
        <h3>สถานะการชำระเงิน:
        <span :class="{ Paid: paymentStatus === 'Paid', unpaid: paymentStatus === 'Unpaid' }">
          {{ paymentStatusText }}
        </span>
        </h3>

        <div class="payment-proof">
          <h3>อัปโหลดหลักฐานการชำระเงิน</h3>
          <input type="file" @change="onFileSelected" accept="image/*" class="file-input" />
          
          <div v-if="paymentImage" class="image-preview">
            <h4>Preview:</h4>
            <img :src="paymentImage" alt="Payment Proof" class="preview-image" />
          </div>
        </div>
      </div>



      <!-- Step 5: Total Summary -->
      <div class="section">
        <div class="section-header">
          <span class="step-number">4</span> สรุปยอดรวม
        </div>
        <div class="summary">
          <p><strong>ยอดรวม:</strong> {{ order.total_amount }} บาท</p>
          <p><strong>ค่าจัดส่ง:</strong> {{ order.shipping_cost }} บาท</p>
          <p><strong>ยอดรวมทั้งหมด:</strong> {{ grandTotal }} บาท</p>
          <button class="confirm-button" @click="confirmOrder">ยืนยันการสั่งซื้อ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import generatePayload from 'promptpay-qr';
import QRious from 'qrious';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const order = ref(null);
    const addresses = ref([]);
    const selectedAddress = ref(null);
    const selectedDelivery = ref('delivery');
    const showAddressOptions = ref(false);
    const showAddAddressModal = ref(false);
    const selectedPayment = ref(null);
    const showQRCodeModal = ref(false);
    const qrCanvas = ref(null);
    const paymentStatus = ref('Unpaid'); // Tracks if payment is completed or not
    const paymentImage = ref(null);

    const onFileSelected = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          paymentImage.value = reader.result; // Set the image as a base64 URL
          paymentStatus.value = 'Paid'; // Set payment status to 'Paid' once an image is selected
        };
        reader.readAsDataURL(file);
      } else {
        reader.onload = () => null; // Reset the reader
        paymentImage.value = null;
        paymentStatus.value = 'Unpaid'; // Set payment status to 'Unpaid' if no image is selected
      }
    };


    const paymentStatusText = computed(() => {
      return paymentStatus.value === 'Paid' ? 'ชำระแล้ว' : 'ยังไม่ได้ชำระเงิน';
    });

    const newAddress = ref({
      label: '',
      address_line1: 'ห้วยหมอนทอง',
      address_line2: 'กำแพงแสน',
      city: 'นครปฐม',
      postal_code: '73140',
      phone: '',
    });

    const fetchOrderDetails = async () => {
      const orderId = route.query.orderId;
      try {
        const response = await axios.get(`http://localhost:8800/api/v1/orders/${orderId}`);
        order.value = response.data;
      } catch (error) {
        console.error('Failed to fetch order:', error);
      }
    };

    const fetchUserAddresses = async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token not found.");

      const decoded = jwt_decode(token);
      const userId = decoded.user_id;
      try {
        const response = await axios.get(`http://localhost:8800/api/v1/address/customer/${userId}`);
        addresses.value = response.data;
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
      }
    };

    const selectDeliveryOption = (option) => {
      selectedDelivery.value = option;
    };

    const selectPaymentOption = (option) => {
      selectedPayment.value = option;
    };

    const selectAddress = (address) => {
      selectedAddress.value = address;
      showAddressOptions.value = false; // Hide dropdown after selection
    };

    const grandTotal = computed(() => {
      return order.value ? parseInt(order.value.total_amount) + parseInt(order.value.shipping_cost) : 0;
    });

    const handleQRCodePaymentSelection = () => {
      selectedPayment.value = 'QR_Code';
      generateQRCode();
    };

    const generateQRCode = () => {
      const amount = grandTotal.value;
      const promptPayID = '0626737386'; // Replace with actual PromptPay ID

      // Generate the PromptPay QR payload
      const qrCodeData = generatePayload(promptPayID, { amount });

      // Display the modal first
      paymentStatus.value = 'Pending';
      showQRCodeModal.value = true;

      // Wait for the DOM to update before accessing qrCanvas
      nextTick(() => {
        if (qrCanvas.value) {
          // Create the QRious instance and set the image source to the QR code data
          const qr = new QRious({
            value: qrCodeData,
            size: 250,
          });
          qrCanvas.value.src = qr.toDataURL(); // Convert to image URL
        } else {
          console.error("qrCanvas element not found.");
        }
      });
    };
    const markAsPaid = () => {
      paymentStatus.value = 'Paid'; // Update status to "Paid"
    };

    const closeQRCodeModal = () => {
      showQRCodeModal.value = false;
    };

    const addNewAddress = async () => {
      try {
        const token = localStorage.getItem('token');
        const decoded = jwt_decode(token);
        const userId = decoded.user_id;

        const response = await axios.post(`http://localhost:8800/api/v1/address/customer/${userId}`, {
          ...newAddress.value,
          customer_id: userId,
        });

        addresses.value.push(response.data);
        selectedAddress.value = response.data;
        showAddAddressModal.value = false;

        Swal.fire({
          icon: 'success',
          title: 'ที่อยู่ใหม่ถูกเพิ่มเรียบร้อยแล้ว',
          confirmButtonText: 'OK'
        });
      } catch (error) {
        console.error('Failed to add new address:', error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาดในการเพิ่มที่อยู่ใหม่',
          confirmButtonText: 'OK'
        });
      }
    };

    const confirmOrder = async () => {
      if (!selectedAddress.value || !selectedPayment.value) {
        if (!selectedAddress.value) {
          Swal.fire({
            icon: 'info',
            title: 'กรุณาเลือกที่อยู่จัดส่ง',
            text: 'Please select a delivery address',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            icon: 'info',
            title: 'กรุณาเลือกวิธีการชำระเงิน',
            text: 'Please select a payment method',
            confirmButtonText: 'OK'
          });
        }
        return;
      }

      if (selectedPayment.value === 'QR_Code') {
        if (paymentStatus.value !== 'Paid') {
          Swal.fire({
            icon: 'info',
            title: 'กรุณาชำระเงินก่อนยืนยันการสั่งซื้อ',
            text: 'Please complete the payment before confirming the order',
            confirmButtonText: 'OK'
          });
          return;
        }else {
          try {
            // Update the order with selected address and mark as completed
            await axios.put(`http://localhost:8800/api/v1/orders/${order.value.order_id}`, {
              order_status: 'Completed',
              address_id: selectedAddress.value.address_id, // Use correct address ID here
            });
          } catch (error) {
            console.error('Failed to update order:', error);
            Swal.fire({
              icon: 'error',
              title: 'เกิดข้อผิดพลาดในการอัพเดทการสั่งซื้อ',
              text: 'Please try again later.',
            });
            return;
          }
        }
      }
        
      if (selectedPayment.value === 'Cash_on_Delivery') {
        try {
          // Update the order with selected address and mark as completed
          await axios.put(`http://localhost:8800/api/v1/orders/${order.value.order_id}`, {
            order_status: 'Processing',
            address_id: selectedAddress.value.address_id, // Use correct address ID here
          });
        } catch (error) {
          console.error('Failed to update order:', error);
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาดในการอัพเดทการสั่งซื้อ',
            text: 'Please try again later.',
          });
          return;
        }
      }


      const paymentData = {
        order_id: order.value.order_id,
        paymentMethod: selectedPayment.value,
        amount: grandTotal.value,
      };

      try {
        const response = await axios.post('http://localhost:8800/api/v1/pays', paymentData);
        if (response.status === 200) {
          // Update the order status to "paid" if payment is successful
          paymentStatus.value = true; // Mark payment as completed

          Swal.fire({
            icon: 'success',
            title: 'การชำระเงินสำเร็จ',
            text: 'Payment completed successfully!',
            confirmButtonText: 'OK'
          }).then(() => {
            router.push('/profile'); // Redirect to profile or another relevant page
          });
        }
      } catch (error) {
        console.error('Failed to complete payment or update order status:', error);
        alert('การชำระเงินล้มเหลว กรุณาลองอีกครั้ง');
      }
    };


    onMounted(() => {
      fetchOrderDetails();
      fetchUserAddresses();
    });

    return {
      order,
      addresses,
      markAsPaid,
      showQRCodeModal,
      qrCanvas,
      generateQRCode,
      closeQRCodeModal,
      selectedAddress,
      selectedDelivery,
      paymentImage,
      paymentStatusText,
      onFileSelected,
      selectedPayment,
      showAddressOptions,
      selectDeliveryOption,
      selectPaymentOption,
      selectAddress,
      newAddress,
      showAddAddressModal,
      addNewAddress,
      handleQRCodePaymentSelection,
      grandTotal,
      confirmOrder,
      paymentStatus,
    };
  },
};
</script>

<style scoped>
body {
    margin: 0;
    background-color: #f4f4f4;
}

.payment-page {
    font-family: Arial, sans-serif;
    padding: 20px;
    max-width: 800px;
    margin: auto;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-title {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
}

.section {
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f9f9f9;
}

.section-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #007bff;
}

img.product-image {
    max-width: 100px;
    height: auto;
    border-radius: 5px;
}

.step-number {
    font-weight: bold;
    color: #fff;
    background-color: #007bff;
    border-radius: 15px;
    padding: 5px 10px;
    margin-right: 10px;
}

.address-details, .summary {
    margin-top: 10px;
}

.address-dropdown li {
    list-style: none;
    padding: 5px;
    cursor: pointer;
    background-color: #f2f2f2;
    border-radius: 5px;
    margin-bottom: 5px;
}

.change-address-btn,
.add-address-btn,
.save-address-btn,
.cancel-btn,
.confirm-button,
.payment-option {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;
}

.payment-option {
    background-color: #007bff;
}

.payment-option.active {
    background-color: #0056b3;
}

.change-address-btn {
    background-color: #ffc107;
}

.cancel-btn {
    background-color: #dc3545;
}

.file-input {
    margin-top: 10px;
}

.image-preview {
    margin-top: 10px;
}

.preview-image {
    max-width: 100%;
    height: auto;
}

.order-summary {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

.order-summary th,
.order-summary td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.order-summary th {
    background-color: #f2f2f2;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    max-width: 400px;
    width: 100%;
}

.modal-content input {
    width: 95%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.modal-content select {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.payment-status {
  margin-top: 20px;
}

.Paid {
  color: green;
  font-weight: bold;
}

.unpaid {
  color: red;
  font-weight: bold;
}
</style>
