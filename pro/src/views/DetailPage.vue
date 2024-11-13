<template>
  <div class="product-details-page">
    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumb">
      <a href="/home">หน้าแรก</a> > 
        <a v-if="product.category === 'ผัก'" href="/vegtetable">
          {{ product.category }}
        </a>
        <a v-if="product.category === 'ผลไม้'" href="/fruit">
          {{ product.category }}
        </a> > 
        {{ product.name }}
    </nav>

    <!-- Product Content -->
    <div class="product-content">
      <!-- Product Image and Gallery -->
      <div class="product-gallery">
        <img :src="product.mainImage" alt="Product Image" class="main-image" />
        <div class="thumbnail-gallery">
          <img v-for="(image, index) in product.images" :key="index" :src="image.image_url" alt="Thumbnail"
            class="thumbnail-image" @click="changeMainImage(image.image_url)" />
        </div>
      </div>

      <!-- Product Information -->
      <div class="product-info">
        <h1 class="product-name">{{ product.name }}</h1>
        <div class="vendor-info">
          <span>{{ product.vendorName }}</span> | <span>{{ product.vendorLocation }}</span>
        </div>
        <div class="product-rating">
          <span>⭐⭐⭐⭐⭐</span>
        </div>
        <p class="product-price-label">ราคาปัจจุบัน</p>
        <p class="product-price">{{ product.price }} บาท </p>
        <p class="product-weight">{{ product.weight }}</p>
        <p class="product-stock">สต็อกสินค้า: 
          {{ 
            product.stock_status === 'Available' ? 'มีสินค้า' : 'สินค้าหมด'
          }}

        </p>
      </div>

      <!-- Order Section -->
      <!-- <div class="order-details">
          <h2>รายละเอียดการสั่งซื้อ</h2>
          <div class="quantity-selector">
            <label for="quantity">จำนวน:</label>
            <div class="quantity-control">
              <button @click="decreaseQuantity">-</button>
              <input type="number" v-model="quantity" min="1" />
              <button @click="increaseQuantity">+</button>
            </div>
            <span>ถุง</span>
          </div>
          <button class="inquiry-btn">ติดต่อราคา</button>
          <button class="add-to-cart-btn">เพิ่มในตะกร้า</button>
        </div> -->
    </div>

    <!-- Additional Information Tabs -->
    <div class="additional-info-tabs">
      <button class="tab active">รายละเอียดสินค้า</button>
    </div>

    <div class="tab-content">
      <p>{{ product.description }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ["id"],
  data() {
    return {
      product: {
        name: "",
        vendorName: "",
        vendorLocation: "",
        mainImage: "",
        images: [],
        weight: "",
        price: 0,
        stockStatus: "",
        description: ""
      },
      quantity: 1,
    };
  },
  mounted() {
    this.loadProductData();
  },
  methods: {
    async loadProductData() {
      try {
        const response = await axios.get(`http://localhost:8800/api/v1/products/${this.id}`);
        const productData = response.data;
        this.product = {
          name: productData.name,
          vendorName: productData.vendorName,
          vendorLocation: productData.vendorLocation,
          mainImage: productData.images[0]?.image_url || '',
          images: productData.images,
          weight: productData.weight,
          price: productData.price,
          stock_status: productData.stockStatus,
          description: productData.description,
          category: productData.categories.name,
        };
      } catch (error) {
        console.log("Error fetching product details:", this.id);
        console.error("Error fetching product details:", error);
      }
    },
    changeMainImage(imageUrl) {
      this.product.mainImage = imageUrl;
    },
    increaseQuantity() {
      this.quantity++;
    },
    decreaseQuantity() {
      if (this.quantity > 1) this.quantity--;
    },
  },
};
</script>

<style scoped>
/* Main Container */
.product-details-page {
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

/* Product Content Layout */
.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
}

/* Product Gallery Styles */
.product-gallery {
  width: 100%;
}

.main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.thumbnail-gallery {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.thumbnail-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 2px solid transparent;
}

.thumbnail-image:hover {
  transform: translateY(-2px);
  border-color: #2563eb;
}

/* Product Information Styles */
.product-info {
  padding: 24px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.product-name {
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.vendor-info {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
}

.product-rating {
  margin-bottom: 24px;
  color: #fbbf24;
}

.product-price-label {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 8px;
}

.product-price {
  font-size: 32px;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 16px;
}

.product-weight {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 8px;
}

.product-stock {
  font-size: 14px;
  color: #059669;
  padding: 8px 16px;
  background-color: #d1fae5;
  border-radius: 6px;
  display: inline-block;
}

/* Additional Info Tabs */
.additional-info-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.tab {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.tab.active {
  color: #2563eb;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #2563eb;
}

.tab-content {
  padding: 24px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  line-height: 1.6;
  color: #4b5563;
}

/* Order Section Styles (Commented out in HTML but styled for future use) */
.order-details {
  margin-top: 24px;
  padding: 24px;
  background-color: #f9fafb;
  border-radius: 12px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-control button {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  background-color: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quantity-control button:hover {
  background-color: #f3f4f6;
}

.quantity-control input {
  width: 60px;
  height: 32px;
  text-align: center;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .main-image {
    height: 300px;
  }

  .product-name {
    font-size: 24px;
  }

  .product-price {
    font-size: 28px;
  }

  .additional-info-tabs {
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
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

.product-info {
  animation: fadeIn 0.5s ease-out;
}

/* Hover Effects */
.tab:hover {
  color: #2563eb;
  background-color: #f3f4f6;
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