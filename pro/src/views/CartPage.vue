<template>
  <div class="cart-page">
    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumb">
      <p><a href="/home">หน้าแรก</a> > รถเข็นของคุณ </p>
    </nav>

    <!-- Progress Tracker -->
    <div class="progress-tracker">
      <div class="step active">รายการรถเข็นของคุณ</div>
    </div>

    <!-- Cart Items Header -->
    <div class="cart-header">
      <span>รูป</span>
      <span>สินค้า</span>
      <span>ราคา</span>
      <span>จำนวน</span>
      <span>ยอดรวม</span>
      <span></span>
    </div>

    <!-- Cart Items List -->
    <div class="cart-items">
      <div class="cart-item" v-for="(item, index) in cartItems" :key="index">
        <img :src="item.product_images[0]?.image_url" alt="Product Image" class="item-image" />
        <div class="item-info">
          <p class="item-name">{{ item.name }}</p>
        </div>
        <p class="item-price">{{ item.price }} บาท</p>
        <div class="item-quantity">
          <button @click="decreaseQuantity(index)">-</button>
          <input type="number" v-model="item.quantity" min="1" />
          <button @click="increaseQuantity(index)">+</button>
        </div>
        <p class="item-total">{{ item.price * item.quantity }} บาท</p>
        <button class="remove-item" @click="removeItem(index)"><i class="fa fa-remove"></i></button>
      </div>
    </div>

    <!-- Order Summary -->
    <div class="order-summary">
      <p class="summary-label">สรุปคำสั่งซื้อทั้งหมด</p>
      <p class="total-amount">ยอดรวมทั้งหมด: {{ totalAmount }} บาท</p>
      <button class="pay-button" @click="checkout">ชำระเงิน</button>
    </div>
  </div>
</template>

<script>
// import router from '@/router';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

export default {
  data() {
    return {
      cartItems: [],
      user_id: 1,  // Replace with the actual user ID from your application
      address_id: 1,  // Replace with the selected address ID from the user's address list
      shipping_cost: 0.00,
    };
  },
  computed: {
    totalAmount() {
      return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    },
  },
  methods: {
    increaseQuantity(index) {
      this.cartItems[index].quantity++;
      this.saveCart();
    },
    decreaseQuantity(index) {
      if (this.cartItems[index].quantity > 1) {
        this.cartItems[index].quantity--;
        this.saveCart();
      }
    },
    removeItem(index) {
      this.cartItems.splice(index, 1);
      this.saveCart();
    },
    saveCart() {
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    },
    async checkout() {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token not found.");

      const decoded = jwt_decode(token);
      this.userId = decoded.user_id;

      const orderId = Math.floor(Date.now() / 1000);

      const items = this.cartItems.map(item => ({
        order_id: orderId,
        product_id: item.product_id,
        vendor_id: item.vendor_id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      if (this.totalAmount < 50) {
        this.shipping_cost = 50.00;
      } 
      if (this.totalAmount >= 50 && this.totalAmount < 200) {
        this.shipping_cost = 35.00;
      } 
      if (this.totalAmount >= 200 && this.totalAmount < 500) {
        this.shipping_cost = 20.00;
      } 
      if (this.totalAmount >= 500) {
        this.shipping_cost = 0.00;
      } 

      // Prepare the order data
      const orderData = {
        order_id: orderId,
        user_id: this.userId,
        address_id: this.address_id,
        items: items, // Initially pass items without order_id
        total_amount: this.totalAmount,
        shipping_cost: this.shipping_cost,
      };
      console.log('Order Data:', orderData);

      try {
        // Send a POST request to create the order
        const response = await axios.post('http://localhost:8800/api/v1/orders', orderData);

        console.log('Order Response:', response.data);

        // Retrieve the order ID from the response
        const orderId = response.data.orderId;

        // Add order ID to each item
        const updatedItems = items.map(item => ({
          ...item,
          order_id: orderId,
        }));

        console.log('Updated Items with Order ID:', updatedItems);

        // Clear cart after successful order creation
        this.cartItems = [];
        localStorage.removeItem('cartItems');

        this.$router.push({
          path: '/pay',
          query: { orderId, totalAmount: this.totalAmount, shippingCost: this.shipping_cost },
        });
      } catch (error) {
        console.error('Failed to create order:', error.message);
        alert('Failed to create order. Please try again.');
      }
    },

  },
  mounted() {
    // Load saved cart items from localStorage on page load
    const savedCart = JSON.parse(localStorage.getItem('cartItems'));
    if (savedCart) {
      this.cartItems = savedCart;
    }
  },
};
</script>


<style scoped>
/* Main Container */
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  font-family: 'Prompt', sans-serif;
}

/* Breadcrumb Styles */
.breadcrumb {
  padding: 12px 0;
  margin-bottom: 32px;
  font-size: 14px;
  color: #666;
}

.breadcrumb a {
  color: #2563eb;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* Progress Tracker */
.progress-tracker {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  position: relative;
}

.step {
  padding: 12px 24px;
  background-color: #f3f4f6;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
}

.step.active {
  background-color: #2563eb;
  color: white;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}

/* Cart Header */
.cart-header {
  display: grid;
  grid-template-columns: 100px 2fr 1fr 1fr 1fr 50px;
  gap: 16px;
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 12px;
  margin-bottom: 16px;
  font-weight: 500;
  color: #4b5563;
}

/* Cart Items */
.cart-items {
  margin-bottom: 32px;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 2fr 1fr 1fr 1fr 50px;
  gap: 16px;
  align-items: center;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info {
  padding-right: 16px;
}

.item-name {
  font-weight: 500;
  color: #1f2937;
  margin: 0;
}

.item-price {
  font-weight: 500;
  color: #2563eb;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-quantity button {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-quantity button:hover {
  background-color: #f3f4f6;
  border-color: #2563eb;
  color: #2563eb;
}

.item-quantity input {
  width: 50px;
  height: 32px;
  text-align: center;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
}

.item-total {
  font-weight: 600;
  color: #2563eb;
}

.remove-item {
  width: 32px;
  height: 32px;
  border: none;
  background-color: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-item:hover {
  background-color: #fecaca;
  transform: scale(1.1);
}

/* Order Summary */
.order-summary {
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-top: 32px;
}

.summary-label {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.total-amount {
  font-size: 24px;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 24px;
}

.pay-button {
  width: 100%;
  padding: 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pay-button:hover {
  background-color: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
}

/* Empty Cart State */
.empty-cart {
  text-align: center;
  padding: 48px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.empty-cart img {
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-cart p {
  color: #6b7280;
  margin-bottom: 24px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .cart-header {
    display: none;
  }

  .cart-item {
    grid-template-columns: 80px 1fr;
    grid-template-areas:
      "image name"
      "image price"
      "image quantity"
      "total total"
      "remove remove";
    padding: 16px;
    gap: 8px;
  }

  .item-image {
    grid-area: image;
    width: 70px;
    height: 70px;
  }

  .item-info {
    grid-area: name;
  }

  .item-price {
    grid-area: price;
  }

  .item-quantity {
    grid-area: quantity;
  }

  .item-total {
    grid-area: total;
    text-align: right;
    padding-top: 8px;
    border-top: 1px solid #e5e7eb;
  }

  .remove-item {
    grid-area: remove;
    width: 100%;
    margin-top: 8px;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cart-item {
  animation: fadeIn 0.3s ease-out;
}

/* Loading State */
.skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>